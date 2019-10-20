
import Syncer from './Syncer'
import makeCache from './Cache'
import assembleRelatives from './assembleRelatives'
import get from './util/get'

export default class APIManager {
  constructor(config) {
    this.config = config
    this.get = this.send.bind(this, 'GET')
    this.cache = makeCache(this, [
      'personWithRelationships',
      'stories',
      'story',
    ])
    this.syncer = new Syncer(this, [], {
      maxUp: 7,
      maxDown: 1,
      maxWorkers: 5,
      maxTotal: 700
    })
  }

  resetForPerson(pid) {
    this.cache.remove('recordHints', pid)
    // TODO dive into the sources too
    this.cache.remove('sources', pid)
    const promise = this.cache.personWithRelationships(pid)
    if (promise.isFulfilled()) {
      const {parentIds, childIds} = promise.value()
      parentIds.forEach(id => this.cache.remove('personWithRelationships', id))
      // TODO remove children of the parents, and the children
    }
    this.cache.remove('personWithRelationships', pid)
  }

  startSyncing() {
    this.syncer.start(this.user.personId)
  }

  stopSyncing() {
    this.syncer.stop()
  }

  send(method, url, body, type, token) {
    if (!url.match(/^https?:\/\//)) {
      url = this.config.apiBase + url
    }
    // Ok
    return get(method, url, {
      'Content-type': 'application/json',
      Authorization: 'Bearer ' + (token || this.token),
      Accept: 'application/x-fs-v1+json,application/json',
      // "X-FS-Feature-Tag": "generic.relationship.terms",
    }, body, type)
  }

  login() {
    // TODO remove once the redirect URLs are fixed
    const hasEndingSlash = location.host === 'stories.local'
    const redirect = encodeURIComponent(location.protocol + '//' + location.host + (hasEndingSlash ? '/' : ''))
    console.log('want to log in')
    window.location = `${this.config.identBase}/cis-web/oauth2/v3/authorization?response_type=code&client_id=${this.config.clientId}&redirect_uri=${redirect}`
  }

  async loginWithCode(code) {
    const body = `grant_type=authorization_code&client_id=${this.config.clientId}&code=${code}`
    const result = await get('POST', this.config.identBase + '/cis-web/oauth2/v3/token', {
      'Content-type': 'application/x-www-form-urlencoded',
      Accept: 'application/x-fs-v1+json,application/json',
    }, body)
    if (result.access_token) {
      localStorage.token = result.access_token
      return await this.checkToken(result.access_token)
    }
  }

  logOut() {
    delete localStorage.token
    this.user = null
  }

  async checkToken(token) {
    try {
      this.user = await this.getUser(token)
    } catch (e) {
      if (e.status !== 401) {
        console.error('Unexpected error while fetching user', e)
      }
      return false
    }
    this.token = token
    return true
  }

  getUser(token) {
    return this.get('/platform/users/current', null, 'json', token)
      .then(data => {
        if (data.errors) {
          throw new Error('Errors! ' + JSON.stringify(data.errors))
        }
        if (!data.users || !data.users.length) {
          throw new Error('No user returned')
        }
        return data.users[0]
      })
  }

  personWithRelationships(pid) {
    return this.get(`/platform/tree/persons/${pid}/families`)
      .then(data => {
        console.log('person with relationships', data)
        return assembleRelatives(pid, data)
      })
  }

  // personWithRelationships(pid) {
  //   return this.get(`/platform/tree/persons-with-relationships?person=${pid}&persons=`)
  //     .then(data => assembleRelatives(pid, data))
  // }

  placeByName(name) {
    return this.get(`/platform/places/search?q=name:${encodeURIComponent(name)}`)
      .then(data => data.entries.length && data.entries[0].content.gedcomx.places[0])
  }

  memories(pid) {
    return this.get(`/platform/tree/persons/${pid}/memories`)
      .then(data => unPageMemories(this, data))
  }

  stories(pid) {
    // TODO support 'application/pdf'
    return this.memories(pid).filter(memory => memory.mediaType.match(/text\/plain/))
  }

  story(url) {
    return this.get(url, null, 'text')
  }

  portraitURL(pid) {
    return `${this.config.apiBase}/platform/tree/persons/${pid}/portrait`
  }
}

const unPageMemories = async (api, data) => {
  if (!data) return []
  const stories = data.sourceDescriptions
  const ids = stories.reduce((obj, story) => (obj[story.id] = true, obj), {})
  if (!data.links.last) return stories
  const last = data.links.last.href
  while (data.links.next && data.links.last && data.links.last.href === last && data.links.self.href !== last) {
    data = await api.get(data.links.next.href)
    if (!data) {
      break
    }
    data.sourceDescriptions.forEach(story => {
      if (ids[story.id]) {
        return
      }
      ids[story.id] = true
      stories.push(story)
    })
  }
  return stories
}


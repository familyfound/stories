// @flow

import Syncer from './Syncer'
import makeCache from './Cache'
import assembleRelatives, {type Relatives} from './assembleRelatives'
import get from './util/get'
import type {MemoriesResponse, SourceDescription as Story, User, FamiliesApiResponse} from './api-types'

export type Config = {
  apiBase: string,
  identBase: string,
  clientId: string,
}

export default class APIManager {
  config: Config
  cache: {
    remove: (section: string, key: string) => void,
    personWithRelationships: (pid: string) => Promise<Relatives>,
    stories: (pid: string) => Promise<Array<Story>>,
    story: (url: string) => Promise<string>,
  }
  syncer: Syncer
  user: ?User
  token: ?string
  constructor(config: Config) {
    this.config = config
    // this.get = this.send.bind(this, 'GET')
    this.cache = makeCache(this, [
      'personWithRelationships',
      'stories',
      'story',
    ]);
    this.syncer = new Syncer(this, [], {
      maxUp: 7,
      maxDown: 1,
      maxWorkers: 5,
      maxTotal: 700
    })
  }

  resetForPerson(pid: string) {
    this.cache.remove('recordHints', pid)
    // TODO dive into the sources too
    this.cache.remove('sources', pid)
    const promise = this.cache.personWithRelationships(pid)
    // $FlowIgnore bluebird promises
    if (promise.isFulfilled()) {
      // $FlowIgnore bluebird promises
      const {parentIds, childIds} = promise.value()
      parentIds.forEach(id => this.cache.remove('personWithRelationships', id))
      // TODO remove children of the parents, and the children
    }
    this.cache.remove('personWithRelationships', pid)
  }

  startSyncing() {
    if (!this.user) {
      throw new Error('Cannot start syncing without a user');
    }
    this.syncer.start(this.user.personId)
  }

  stopSyncing() {
    this.syncer.stop()
  }

  send<T>(method: 'GET' | 'POST', url: string, body?: ?string, type?: string, token?: string): Promise<T> {
    if (!url.match(/^https?:\/\//)) {
      url = this.config.apiBase + url
    }
    const authToken = token || this.token;
    if (!authToken) {
      return Promise.reject(new Error('Cannot make a request without an auth token'))
    }
    // Ok
    return get(method, url, {
      'Content-type': 'application/json',
      Authorization: 'Bearer ' + authToken,
      Accept: 'application/x-fs-v1+json,application/json',
      "X-FS-Feature-Tag": "generic.relationship.terms",
    }, body, type)
  }

  login() {
    // TODO remove once the redirect URLs are fixed
    const hasEndingSlash = location.host === 'stories.local'
    const redirect = encodeURIComponent(location.protocol + '//' + location.host + (hasEndingSlash ? '/' : ''))
    console.log('want to log in')
    window.location = `${this.config.identBase}/cis-web/oauth2/v3/authorization?response_type=code&client_id=${this.config.clientId}&redirect_uri=${redirect}`
  }

  async loginWithCode(code: string) {
    const body = `grant_type=authorization_code&client_id=${this.config.clientId}&code=${code}`
    const {access_token}: {
      access_token: ?string,
    } = await get('POST', this.config.identBase + '/cis-web/oauth2/v3/token', {
      'Content-type': 'application/x-www-form-urlencoded',
      Accept: 'application/x-fs-v1+json,application/json',
    }, body)
    if (access_token) {
      localStorage.setItem('token', access_token);
      return await this.checkToken(access_token)
    }
  }

  logOut() {
    localStorage.removeItem('token');
    this.user = null
  }

  async checkToken(token: string) {
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

  getUser(token: string): Promise<User> {
    return this.send('GET', '/platform/users/current', null, 'json', token)
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

  personWithRelationships(pid: string) {
    return this.send('GET', `/platform/tree/persons/${pid}/families`)
      .then((data: FamiliesApiResponse) => {
        console.log('person with relationships', data)
        return assembleRelatives(pid, data)
      })
  }

  // personWithRelationships(pid) {
  //   return this.get(`/platform/tree/persons-with-relationships?person=${pid}&persons=`)
  //     .then(data => assembleRelatives(pid, data))
  // }

  placeByName(name: string) {
    return this.send('GET', `/platform/places/search?q=name:${encodeURIComponent(name)}`)
      .then(data => data.entries.length && data.entries[0].content.gedcomx.places[0])
  }

  memories(pid: string): Promise<Array<Story>> {
    return this.send('GET', `/platform/tree/persons/${pid}/memories`)
      .then((data: MemoriesResponse) => unPageMemories(this, data))
  }

  stories(pid: string): Promise<Array<Story>> {
    // TODO support 'application/pdf'
    return this.memories(pid).then(memories => memories.filter(memory => memory.mediaType.match(/text\/plain/)))
  }

  story(url: string): Promise<string> {
    return this.send('GET', url, null, 'text')
  }

  portraitURL(pid: string) {
    return `${this.config.apiBase}/platform/tree/persons/${pid}/portrait`
  }
}

const unPageMemories = async (api: APIManager, data: MemoriesResponse) => {
  if (!data) return []
  const stories = data.sourceDescriptions
  const ids: {[key: string]: boolean} = stories.reduce((obj, story) => (obj[story.id] = true, obj), {})
  if (!data.links.last) return stories
  const last = data.links.last.href
  while (data.links.next && data.links.last && data.links.last.href === last && data.links.self.href !== last) {
    let nextData: ?MemoriesResponse = await api.send('GET', data.links.next.href)
    if (!nextData) {
      break
    }
    data = nextData;
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


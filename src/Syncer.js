
import {EventEmitter} from 'events'
import assembleRelatives from './assembleRelatives'
import findReasons from './findReasons'
import calcRelation from './util/calcRelation'

const countWords = text => text.split(/\s+/g).length

class Searcher extends EventEmitter {
  constructor(api, frontier, config) {
    super()
    this.api = api
    this.frontier = frontier && frontier.slice()
    this.storyIds = {}
    this.searched = {}
    this.config = config
    this.max = 5
    this.total = 0
  }

  start(base, max) {
    if (base && !this.frontier || !this.frontier.length) {
      this.frontier = [{pid: base, trail: [], numUp: 0, numDown: 0}]
    }
    this.max = max
    this.foundThisTime = 0

    this.running = true
    this.working = 0
    while (this.working < this.config.maxWorkers && this.frontier.length) {
      this.startWorker()
    }
  }

  stop(completed) {
    if (!this.running) return
    this.running = false
    this.emit('stop', !!completed)
  }

  add(item) {
    if (this.searched[item.pid]) {
      return
    }
    this.searched[item.pid] = true
    this.frontier.push(item)
    if (this.working < this.config.maxWorkers) {
      this.startWorker()
    }
  }

  addRelative(person, rel, trail, numUp, numDown) {
    this.add({
      pid: person.id,
      trail: trail.concat([{
        rel,
        id: person.id,
        name: person.display.name,
        gender: person.display.gender.toLowerCase(),
        lifespan: person.display.lifespan,
        place: person.display.birthPlace || person.display.deathPlace,
      }]),
      numUp,
      numDown,
    })
  }

  startWorker() {
    if (!this.running) return
    this.working += 1
    const item = this.frontier.shift()
    this.processItem(item).catch(err => {
      console.error('Failure in worker', err)
    }).then(() => {
      this.working -= 1
      if (!this.running) return
      if (this.frontier.length) {
        this.startWorker()
      } else if (this.working === 0) {
        this.stop(true)
      }
    })
  }

  evaulate({pid, trail, numUp, numDown}, relatives) {
    const that = this
    this.api.cache.stories(pid).then(async (stories) => {
      if (!stories.length) return
      const person = {
        pid,
        trail,
        display: relatives.person.display,
        relation: calcRelation(trail, numUp, numDown),
        href: relatives.person.identifiers['http://gedcomx.org/Persistent'][0],
      }
      for (const story of stories) {
        let text = null
        let words = 0
        if (!that.storyIds[story.id]) {
          that.storyIds[story.id] = true
          text = await that.api.story(story.about)
          words = countWords(text)
        }
        that.emit('story', {
          ...story,
          text,
          words,
          archived: null,
          title: story.titles ?
            story.titles[0].value :
            person.display.name,
          dateAdded: new Date(),
          people: [person],
        })
      }
    }).catch(err => {
      console.error('failed to get stories')
    })
  }

  async processItem({pid, trail, numUp, numDown}) {
    const relatives = await this.api.cache.personWithRelationships(pid)
    const person = relatives.person

    this.evaulate({pid, trail, numUp, numDown}, relatives)

    // parents
    if (numUp < this.config.maxUp && !numDown) {
      relatives.parents.forEach(({mother, father}) => {
        if (mother) {
          this.addRelative(mother, 'mother', trail, numUp + 1, numDown)
        }
        if (father) {
          this.addRelative(father, 'father', trail, numUp + 1, numDown)
        }
      })
    }

    // children
    if (numDown < this.config.maxDown) {
      relatives.childIds.forEach(childId => {
        const child = relatives.persons[childId]
        this.addRelative(child, 'child', trail, numUp, numDown + 1)
      })
    }

    this.total += 1
    this.emit('current', {display: person.display, total: this.total})

    if (this.total >= this.config.maxTotal) {
      this.stop(true)
    }
  }
}

export default Searcher

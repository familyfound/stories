import PromiseObj from './util/PromiseObj'

const NOT_INITIALIZED = Symbol('Database not initialized!')

export type DbState = {
  hasStarted: boolean,
  lastSync: ?number,
  lastSyncStart: ?number,
  people: {[key: string]: Person},
  stories: {[key: string]: Story},
}

export default class Database {
  constructor() {
    this._db = NOT_INITIALIZED
  }

  init(userId) {
    const db = this._db = new Dexie('all-the-stories:' + userId)
    db.version(1).stores({
      settings: 'id',
      stories: 'id, dateAdded',
      // TODO add `owner`, to support multi-login
      people: 'pid, dateAdded',
    })
    return db.open()
  }

  getState() {
    if (this._db === NOT_INITIALIZED) {
      return {
        hasStarted: false,
        lastSync: null,
        lastSyncStart: null,
        people: {},
        stories: {},
      }
    }
    return PromiseObj({
      hasStarted: this._db.settings.get('hasStarted').then(val => val ? true : false),
      lastSync: this._db.settings.get('lastSync').then(val => val ? val.date : null),
      lastSyncStart: this._db.settings.get('lastSyncStart').then(val => val ? val.date : null),
      people: this._db.people.toArray()
        .then(val => (val || []).reduce(
          (obj, item) => (obj[item.pid] = item, obj),
          {}
        )),
      stories: this._db.stories.orderBy('dateAdded').toArray()
        .then(val => (val || []).reduce(
          (obj, item) => (obj[item.id] = item, obj),
          {}
        )),
    })
  }

  setStarted() {
    return this._db.settings.put({id: 'hasStarted', date: new Date()})
  }

  addStory(item) {
    return this._db.stories.put(item)
  }

  addPerson(person) {
    return this._db.people.put(person)
  }

  removeStory(pid) {
    return this._db.stories.delete(pid)
  }

  setStoryPeople(id, people) {
    return this._db.stories.update(id, {people})
  }

  setArchived(id, archived) {
    return this._db.stories.update(id, {archived})
  }

  setStarred(id, starred) {
    return this._db.stories.update(id, {starred})
  }

  setLastSyncStart(date) {
    this._db.settings.put({id: 'lastSyncStart', date})
  }

  setLastSync(date) {
    this._db.settings.put({id: 'lastSync', date})
  }
}

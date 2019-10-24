// @flow
import PromiseObj from './util/PromiseObj'
import type {EmitStory, StoryPerson, EmitPerson} from './types'
import type {DbState} from './types'

declare var Dexie;

export default class Database {
  _db: ?Dexie
  constructor() {
    this._db = null
  }

  init(userId: string): Promise<void> {
    const db = this._db = new Dexie('all-the-stories:' + userId)
    db.version(1).stores({
      settings: 'id',
      stories: 'id, dateAdded',
      // TODO add `owner`, to support multi-login
      people: 'pid, dateAdded',
    })
    return db.open()
  }

  getState(): Promise<DbState> {
    const {_db} = this;
    if (!_db) {
      return Promise.resolve({
        hasStarted: false,
        lastSync: null,
        lastSyncStart: null,
        people: {},
        stories: {},
      })
    }
    return PromiseObj({
      hasStarted: _db.settings.get('hasStarted').then(val => val ? true : false),
      lastSync: _db.settings.get('lastSync').then(val => val ? val.date : null),
      lastSyncStart: _db.settings.get('lastSyncStart').then(val => val ? val.date : null),
      people: _db.people.toArray()
        .then(val => (val || []).reduce(
          (obj, item) => (obj[item.pid] = item, obj),
          {}
        )),
      stories: _db.stories.orderBy('dateAdded').toArray()
        .then(val => (val || []).reduce(
          (obj, item) => (obj[item.id] = item, obj),
          {}
        )),
    })
  }

  setStarted(): Promise<void> {
    if (!this._db) return Promise.reject('Not initialized')
    return this._db.settings.put({id: 'hasStarted', date: new Date()})
  }

  addStory(item: EmitStory): Promise<void> {
    if (!this._db) return Promise.reject('Not initialized')
    return this._db.stories.put(item)
  }

  addPerson(person: EmitPerson): Promise<void> {
    if (!this._db) return Promise.reject('Not initialized')
    return this._db.people.put(person)
  }

  removeStory(pid: string): Promise<void> {
    if (!this._db) return Promise.reject('Not initialized')
    return this._db.stories.delete(pid)
  }

  setStoryPeople(id: string, people: Array<StoryPerson>): Promise<void> {
    if (!this._db) return Promise.reject('Not initialized')
    return this._db.stories.update(id, {people})
  }

  setArchived(id: string, archived: ?number): Promise<void> {
    if (!this._db) return Promise.reject('Not initialized')
    return this._db.stories.update(id, {archived})
  }

  setStarred(id: string, starred: boolean): Promise<void> {
    if (!this._db) return Promise.reject('Not initialized')
    return this._db.stories.update(id, {starred})
  }

  setLastSyncStart(date: Date): Promise<void> {
    if (!this._db) return Promise.reject('Not initialized')
    return this._db.settings.put({id: 'lastSyncStart', date}).then(() => null)
  }

  setLastSync(date: Date): Promise<void> {
    if (!this._db) return Promise.reject('Not initialized')
    return this._db.settings.put({id: 'lastSync', date}).then(() => null)
  }
}

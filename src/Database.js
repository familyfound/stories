import PromiseObj from './util/PromiseObj'

export default class Database {
  constructor() {
    const db = this._db = new Dexie('all-the-stories')
    db.version(1).stores({
      settings: 'id',
      stories: 'id, dateAdded',
    })
  }

  open() {
    return this._db.open()
  }

  getState() {
    return PromiseObj({
      hasStarted: this._db.settings.get('hasStarted').then(val => val ? true : false),
      tabs: this._db.settings.get('tags').then(val => val || []),
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

  removeStory(pid) {
    return this._db.stories.delete(pid)
  }

  setStoryPeople(id, people) {
    return this._db.stories.update(id, {people})
  }
}

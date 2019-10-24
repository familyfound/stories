
import db from './db'
import api from './api'
import history from './history'

export const getStarted = () => {
  db.setStarted()
  return {type: 'getStarted'}
}

export const setLoggedIn = (loginStatus, user) => ({
  type: 'setLoggedIn',
  args: {loginStatus, user}
})

export const logOut = () => {
  api.logOut()
  return {type: 'logOut'}
}

export const startSyncing = () => {
  api.startSyncing()
  const started = new Date()
  db.setLastSyncStart(started)
  return {type: 'startSyncing', args: {started}}
}

export const stopSyncing = (completed: boolean) => {
  api.stopSyncing()
  let completedTime: ?Date = null;
  if (completed) {
    completedTime = new Date()
    db.setLastSync(completedTime)
  }
  return {type: 'stopSyncing', args: {completed: completedTime}}
}

export const setSyncStatus = status => ({
  type: 'setSyncStatus',
  args: {status}
})

export const setSearchText = searchText => ({
  type: 'setSearchText',
  args: {searchText}
})

export const setArchived = (id, archived) => {
  db.setArchived(id, archived)
  return {
    type: 'setArchived',
    args: {id, archived},
  }
}

export const setStarred = (id, starred) => {
  db.setStarred(id, starred)
  return {
    type: 'setStarred',
    args: {id, starred}
  }
}

export const setStoryPeople = (id, people) => {
  db.setStoryPeople(id, people)
  return {
    type: 'setStoryPeople',
    args: {id, people}
  }
}

export const addStory = story => {
  db.addStory(story)
  return {type: 'addStory', args: {story}}
}

export const addPerson = person => {
  db.addPerson(person)
  return {type: 'addPerson', args: {person}}
}


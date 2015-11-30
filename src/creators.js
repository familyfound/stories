
import db from './db'
import api from './api'
import history from './history'

export const getStarted = () => {
  db.setStarted()
  return {type: 'getStarted'}
}

export const setLoggedIn = val => ({
  type: 'setLoggedIn',
  args: {loginStatus: val}
})

export const startSyncing = val => {
  api.startSyncing()
  return {type: 'startSyncing'}
}

export const stopSyncing = completed => {
  api.stopSyncing()
  if (completed) {
    db.setLastSync(new Date())
  }
  return {type: 'stopSyncing'}
}

export const setSyncStatus = status => ({
  type: 'setSyncStatus',
  args: {status}
})

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


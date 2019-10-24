// @flow

import db from './db'
import api from './api'
import history from './history'
import type {EmitStory, StoryPerson, EmitPerson, TrailItem, Action, LoginStatus, SyncStatus} from './types'
import type {User} from './api-types'

export const getStarted = (): Action => {
  db.setStarted()
  return {type: 'getStarted'}
}

export const setLoggedIn = (loginStatus: LoginStatus, user: ?User): Action => ({
  type: 'setLoggedIn',
  args: {loginStatus, user}
})

export const logOut = (): Action =>{
  api.logOut()
  return {type: 'logOut'}
}

export const startSyncing = (): Action =>{
  api.startSyncing()
  const started = new Date()
  db.setLastSyncStart(started)
  return {type: 'startSyncing', args: {started}}
}

export const stopSyncing = (completed: boolean): Action =>{
  api.stopSyncing()
  let completedTime: ?Date = null;
  if (completed) {
    completedTime = new Date()
    db.setLastSync(completedTime)
  }
  return {type: 'stopSyncing', args: {completed: completedTime}}
}

export const setSyncStatus = (status: SyncStatus) => ({
  type: 'setSyncStatus',
  args: {status}
})

export const setSearchText = (searchText: string) => ({
  type: 'setSearchText',
  args: {searchText}
})

export const setArchived = (id: string, archived: ?number): Action =>{
  db.setArchived(id, archived)
  return {
    type: 'setArchived',
    args: {id, archived},
  }
}

export const setStarred = (id: string, starred: boolean): Action =>{
  db.setStarred(id, starred)
  return {
    type: 'setStarred',
    args: {id, starred}
  }
}

export const setStoryPeople = (id: string, people: Array<StoryPerson>): Action =>{
  db.setStoryPeople(id, people)
  return {
    type: 'setStoryPeople',
    args: {id, people}
  }
}

export const addStory = (story: EmitStory) => {
  db.addStory(story)
  return {type: 'addStory', args: {story}}
}

export const addPerson = (person: EmitPerson) => {
  db.addPerson(person)
  return {type: 'addPerson', args: {person}}
}


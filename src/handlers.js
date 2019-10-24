// @flow
import history from './history'

import type {State, EmitStory, StoryPerson, EmitPerson, TrailItem, Action, LoginStatus, SyncStatus} from './types'
import type {User} from './api-types'

export const getStarted = (state: State) => ({
  ...state, hasStarted: true
})

export const setLoggedIn = (state: State, {loginStatus, user}: {loginStatus: LoginStatus, user: ?User}) => ({
  ...state, loginStatus, user
})

export const logOut = (state: State) => ({
  ...state,
  loginStatus: false,
  user: null,
})

export const startSyncing = (state: State, {started}: {started: number}) => ({...state, syncStatus: true, lastSyncStart: started})
export const stopSyncing = (state: State, {completed}: {completed: ?Date}) => ({
  ...state,
  syncStatus: false,
  lastSync: completed || state.lastSync,
})
export const setSyncStatus = (state: State, {status}: {status: SyncStatus}) => ({...state, syncStatus: status})

export const addStory = (state: State, {story}: {story: EmitStory}) => ({
  ...state,
  stories: {...state.stories, [story.id]: story},
})
export const removeStory = (state: State, {id}: {id: string}) => {
  const stories = {...state.stories}
  delete stories[id]
  return {...state, stories}
}

export const addPerson = (state: State, {person}: {person: EmitPerson}) => ({
  ...state,
  people: {...state.people, [person.pid]: person},
})

export const setStoryPeople = (state: State, {id, people}: {id: string, people: Array<StoryPerson>}) =>
  setOnStory(state, id, 'people', people)

const getStoryIndex = (stories, id) => {
  for (let i=0; i<stories.length; i++) {
    if (stories[i].id === id) {
      return i
    }
  }
}

const getNextStory = (searchResults, id) => {
  if (searchResults.length < 2) {
    return
  }
  const ix = getStoryIndex(searchResults, id)
  if (ix == null) {
    return searchResults[searchResults.length - 1]
  }
  if (ix === searchResults.length - 1) {
    return searchResults[searchResults.length - 2]
  }
  return searchResults[ix + 1]
}

export const setArchived = (state: State, {id, archived}: {id: string, archived: ?number}) => {
  if (archived) { // nav to next in list
    const story = getNextStory(state.searchResults, id)
    if (story) {
      history.pushState(null, `/read/${story.id}/${story.title.replace(/\s+/g, '_')}`)
    }
  }
  return setOnStory(state, id, 'archived', archived)
}

export const setStarred = (state: State, {id, starred}: {id: string, starred: boolean}) => (
  setOnStory(state, id, 'starred', starred)
)

export const setOnStory = (state: State, id: string, attr: string, value: any) => ({
  ...state,
  stories: {
    ...state.stories,
    [id]: {...state.stories[id], [attr]: value}
  }
})

export const setSearchText = (state: State, {searchText}: {searchText: string}) => ({
  ...state,
  searchText
})

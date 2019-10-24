import history from './history'

export const getStarted = state => ({
  ...state, hasStarted: true
})

export const setLoggedIn = (state, {loginStatus, user}) => ({
  ...state, loginStatus, user
})

export const logOut = (state) => ({
  ...state,
  loginStatus: false,
  user: null,
})

export const startSyncing = (state, {started}) => ({...state, syncStatus: true, lastSyncStart: started})
export const stopSyncing = (state, {completed}) => ({
  ...state,
  syncStatus: false,
  lastSync: completed || state.lastSync,
})
export const setSyncStatus = (state, {status}) => ({...state, syncStatus: status})

export const addStory = (state, {story}) => ({
  ...state,
  stories: {...state.stories, [story.id]: story},
})
export const removeStory = (state, {id}) => {
  const stories = {...state.stories}
  delete stories[id]
  return {...state, stories}
}

export const addPerson = (state, {person}) => ({
  ...state,
  people: {...state.people, [person.pid]: person},
})

export const setStoryPeople = (state, {id, people}) =>
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

export const setArchived = (state, {id, archived}) => {
  if (archived) { // nav to next in list
    const story = getNextStory(state.searchResults, id)
    if (story) {
      history.pushState(null, `/read/${story.id}/${story.title.replace(/\s+/g, '_')}`)
    }
  }
  return setOnStory(state, id, 'archived', archived)
}

export const setStarred = (state, {id, starred}) => (
  setOnStory(state, id, 'starred', starred)
)

export const setOnStory = (state, id, attr, value) => ({
  ...state,
  stories: {
    ...state.stories,
    [id]: {...state.stories[id], [attr]: value}
  }
})

export const setSearchText = (state, {searchText}) => ({
  ...state,
  searchText
})


export const getStarted = state => ({
  ...state, hasStarted: true
})

export const setLoggedIn = (state, {loginStatus}) => ({
  ...state, loginStatus
})

export const startSyncing = state => ({...state, syncStatus: true})
export const stopSyncing = state => ({...state, syncStatus: false})
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
export const setStoryPeople = (state, {id, people}) => ({
  ...state,
  stories: {
    ...state.stories,
    [id]: {...state.stories[id], people}
  }
})

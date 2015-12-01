
import searchResultsInner from './util/searchResults'

export const searchResults = (newState, oldState) => {
  if (newState.stories === oldState.stories &&
      newState.searchText === oldState.searchText) {
    return
  }
  newState.searchResults = searchResultsInner(newState.stories, newState.searchText)
  return
}

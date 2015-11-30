
import React from 'react'
import View from '../../View'
import Text from '../../Text'
import {Link} from 'react-router'
import Colors from '../../util/Colors'

import probably from '../../probably'
import stateful from '../../util/stateful'
import memOnce from '../../util/memOnce'

import {simpleSearchQuery, parentsSearchQuery} from '../../util/searchQuery'

import SearchResult from './SearchResult'
import TopBar from './TopBar'

const MaybeSearch = props => {
  if (props.personData.personWithRelationships === probably.LOADING ||
      props.personData.sources === probably.LOADING ||
      props.personData.recordHints === probably.LOADING) {
    return <View>Loading information</View>
  }
  if (props.personData.personWithRelationships instanceof Error ||
      props.personData.sources instanceof Error ||
      props.personData.recordHints instanceof Error) {
    return <View>Unable to load person information. Please reload and ensure you are logged in to FamilySearch</View>
  }

  return <Search {...props} />
}

const MaybeSearchResults = props => {
  if (props.searchResults === probably.LOADING) {
    return <View>Loading search results</View>
  }
  if (props.searchResults instanceof Error) {
    return <View>Failed to load search results</View>
  }
  return <SearchResults {...props} />
}

const getAttachedMap = memOnce(sources => sources.reduce((obj, source) => (obj[source.about] = true, obj), {}))

const SearchResults = ({searchResults, personData, attached}) => (
  <View style={styles.searchResults}>
    {searchResults && searchResults.searchHits && searchResults.searchHits.map(hit => (
      <SearchResult
        key={hit.personHit.person.url}
        hit={hit.personHit}
        alreadyAttached={attached[hit.personHit.person.url]}
        personBorn={!personData.personWithRelationships.person.display.meta.estimatedBirth &&
                    personData.personWithRelationships.person.display.meta.born}
        personData={personData}
      />
    ))}
  </View>
)

const SearchMain = ({pid, personData, searching, setSearching, searchResults}) => (
  searching ?
    <View style={styles.resultsContainer}>
      <TopBar {...{searching, setSearching, searchResults, personData}} />
      <MaybeSearchResults {...{searchResults, personData, searching}} attached={getAttachedMap(personData.sources)} />
    </View> :
    <View style={styles.normalContainer}>
      Click something to start searching!
      <button onClick={() => setSearching('normal')}>Default FamilySearch search</button>
    </View>
)

const getSearchQuery = (searching, {personWithRelationships}) => {
  if (!searching) {
    return ''
  }
  let query
  if (searching === 'parents') {
    query = parentsSearchQuery(personWithRelationships)
  } else {
    query = simpleSearchQuery(personWithRelationships.person)
  }
  return query
}

const EmbeddedSearchPage = ({searching, personData, setSearching}) => (
  searching ?
    <View style={styles.resultsContainer}>
      <TopBar {...{searching, setSearching, personData}} />
      <SearchIframe {...{searching, personData}} />
    </View> :
    <View style={styles.normalContainer}>
      Click something to start searching!
      <button onClick={() => setSearching('normal')}>Default FamilySearch search</button>
    </View>
)

// TODO show loading indicator when iframe src is switching
const SearchIframe = ({searching, personData}) => (
  <View style={styles.iframeContainer}>
    <Text style={styles.iframeTitle}>
      FamilySearch.org search results
    </Text>
    <iframe style={styles.iframe} src={`https://familysearch.org/search/record/results?count=20&query=${encodeURIComponent(getSearchQuery(searching, personData))}`} />
  </View>
)

const CustomSearchPage = probably({
  shouldRefresh: (nextProps, prevProps) => (
    prevProps.searching !== nextProps.searching ||
    nextProps.pid !== prevProps.pid ||
    nextProps.personData.personWithRelationships !== prevProps.personData.personWithRelationships
  ),
  promises: ({pid, api, personData: {personWithRelationships}, searching}) => {
    if (!searching) {
      return {searchResults: {searchHits: []}}
    }
    let query
    if (searching === 'parents') {
      query = parentsSearchQuery(personWithRelationships)
    } else {
      query = simpleSearchQuery(personWithRelationships.person)
    }
    return {
      searchResults: api.search(query),
    }
  },
  render: SearchMain
})

const Search = stateful({
  initial: {
    searching: null,
  },
  shouldReset: (nextProps, prevProps) => nextProps.pid !== prevProps.pid,
  render: EmbeddedSearchPage,
})

export default MaybeSearch

const styles = {
  container: {
    flex: 1,
  },

  iframe: {
    minWidth: 1028,
    border: '2px solid #999',
    boxSizing: 'border-box',
    flex: 1,
  },

  iframeContainer: {
    flex: 1,
  },

  resultsContainer: {
    flex: 1,
  },

  searchResults: {
    flex: 1,
    overflow: 'auto',
  },
}


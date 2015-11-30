
import React from 'react'
import View from '../../View'
import Text from '../../Text'
import Button from '../../Button'

const searchTypes = {
  normal: {
    title: 'Name + Birth',
  },
  parents: {
    title: 'Name + Birth + Parents',
    test: ({personWithRelationships: {parentIds}}) => parentIds.length > 0
  }
}

const TopBar = ({searching, setSearching, searchResults, personData}) => (
  <View style={styles.topBar}>
    <View style={styles.searchByText}>
      Search by:
    </View>
    {Object.entries(searchTypes).map(([type, item]) => (
      (!item.test || item.test(personData)) &&
      <Button key={type} style={[styles.searchButton, type === searching && styles.selectedSearchButton]} onClick={searching !== type && (() => setSearching(type))}>
        {item.title}
      </Button>
    ))}
    <View style={styles.spacer} />
    {searchResults && searchResults.searchHits != null &&
      <Text style={styles.numResults}>
        {searchResults.searchHits.length} results
      </Text>}
  </View>
)

export default TopBar

const styles = {
  topBar: {
    flexDirection: 'row',
    padding: '10px 0',
    alignItems: 'center',
  },

  searchByText: {
    fontWeight: 'bold',
    color: '#666',
    marginRight: 20,
    fontSize: '70%',
  },

  spacer: {
    flex: 1,
  },

  numResults: {
    marginLeft: 40,
  },

  searchButton: {
    marginRight: 10,
    padding: '5px 10px',
  },

  selectedSearchButton: {
    backgroundColor: '#eef',
  },
}

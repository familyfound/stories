
import React from 'react'
import View from '../../View'
import Text from '../../Text'

import probably from '../../probably'

const formatLoaded = (num, single, plural) => num === 1 ? `${num} ${single}` : `${num} ${plural}`

const previewers = [
  ({duplicates, pid}) => {
    if (duplicates === probably.LOADING) {
      return 'Loading possible duplicates'
    }
    if (duplicates instanceof Error) {
      return 'Unable to load possible duplicates'
    }
    return duplicates.length ? <a target="_blank" style={styles.link} href={`https://familysearch.org/tree/#view=possibleDuplicates&person=${pid}`}>
      {formatLoaded(duplicates.length, 'possible duplicate', 'possible duplicates')}
    </a> : '0 possible duplicates'
  },
  ({sources}) => {
    if (sources === probably.LOADING) {
      return 'Loading sources'
    }
    if (sources instanceof Error) {
      return 'Unable to load sources'
    }
    return formatLoaded(sources.length, 'source', 'sources')
  },
  ({recordHints}) => {
    if (recordHints === probably.LOADING) {
      return 'Loading hints'
    }
    if (recordHints instanceof Error) {
      return 'Unable to load hints'
    }
    return formatLoaded(recordHints.length, 'record hint', 'record hints')
  },
  ({personWithRelationships}) => {
    if (personWithRelationships === probably.LOADING) {
      return 'Loading parents'
    }
    if (personWithRelationships instanceof Error) {
      return 'Unable to load parents'
    }
    return formatLoaded(personWithRelationships.parentIds.length, 'parent', 'parents')
  },
  ({personWithRelationships}) => {
    if (personWithRelationships === probably.LOADING) {
      return 'Loading children'
    }
    if (personWithRelationships instanceof Error) {
      return 'Unable to load children'
    }
    return formatLoaded(personWithRelationships.childIds.length, 'child', 'children')
  },
]

export default props => (
  <View style={styles.container}>
    {previewers.map((fn, i) => <View style={styles.item} key={i}>{fn(props)}</View>)}
  </View>
)

const styles = {
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },

  item: {
    padding: '3px 7px',
    fontSize: '80%',
  },

  link: {
    textDecoration: 'none',
    cursor: 'pointer',
    color: 'inherit',
  },
}


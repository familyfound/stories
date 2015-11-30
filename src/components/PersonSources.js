
import React from 'react'
import View from '../View'
import Text from '../Text'
import probably from '../probably'
import expandable from '../util/expandable'

import SourceData from './SourceData'

/** TODO
 * - Show whether it's expanded or not
 * - order sources by date
 * - show estimated age @ date of each source
 * - highlight missing / unexpected people in the source
 * - load the data for isPartOf RECORD parents
 * - section by (Census | Children | Personal | Other)
 *   where Personal = my birth, marriage, death
 *   and Children =   ^^^ for a child
 * - suggest sources that may exist (missing census year, etc)
 */

const PersonSources = ({api, sources, personWithRelationships: {person}, isOpen, toggleOpen}) => (
  <View>
    <Text onClick={toggleOpen} style={styles.title}>
      Attached sources ({sources.length})
    </Text>
    {isOpen &&
      <View style={styles.items}>
        {sources.map(source => <Source api={api} key={source.id} source={source} person={person} />)}
      </View>}
  </View>
)

const isFSSource = link => link && !!link.match(/^https:\/\/familysearch.org/)

const Source = probably({
  name: 'PersonSources',
  shouldRefresh: () => true,
  promises: ({api, source}) => ({
    sourceData: isFSSource(source.about) ? api.cache.source(source.about) : null,
  }),
  render:({source, sourceData, person}) => (
    <View style={styles.source}>
      <View style={styles.sourceHeader}>
        <a style={styles.link} href={source.about} target="_blank">
          {sourceData ? '!' : '->'}
        </a>
        <Text style={styles.sourceTitle}>
          {sourceTitle(source, person)}
        </Text>
      </View>
      {sourceData && <SourceData sourceData={sourceData} />}
    </View>
  )
})

const findAllYears = text => {
  const res = []
  text.replace(/\b\d{4}\b/g, val => res.push(parseInt(val)))
  return res
}

const sourceTitle = (source, person) => {
  if (source.citations.length) {
    const match = source.citations[0].value.match(/^"([^"]+)"/)
    if (match) {
      const text = match[1].trim().replace(/,$/, '')
      if (person && person.display && !person.display.meta.estimatedBirth) {
        const years = findAllYears(text)
        const born = person.display.meta.born
        if (years.length === 1) {
          return <Text>{text} <Text style={styles.ageAtSource}>
            ({years[0] - born})
          </Text></Text>
        }
        if (years.length === 2 && years[1] - years[0] < 5) {
          return <Text>{text} <Text style={styles.ageAtSource}>
            ({years[0] - born}-{years[1] - born})
          </Text></Text>
        }
      }
      return text
    }
  }
  if (!source.titles.length) {
    return 'No title'
  }
  let title = source.titles[0].value
  if (title.length > 50) {
    title = title.slice(0, 50) + '...'
  }
  return title
}

const ErrorMessage = () => <View>Unable to load sources</View>
const Loading = () => <View style={styles.loading}>Loading sources</View>

const ExpandablePersonSources = expandable(PersonSources)

const MaybePersonSources = props => {
  if (props.sources === probably.LOADING) {
    return <Loading />
  }
  if (props.sources instanceof Error) {
    return <ErrorMessage />
  }
  return <ExpandablePersonSources {...props} />
}

export default MaybePersonSources

const styles = {
  title: {
    fontWeight: 'bold',
    paddingLeft: 20,
    marginTop: 10,
    marginBottom: 5,
    cursor: 'pointer',
  },

  loading: {
    padding: 20,
  },

  items: {
    maxHeight: 500,
    overflow: 'auto',
  },

  source: {
    paddingBottom: 10,
    marginTop: 10,
    borderBottom: '1px solid #ccc',
  },

  sourceHeader: {
    flexDirection: 'row',
    backgroundColor: '#eee',
  },

  sourceTitle: {
    padding: '10px 20px 10px 5px',
    display: 'block',
    marginRight: 10,
  },

  link: {
    padding: '10px 5px 10px 20px',
    display: 'block',
    marginRight: 10,
    textDecoration: 'none',
  },

  ageAtSource: {
    fontSize: '80%',
    marginLeft: 20,
  },
}



import React from 'react'
import Text from '../Text'
import View from '../View'
import Button from '../Button'
import connect from '../connect'
import {memOnce2} from '../util/memOnce'
import MediaQueried from '../util/MediaQueried'

import PeopleInfo from '../components/PeopleInfo'

const Read = ({story, setArchived, setStarred, ctx}) => (
  <View key={story.id} style={styles.container}>
    <View style={styles.title}>
      <StarButton
        starred={story.starred}
        setStarred={setStarred}
      />
      <ArchiveButton
        archived={!!story.archived}
        setArchived={setArchived}
      />
      <View style={styles.spacer} />
      {story.title}
      <View style={styles.spacer} />
      {storyLink(story)}
    </View>
    <MediaQueried maxWidth={1400}>
      {active =>
        <View style={[styles.body, active && styles.smallBody]}>
          <View style={active ? styles.smallText : styles.text}>
            <Text style={styles.textInner}>
              {annotateText(story.text, story.people)}
            </Text>
          </View>
          <View style={styles.peopleInfo}>
            <PeopleInfo story={story} api={ctx.api} />
          </View>
        </View>
      }
    </MediaQueried>
  </View>
)

function escapeRegExp(str) {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}

const storyLink = story => (
  <a style={styles.link} target="_blank" href={`https://familysearch.org/photos/stories/${story.id}`}>
    View on FamilySearch
  </a>
)

const annotateText = memOnce2((text, people) => {
  const searchWords = {}
  people.forEach(person => {
    person.display.name.split(/\s+/g).forEach(part => {
      searchWords[part] = true
    })
  })
  const find = new RegExp(
    '\\b' +
    Object.keys(searchWords).map(word => `\\b${escapeRegExp(word)}\\b`).join('|') +
    '\\b',
    'gi'
  )
  let at = 0
  const parts = []
  text.replace(find, (match, index, full) => {
    if (index > at) {
      parts.push(text.slice(at, index))
    }
    at = index + match.length
    parts.push(<Text key={index} style={styles.match}>{match}</Text>)
  })
  if (at < text.length - 1) {
    parts.push(text.slice(at))
  }
  return parts
})

const ArchiveButton = ({setArchived, archived}) => (
  <Button
    onClick={() => (archived ? setArchived(null) : setArchived(new Date()))}
    style={styles.archiveButton}
  >
    {archived ? 'Unarchive' : 'Archive'}
  </Button>
)

const StarButton = ({starred, setStarred}) => (
  <Button style={styles.starButton} onClick={() => setStarred(!starred)}>
    {starred ? '★' : '☆'}
  </Button>
)

export default connect({
  props: ['stories'],
  name: 'Read',
  setTitle: ({stories, params: {id: storyId}}) => stories[storyId].title + ' | All the Stories',
  render: ({stories, params: {id: storyId}, ctx}) => (
    stories[storyId] ?
      <Read
        story={stories[storyId]}
        setArchived={archived => ctx.actions.setArchived(storyId, archived)}
        setStarred={starred => ctx.actions.setStarred(storyId, starred)}
        ctx={ctx}
      /> :
      <MissingRead />
  )
})

const MissingRead = () => (
  <View style={styles.container}>
    Story not found
  </View>
)

const styles = {
  container: {
    flex: 1,
  },

  spacer: {
    flex: 1,
  },

  title: {
    textAlign: 'center',
    fontSize: 20,
    padding: '10px 20px',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: '0 1px 5px #ccc',
    zIndex: 100,
  },

  archiveButton: {
    marginRight: 30,
    border: '1px solid #888',
    padding: '5px 10px',
    color: '#888',
  },

  starButton: {
    border: 'none',
    marginRight: 10,
    fontSize: 20,
    padding: 0,
  },

  link: {
    textAlign: 'center',
    textDecoration: 'none',
    marginLeft: 30,
    fontSize: '80%',
  },

  match: {
    fontWeight: 'bold',
  },

  text: {
    flex: 1,
    overflow: 'auto',
    alignItems: 'center',
    borderRight: '2px solid #ccc',
  },

  body: {
    flexDirection: 'row', // TODO make this change based on screen width
    flex: 1,
  },

  smallBody: {
    flexDirection: 'column',
    overflow: 'auto',
  },

  smallText: {
    alignItems: 'center',
    borderBottom: '2px solid #ccc',
    minHeight: 'initial',
  },

  textInner: {
    padding: 30,
    fontSize: 20,
    whiteSpace: 'pre-wrap',
    lineHeight: 1.5,
    fontFamily: 'serif', // TODO find a good font
    maxWidth: 800,
    width: '100%',
  },
}

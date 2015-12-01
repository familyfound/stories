
import React from 'react'
import View from '../View'
import Button from '../Button'
import connect from '../connect'

const Read = ({story, setArchived}) => (
  <View key={story.id} style={styles.container}>
    <View style={styles.title}>
      <ArchiveButton
        archived={!!story.archived}
        setArchived={setArchived}
      />
      {story.title}
    </View>
    <View style={styles.text}>
      <View style={styles.textInner}>
        {story.text}
      </View>
    </View>
  </View>
)

const ArchiveButton = ({setArchived, archived}) => (
  <Button
    onClick={() => (archived ? setArchived(null) : setArchived(new Date()))}
    style={styles.archiveButton}
  >
    {archived ? 'Unarchive' : 'Archive'}
  </Button>
)

export default connect({
  props: ['stories'],
  name: 'Read',
  render: ({stories, params: {id: storyId}, ctx: {actions}}) => (
    stories[storyId] ?
      <Read
        story={stories[storyId]}
        setArchived={archived => actions.setArchived(storyId, archived)}
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
    backgroundColor: '#ddd',
    padding: '5px 10px',
    color: 'white',
  },

  text: {
    alignItems: 'center',
    flex: 1,
    overflow: 'auto',
  },

  textInner: {
    padding: 30,
    fontSize: 20,
    whiteSpace: 'pre-wrap',
    lineHeight: 1.5,
    fontFamily: 'serif', // TODO find a good font
    maxWidth: 800,
  },
}

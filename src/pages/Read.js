
import React from 'react'
import View from '../View'
import Button from '../Button'
import connect from '../connect'

const Read = ({story}) => (
  <View key={story.id} style={styles.container}>
    <View style={styles.title}>
      {story.title}
    </View>
    <View style={styles.text}>
      <View style={styles.textInner}>
        {story.text}
      </View>
    </View>
  </View>
)

export default connect({
  props: ['stories'],
  name: 'Read',
  render: ({stories, params: {id: storyId}}) => (
    stories[storyId] ?
      <Read story={stories[storyId]}/> :
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

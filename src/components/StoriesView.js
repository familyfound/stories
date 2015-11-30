
import React from 'react'
import View from '../View'
import Text from '../Text'
import {Link} from 'react-router'
import Colors from '../util/Colors'

import {memOnce2} from '../util/memOnce'
import probably from '../probably'
import connect from '../connect'
import stateful from '../util/stateful'

const sortedFilteredStories = memOnce2((storyMap, searchText) => {
  if (!storyMap) return []
  let stories = Object.values(storyMap)
  if (searchText) {
    const needle = searchText.toLowerCase()
    stories = stories.filter(story => story.title.toLowerCase().indexOf(needle) !== -1)
  }
  return stories// .sort((a, b) => a.title -  b.title)
})

const StoriesView = ({stories, searchText, setSearchText}) => (
  <View style={styles.container}>
    <input
      style={styles.input}
      value={searchText}
      placeholder="Search for a story..."
      onChange={e => setSearchText(e.target.value)}
    />
    <View style={styles.stories}>
      {sortedFilteredStories(stories, searchText).map(story => (
        <View key={story.id} style={styles.story}>
          <Link
            style={styles.storyLink}
            activeStyle={styles.activeStoryLink}
            to={`/read/${story.id}/${story.title.replace(/\s/g, '_')}`}
          >
            {story.title}
          </Link>
        </View>
      ))}
    </View>
  </View>
)

export default connect({
  props: ['stories'],
  render: stateful({
    initial: {
      searchText: '',
    },
    render: StoriesView,
  })
})

const styles = {
  container: {
    flex: 1,
  },

  input: {
    fontSize: 20,
    padding: '5px 10px',
  },

  stories: {
    flex: 1,
    overflow: 'auto',
    alignItems: 'stretch',
  },

  story: {
    textAlign: 'left',
  },

  storyLink: {
    padding: '10px 20px',
    textDecoration: 'none',
    color: '#666',
    backgroundColor: 'white',
  },

  activeStoryLink: {
    backgroundColor: '#555',
    color: 'white',
  },
}



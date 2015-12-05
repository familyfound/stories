
import React from 'react'
import {Link} from 'react-router'

import View from '../../View'
import Button from '../../Button'
import Text from '../../Text'
import Hoverable from './../Hoverable'

const StoriesList = ({stories}) => (
  <View style={styles.stories}>
    {stories && stories.map(story => (
      <Hoverable style={styles.storyContainer} hoverStyle={styles.storyHover}>
        <Link
          style={story.archived ? styles.storyArchived : styles.storyLink}
          to={`/read/${story.id}/${story.title.replace(/\s+/g, '_')}/`}
        >
          {story.starred && '★'} {story.title}
        </Link>
      </Hoverable>
    ))}
  </View>
)

export default StoriesList

const styles = {
  stories: {
    marginTop: 30,
    alignItems: 'stretch',
    alignSelf: 'stretch',
  },

  storyLink: {
    textDecoration: 'none',
    color: '#55f',
    padding: '10px 20px',
  },

  storyArchived: {
    textDecoration: 'none',
    color: '#55f',
    padding: '10px 20px',
    fontStyle: 'italic',
    color: '#999',
  },

  storyContainer: {
    cursor: 'pointer',
  },

  storyHover: {
    backgroundColor: '#eee',
  },
}

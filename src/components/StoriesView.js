
import React from 'react'
import {findDOMNode} from 'react-dom'
import View from '../View'
import Text from '../Text'
import {Link} from 'react-router'
import Colors from '../util/Colors'

import probably from '../probably'
import connect from '../connect'
import stateful from '../util/stateful'

const renderStory = (story, selected) => (
  story.id == selected ?
    <JumpIntoView><StoryLink key={story.id} story={story} /></JumpIntoView> :
    <StoryLink key={story.id} story={story} />
)

// TODO maybe an accordian view? idk. This is fine for now.
const StoriesView = ({selected, stories, searchResults, searchText, ctx: {actions: {setSearchText}}}) => (
  <View style={styles.container}>
    {/* TODO a "clear" button */}
    <input
      style={styles.input}
      value={searchText}
      placeholder="Search for a story..."
      onChange={e => setSearchText(e.target.value)}
    />
    <View style={styles.stories}>
      <View style={styles.activeStories}>
        {searchResults.map(story => (
          renderStory(story, selected)
        ))}
      </View>
      <View style={styles.archivedStories}>
        <View style={styles.archivedTitle}>
          Archived
        </View>
        {archivedStories(stories).map(story => (
          renderStory(story, selected)
        ))}
      </View>
    </View>
  </View>
)

class JumpIntoView extends React.Component {
  componentDidMount() {
    findDOMNode(this).scrollIntoViewIfNeeded()
  }

  render() {
    return this.props.children
  }
}

const StoryLink = ({story}) => (
  <View style={styles.story}>
    <Link
      style={styles.storyLink}
      activeStyle={styles.activeStoryLink}
      to={`/read/${story.id}/${story.title.replace(/\s/g, '_')}`}
    >
      {story.title}
    </Link>
  </View>
)

const LoggedOutStories = () => (
  <View style={[styles.container, styles.loggedOut]}>
    {/* login to read stories */}
  </View>
)

export default connect({
  props: ['stories', 'searchText', 'searchResults', 'loginStatus'],
  render: props =>
    props.loginStatus === true ?
      <StoriesView {...props} /> :
      <LoggedOutStories />,
})

const archivedStories = storyMap => (
  Object.values(storyMap).filter(story => !!story.archived)
)

const styles = {
  container: {
    flex: 1,
  },

  archivedTitle: {
    backgroundColor: '#eee',
    textAlign: 'center',
    padding: '5px 20px',
  },

  loggedOut: {
    backgroundColor: '#ddd',
  },

  input: {
    fontSize: 20,
    padding: '5px 10px',
  },

  stories: {
    flex: 1,
    overflow: 'auto',
    alignItems: 'stretch',
    paddingBottom: 30,
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



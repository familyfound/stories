
import React from 'react'
import {Link, IndexLink} from 'react-router'

import View from '../View'

import StoriesView from './StoriesView'

const LeftNav = ({storyId, ctx}) => (
  <View style={styles.container}>
    <View style={styles.topItems}>
      <IndexLink style={styles.link} activeStyle={styles.activeLink} to="/">
        All the Stories ○ Home
      </IndexLink>
      {/* TODO map things!
      <Link style={styles.link} activeStyle={styles.activeLink} to="/map">Map</Link>
      */}
    </View>
    <StoriesView selected={storyId} ctx={ctx} />
  </View>
)

export default LeftNav

const styles = {
  container: {
    width: 300,
    borderRight: '1px solid #ccc',
  },
  topItems: {
    flexDirection: 'row',
  },
  link: {
    textDecoration: 'none',
    color: 'white',
    backgroundColor: '#6561FF',
    padding: '5px 10px',
    flex: 1,
    textAlign: 'center',
  },

  activeLink: {
    backgroundColor: '#3733C7',
  },
}


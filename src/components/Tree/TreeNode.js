
import React from 'react'

import View from '../../View'
// TODO maybe use this instead for hover state?
import Hoverable from './../Hoverable'

import posStyles from './posStyles'

const TreeNode = ({gen, num, id, person, selected, hovered, onHover, onClick, organizedStories}) => (
  <View style={[styles.node]}>
    <View
      style={[
        styles.nodeDot,
        posStyles['' + gen + ':' + num],
        selected && styles.nodeDotSelected,
        hovered && styles.nodeDotHovered,
        getStoriesStyle(organizedStories[id]),
      ]}
      onMouseOver={(e) => onHover(id, e)}
      onMouseOut={() => onHover(id)}
      onClick={() => onClick(id)}
    />
  </View>
)

function getStoriesStyle(stories) {
  if (!stories || !stories.length) return
  if (stories.length < 3) {
    return {backgroundColor: '#7188FF'}
  }
  return {backgroundColor: '#423DFF'}
}

export default TreeNode

const styles = {

  nodeDot: {
    position: 'absolute',
    marginLeft: -10,
    marginTop: -10,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#ddd',
    cursor: 'pointer',
  },

  nodeDotHovered: {
    border: '4px solid red',
  },

  nodeDotSelected: {
    border: '4px solid black',
  },
}

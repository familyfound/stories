
import React from 'react'

import View from '../../View'
// TODO maybe use this instead for hover state?

import posStyles from './posStyles'
import stateful from '../../util/stateful'
import HoverTip from './HoverTip'

const TreeNode = ({gen, num, id, person, selected, hovered, onHover, onClick, stories}) => (
  <View>
    <View
      style={[
        styles.nodeDot,
        posStyles['' + gen + ':' + num],
        selected && styles.nodeDotSelected,
        hovered && styles.nodeDotHovered,
        getStoriesStyle(stories),
      ]}
      onMouseOver={(e) => onHover(e)}
      onMouseOut={() => onHover()}
      onClick={() => onClick(id)}
    />
    {hovered && person &&
      <HoverTip
        person={person}
        stories={stories}
        pos={hovered}
      />}
  </View>
)

function getStoriesStyle(stories) {
  if (!stories || !stories.length) return
  if (stories.length < 3) {
    return {backgroundColor: '#7188FF'}
  }
  return {backgroundColor: '#423DFF'}
}

export default stateful({
  initial: {
    hovered: null,
  },
  shouldUpdate: (nextProps, prevProps) => (
    nextProps.selected !== prevProps.selected ||
    nextProps.id !== prevProps.id ||
    nextProps.stories !== prevProps.stories
  ),
  helpers: {
    onHover: (props, state, evt) => {
      if (!evt) {
        return {hovered: false}
      }
      return {
        hovered: {
          x: evt.pageX,
          y: evt.pageY,
        }
      }
    },
  },
  render: TreeNode,
})

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


import React from 'react'
import {Link} from 'react-router'

import View from '../../View'
import Button from '../../Button'
import Text from '../../Text'
import connect from '../../connect'
import stateful from '../../util/stateful'
import memOnce, {memOnce2} from '../../util/memOnce'

import flattenTree from './flattenTree'
import TreeNode from './TreeNode'
import PersonInfo from './PersonInfo'

const HEIGHT = 400
const WIDTH = 650

const TreeDisplay = ({people, mainPerson, organizedStories, selected, hovered, onClick, onHover}) => (
  <View style={styles.treeDisplay}>
    {flattenTree(people, mainPerson).map((props, i) =>
      <TreeNode key={props.id + ':' + i} {...props} {...{
        organizedStories,
        onClick,
        onHover,
        selected: selected === props.id,
        hovered: hovered && hovered.id === props.id,
      }} />)}
    <View style={styles.treeDisplayLabel}>
      <Text>Stories</Text>
      <Text style={styles.treeDisplaySmall}>in your Family Tree</Text>
    </View>
  </View>
)

const organizeStories = memOnce(stories => {
  const map = {}
  Object.values(stories).forEach(story => story.people.forEach(person => {
    if (map[person.pid]) {
      map[person.pid].push(story)
    } else {
      map[person.pid] = [story]
    }
  }))
  return map
})

const Tree = ({stories, people, user: {personId: mainPerson}, selected, hovered, onClick, onHover, syncStatus}) => (
  <View style={styles.container}>
    <TreeDisplay
      people={people}
      mainPerson={mainPerson}
      selected={selected}
      onClick={onClick}
      onHover={onHover}
      hovered={hovered}
      organizedStories={organizeStories(stories)}
    />
    {selected && people[selected] &&
      <PersonInfo
        person={people[selected]}
        people={people}
        mainPerson={mainPerson}
        organizedStories={organizeStories(stories)}
      />}
    {hovered && people[hovered.id] &&
      <HoverTip
        person={people[hovered.id]}
        organizedStories={organizeStories(stories)}
        pos={hovered.pos}
      />}
  </View>
)

const HoverTip = ({person, pos, organizedStories}) => (
  <View style={[styles.hoverTip, {
    top: pos.y,
    left: pos.x,
  }]}>
    <Text style={styles.hoverName}>
      {person.display.name}
    </Text>
    {person.relation}
    <Text>
      {organizedStories[person.pid] ? organizedStories[person.pid].length : 0} stories found
    </Text>
  </View>
)

export default connect({
  props: ['stories', 'people', 'user', 'syncStatus'],
  setTitle: ({people, location}) => {
    if (location.query.person && people[location.query.person]) {
      return people[location.query.person].display.name + ' | All the Stories'
    }
    return 'All the Stories'
  },

  render: stateful({
    initial: {
      hovered: null,
    },
    helpers: {
      onHover: (props, state, id, evt) => {
        if (state.hovered && state.hovered.id === id && !evt) {
          return {hovered: null}
        }
        if (!evt) return
        return {
          hovered: {
            id,
            pos: {
              x: evt.pageX,
              y: evt.pageY,
            }
          }
        }
      },
    },
    render: props => (
      props.user ? <Tree
        {...props}
        onClick={id => props.ctx.history.pushState(null, '/?person=' + id)}
        selected={props.location.query.person || props.user.personId}
      /> : <span> No login </span>
    ),
  })
})

const styles = {
  container: {
    padding: '20px 0 50px',
    boxSizing: 'border-box',
    minWidth: WIDTH,
    flex: 1,
    overflow: 'auto',
    alignSelf: 'stretch',
    alignItems: 'center',
  },

  hoverTip: {
    zIndex: 1000,
    position: 'fixed',
    padding: 10,
    backgroundColor: 'white',
    mouseEvents: 'none',
    marginTop: 20,
    marginLeft: 40,
    alignItems: 'center',
    boxShadow: '0 1px 5px #ccc',
  },

  hoverName: {
    fontWeight: 'bold',
    marginBottom: 5,
  },

  treeDisplay: {
    position: 'relative',
    height: HEIGHT,
    width: WIDTH,
    marginBottom: 100,
  },

  treeDisplayLabel: {
    left: 0,
    right: 0,
    position: 'absolute',
    top: '100%',
    alignItems: 'center',
    color: '#777',
  },

  treeDisplaySmall: {
    fontSize: '80%',
    marginTop: 5,
  },

}


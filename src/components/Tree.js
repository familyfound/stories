
import React from 'react'
import View from '../View'
import Button from '../Button'
import Text from '../Text'
import connect from '../connect'
import stateful from '../util/stateful'
import memOnce from '../util/memOnce'
import {Link} from 'react-router'

const HEIGHT = 400
const WIDTH = 700

const TreeDisplay = ({people, mainPerson, organizedStories, selected, onClick}) => (
  <View style={styles.treeDisplay}>
    <TreeNode
      gen={0}
      num={0}
      id={mainPerson}
      {...{people, organizedStories, selected, onClick}}
    />
  </View>
)

const arc = Math.PI * 1.5

// TODO precompute? and store as a map?
function getPosStyle(gen, num) {
  const r = 200 / 9 * gen * Math.pow(1.1, gen)
  const theta = arc / (Math.pow(2, gen)) * (num + .5) - arc / 2
  return {
    top: HEIGHT * .8 - Math.cos(theta) * r,
    left: WIDTH/2 + Math.sin(theta) * r,
  }
}

function getStoriesStyle(stories) {
  if (!stories || !stories.length) return
  if (stories.length < 3) {
    return {backgroundColor: 'green'}
  }
  return {backgroundColor: 'red'}
}

const TreeNode = ({gen, num, id, selected, onClick, people, organizedStories}) => (
  <View style={[styles.node]}>
    {gen < 7 && people[id] &&
     !!people[id].parents.length &&
     people[id].parents[0].mother &&
      <TreeNode
        gen={gen + 1}
        num={num * 2}
        people={people}
        onClick={onClick}
        selected={selected}
        id={people[id].parents[0].mother}
        organizedStories={organizedStories}
      />}
    {gen < 7 && people[id] &&
     !!people[id].parents.length &&
     people[id].parents[0].father &&
      <TreeNode
        gen={gen + 1}
        num={num * 2 + 1}
        people={people}
        onClick={onClick}
        selected={selected}
        id={people[id].parents[0].father}
        organizedStories={organizedStories}
      />}

    <View
      style={[
        styles.nodeDot,
        getPosStyle(gen, num),
        people[id] && styles.nodeDotLoaded,
        selected === id && styles.nodeDotSelected,
        getStoriesStyle(organizedStories[id]),
      ]}
      onClick={people[id] && (() => onClick(id))}
    />
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

const Tree = ({stories, people, mainPerson, selected, onClick, syncStatus}) => (
  <View style={styles.container}>
    <TreeDisplay
      people={people}
      mainPerson={mainPerson}
      selected={selected}
      onClick={onClick}
      organizedStories={organizeStories(stories)}
    />
    {selected &&
      <PersonInfo
        person={people[selected]}
        people={people}
        mainPerson={mainPerson}
        organizedStories={organizeStories(stories)}
      />}
  </View>
)

const PersonInfo = ({person, people, mainPerson, organizedStories}) => (
  <View style={styles.personInfo}>
    <Text style={styles.top}>
      {person.display.name}
      {organizedStories[person.pid] ?
        organizedStories[person.pid].length : 0} Stories
    </Text>
    <View style={styles.stories}>
      {organizedStories[person.pid] &&
        organizedStories[person.pid].map(story => (
          <Link to={`/read/${story.id}/${story.title.replace(/\s+/g, '_')}/`}>
            {story.title}
          </Link>
        ))}
    </View>
  </View>
)

export default connect({
  props: ['stories', 'people', 'mainPerson', 'syncStatus'],
  render: stateful({
    initial: {
      selected: null,
    },
    helpers: {
      onClick: (props, state, id) => ({
        selected: state.selected === id ? null : id,
      }),
    },
    render: Tree,
  })
})

const styles = {
  container: {
    marginTop: 50,
    width: WIDTH,
    flex: 1,
    overflow: 'auto',
  },

  treeDisplay: {
    position: 'relative',
    height: HEIGHT,
    width: WIDTH,
    marginBottom: 100,
  },

  nodeDot: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#ddd',
  },

  nodeDotLoaded: {
    backgroundColor: '#999',
    cursor: 'pointer',
  },

  personInfo: {
    alignItems: 'center',
    zIndex: 100,
  },
}


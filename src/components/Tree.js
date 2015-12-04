
import React from 'react'
import View from '../View'
import Button from '../Button'
import Text from '../Text'
import connect from '../connect'
import stateful from '../util/stateful'
import memOnce, {memOnce2} from '../util/memOnce'
import {Link} from 'react-router'

const HEIGHT = 400
const WIDTH = 750

const flattenTree = memOnce2((people, mainPerson) => {
  if (!mainPerson || !people[mainPerson]) return []
  const peopleList = []
  const add = (id, gen, num) => {
    if (!people[id]) return
    const person = people[id]
    peopleList.push({
      id,
      gen,
      num,
      person,
      mother: person.parents.length && person.parents[0].mother,
      father: person.parents.length && person.parents[0].father,
    })
    // TODO find siblings
  }

  add(mainPerson, 0, 0)
  for (let i=0; i<peopleList.length; i++) {
    if (peopleList[i].gen < 8) {
      const {mother, father, gen, num} = peopleList[i]
      add(mother, gen + 1, num * 2 + 1)
      add(father, gen + 1, num * 2)
    }
  }

  return peopleList
})

const TreeDisplay = ({people, mainPerson, organizedStories, selected, hovered, onClick, onHover}) => (
  <View style={styles.treeDisplay}>
    {flattenTree(people, mainPerson).map(props =>
      <TreeNode {...props} {...{
        organizedStories,
        onClick,
        onHover,
        selected: selected === props.id,
        hovered: hovered === props.id,
      }} />)}
  </View>
)

const arc = Math.PI * 1.5

const posStyles = {}
for (let gen=0; gen<8; gen++) {
  const maxNum = Math.pow(2, gen)
  for (let num=0; num<maxNum; num++) {
    posStyles['' + gen + ':' + num] = getPosStyle(gen, num)
  }
}

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
    return {backgroundColor: '#7188FF'}
  }
  return {backgroundColor: '#423DFF'}
}

const TreeNode = ({gen, num, id, person, selected, hovered, onHover, onClick, organizedStories}) => (
  <View style={[styles.node]}>
    <View
      style={[
        styles.nodeDot,
        posStyles['' + gen + ':' + num], // getPosStyle(gen, num),
        selected && styles.nodeDotSelected,
        hovered && styles.nodeDotHovered,
        getStoriesStyle(organizedStories[id]),
      ]}
      onMouseOver={() => onHover(id)}
      onMouseOut={() => onHover(id)}
      onClick={() => onClick(id)}
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

const Tree = ({stories, people, mainPerson, selected, hovered, onClick, onHover, syncStatus}) => (
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
    <View style={styles.personTop}>
      <Text style={styles.name}>
        {person.display.name} {person.display.lifespan}
        {!person.display.meta.estimated &&
          <Text style={styles.personAge}>
            {person.display.meta.age}
          </Text>}
      </Text>
      {person.display.birthPlan &&
        <Text style={styles.birthPlace}>
          {person.display.birthPlace}
        </Text>}
      {person.display.deathPlace &&
        <Text style={styles.deathPlace}>
          {person.display.deathPlace}
        </Text>}
    </View>
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
      hovered: null,
    },
    helpers: {
      onClick: (props, state, id) => ({
        selected: state.selected === id ? null : id,
      }),
      onHover: (props, state, id) => ({
        hovered: state.hovered === id ? null : id,
      }),
    },
    render: Tree,
  })
})

const styles = {
  container: {
    padding: '20px 0',
    boxSizing: 'border-box',
    width: WIDTH,
    flex: 1,
    overflow: 'auto',
  },

  personTop: {
    marginBottom: 10,
  },

  name: {
  },

  treeDisplay: {
    position: 'relative',
    height: HEIGHT,
    width: WIDTH,
    marginBottom: 100,
  },

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

  personInfo: {
    alignItems: 'center',
    zIndex: 100,
  },
}


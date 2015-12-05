
import React from 'react'
import {Link} from 'react-router'

import View from '../View'
import Button from '../Button'
import Text from '../Text'
import connect from '../connect'
import stateful from '../util/stateful'
import memOnce, {memOnce2} from '../util/memOnce'
import Hoverable from './Hoverable'

const HEIGHT = 400
const WIDTH = 650

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
        hovered: hovered && hovered.id === props.id,
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

const PersonInfo = ({person, people, mainPerson, organizedStories}) => (
  <View style={styles.personInfo}>
    <View style={styles.personTop}>
      <Text style={styles.personYears}>
        {person.display.lifespan}
        {!person.display.meta.estimated &&
          <Text style={styles.personAge}>
            {person.display.meta.age}
          </Text>}
      </Text>
      <Text style={styles.name}>
        {person.display.name}
      </Text>
      <Text style={styles.personRelation}>
        {person.relation}
      </Text>
      <Text style={styles.personPlaces}>
        {person.display.birthPlace &&
          <Text style={styles.birthPlace}>
            Born: {person.display.birthPlace}
          </Text>}
        {person.display.deathPlace &&
          <Text style={styles.deathPlace}>
            Died: {person.display.deathPlace}
          </Text>}
      </Text>
    </View>
    <StoriesList stories={organizedStories[person.pid]} />
  </View>
)

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
        selected={props.location.query.person}
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

  personTop: {
    marginBottom: 10,
    alignItems: 'center',
    maxWidth: 400,
  },

  name: {
    textAlign: 'center',
    marginBottom: 10,
    fontWeight: 'bold',
  },

  personRelation: {
    textAlign: 'center',
    fontSize: '90%',
    marginBottom: 10,
  },

  personInfo: {
    alignItems: 'center',
    maxWidth: 800,
  },

  personYears: {
    textAlign: 'center',
    marginBottom: 5,
    fontSize: '80%',
  },

  personAge: {
    marginLeft: 10,
    fontStyle: 'italic',
  },

  personPlaces: {
    fontSize: '90%',
    lineHeight: 1.3,
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


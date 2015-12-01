
import React from 'react'
import Text from '../Text'
import View from '../View'
import Button from '../Button'
import probably from '../probably'

import PersonTrail from './PersonTrail'

const PeopleInfo = ({story, peopleInfo}) => (
  <View style={styles.container}>
    {story.people.map(person => (
      <PersonInfo person={person} info={peopleInfo[person.pid]} />
    ))}
  </View>
)

const PersonInfo = ({person, info}) => (
  <View style={styles.person}>
    <View style={styles.top}>
      <Text style={styles.name}>
        {person.display.name}
      </Text>
      <a style={styles.link} target="_blank" href={person.href}>View on FamilySearch</a>
    </View>
    <Text style={styles.relation}>
      {person.relation}
    </Text>
    <Text style={styles.years}>
      {person.display.lifespan}
      {!person.display.meta.estimated &&
        <Text style={styles.personAge}>
          {person.display.meta.age}
        </Text>}
    </Text>
    {person.display.birthPlace &&
      <Text style={styles.birthPlace}>
        Born: {person.display.birthPlace}
      </Text>}
    {person.display.deathPlace &&
      <Text style={styles.deathPlace}>
        Died: {person.display.deathPlace}
      </Text>}
    <PersonTrail trail={person.trail} />
  </View>
)

export default probably({
  shouldRefresh: (nextProps, prevProps) => false,
  promises: ({api, story}) => {
    const proms = {}
    /* Do we even need this?
    story.people.forEach(person => {
      proms[person.pid] = api.cache.personWithRelationships(pid)
    })
    */
    return proms
  },
  name: 'PeopleInfo',
  render: props => {
    const {story, api, ...peopleInfo} = props
    return <PeopleInfo story={story} peopleInfo={peopleInfo} />
  }
})

const styles = {
  container: {
    padding: 40,
    width: 600,
    flex: 1,
    overflow: 'auto',
  },

  person: {
    marginBottom: 40,
  },

  top: {
    marginBottom: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  name: {
    fontSize: '110%',
    fontWeight: 'bold',
  },

  relation: {
    margin: '5px 0',
  },

  years: {
    margin: '5px 0',
  },

  personAge: {
    fontStyle: 'italic',
    marginLeft: 15,
  },

  birthPlace: {
    margin: '5px 0',
  },
  deathPlace: {
    margin: '5px 0',
  },

  link: {
    textAlign: 'center',
    textDecoration: 'none',
    fontSize: '80%',
  },
}


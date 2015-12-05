
import React from 'react'

import View from '../../View'
import Text from '../../Text'

import StoriesList from './StoriesList'

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

export default PersonInfo

const styles = {
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
}

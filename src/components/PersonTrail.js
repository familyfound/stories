
import React from 'react'
import Text from '../Text'
import View from '../View'
import Button from '../Button'

const rmap = (lst, fn) => {
  const values = []
  lst.forEach(item => values.unshift(fn(item)))
  return values
}

const PersonTrail = ({trail}) => (
  <View style={styles.container}>
    {rmap(trail, person => (
      <View style={styles.person}>
        <Text style={styles.personTop}>
          {person.name} {person.lifespan}
        </Text>
        <Text style={styles.rel}>
          {person.rel}
        </Text>
        <View style={styles.line} />
      </View>
    ))}
    <View style={styles.person}>
      <Text style={styles.personTop}>
        You
      </Text>
    </View>
  </View>
)

export default PersonTrail

const styles = {
  container: {
    alignItems: 'center',
    marginTop: 20,
    fontSize: '80%',
  },

  person: { 
    alignItems: 'center',
  },

  rel: {
    marginTop: 5,
    color: '#555',
  },

  line: {
    width: 2,
    height: 10,
    backgroundColor: '#999',
    margin: '5px 0',
  },
}



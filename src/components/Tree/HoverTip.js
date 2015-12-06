
import React from 'react'
import View from '../../View'
import Text from '../../Text'

const HoverTip = ({person, pos, stories}) => (
  <View style={[styles.hoverTip, {
    top: pos.y,
    left: pos.x,
  }]}>
    <Text style={styles.hoverName}>
      {person.display.name}
    </Text>
    {person.relation}
    <Text>
      {stories ? stories.length : 0} stories found
    </Text>
  </View>
)

export default HoverTip

const styles = {
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
}

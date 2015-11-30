import Text from '../../Text'
import React from 'react'

import evaluateName from './evaluateName'

export default (name, realName) => {
  const parts = evaluateName(name, realName)
  return parts.map(({text, match}, i) => (
    <Text key={i} style={[styles.part, styles[match]]}>{text}</Text>
  ))
}

const styles = {

  part: {
    textTransform: 'capitalize',
    marginRight: 3,
    padding: '2px 4px',
    borderRadius: 2,
  },

  exact: {
    backgroundColor: '#afa',
  },

  close: {
    backgroundColor: '#0fd',
  },

  similar: {
    backgroundColor: '#dfd',
  },

  different: {
    backgroundColor: '#faa',
  },

  extra: {
    backgroundColor: '#aaf',
  },

}


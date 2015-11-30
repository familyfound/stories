

import React from 'react'
import View from '../View'
import Text from '../Text'
import {Link} from 'react-router'

const ResearchHint = ({action, children}) => (
  <Text style={styles.container}>
    {children}
  </Text>
)

export default ResearchHint

const styles = {
  container: {
    padding: 10,
    lineHeight: 1.5,
    fontSize: '80%',
  },
}



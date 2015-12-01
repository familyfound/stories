
import React from 'react'
import View from './View'
import LeftNav from './components/LeftNav'

export default ({params: {id}, ctx, children}) => (
  <View style={styles.container}>
    <LeftNav storyId={id} ctx={ctx} />
    {children}
  </View>
)

const styles = {
  container: {
    position: 'fixed',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    overflow: 'hidden',
    flexDirection: 'row',
  },
}



import React from 'react'
import View from '../View'
import Text from '../Text'

import WelcomeMessage from '../components/WelcomeMessage'
import QueueList from '../components/Queue/QueueList'
import connect from '../connect'

export default connect({
  props: ['hasStarted'],
  name: 'Queue',
  render: ({hasStarted, ctx}) => (
    <View style={styles.container}>
      {!hasStarted ?
        <WelcomeMessage ctx={ctx} /> :
        <QueueList ctx={ctx}/>}
    </View>
  )
})

const styles = {
  container: {
    flex: 1,
  },
};


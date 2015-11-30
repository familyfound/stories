
import React from 'react'
import probably from '../probably'
import Notes from './Queue/Notes'
import View from '../View'

export default probably({
  name: 'PersonNotes',
  parial: true,
  promises: ({pid, api}) => ({
    notes: api.cache.notes(pid),
  }),
  render: ({notes, api}) => <View style={styles.container}><Notes notes={notes} api={api} /></View>
})

const styles = {
  container: {
    padding: '0 20px',
  }
}


import React from 'react'
import View from '../View'
import Button from '../Button'
import stateful from '../util/stateful'

const DeleteButton = ({db, really, toggle}) => (
  really ?
    <View style={styles.deleteButton}>
      <Button style={styles.really} onClick={() => {
        db._db.delete()
        setTimeout(() => {
          location = '/'
        }, 500)
      }}>Really delete</Button>
      <Button onClick={toggle}>
        Never mind
      </Button>
    </View> :
    <Button onClick={toggle} style={styles.deleteButton}>
      Delete all stored data
    </Button>
)

export default stateful({
  initial: {
    really: false
  },
  helpers: {
    toggle: (props, state) => ({
      really: !state.really,
    }),
  },
  name: 'DeleteButton',
  render: DeleteButton
})

const styles = {
  deleteButton: {
    borderColor: 'transparent',
    color: '#aaa',
    position: 'absolute',
    bottom: 10,
    right: 10,
    flexDirection: 'row',
    zIndex: 1,
  },

  really: {
    marginRight: 10,
    backgroundColor: '#faa',
  },
}


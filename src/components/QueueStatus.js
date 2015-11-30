
import React from 'react'
import poppable from '../util/poppable'
import stopEvent from '../util/stopEvent'
import Hoverable from './Hoverable'
import View from '../View'
import Text from '../Text'
import Colors from '../util/Colors'

const statuses = {
  active: 'Active',
  later: 'Do Later',
  done: 'Done',
}

const QueueStatus = ({status, isOpen, toggleOpen, setStatus, onRemove}) => (
  <View style={styles.container} onClick={stopEvent}>
    <View onClick={toggleOpen} style={[styles.thumb, styles[status]]} />
    {isOpen &&
      <View style={styles.popup}>
        <View style={styles.triangle} />
        {Object.entries(statuses).map(([key, title]) => (
          <Hoverable style={styles.listItem} key={key} hoverStyle={styles.listItemHover} onClick={() => setStatus(key)}>
            <View style={[styles.thumb, styles[key]]} />
            <Text style={styles.text}>{title}</Text>
          </Hoverable>
        ))}
        <Hoverable onClick={onRemove} style={[styles.listItem, styles.remove]} hoverStyle={styles.listItemHover}>
          Remove from queue
        </Hoverable>
      </View>}
  </View>
)

export default poppable(QueueStatus)

const styles = {
  container: {
    position: 'relative',
    cursor: 'pointer',
    marginRight: 10,
  },

  popup: {
    position: 'absolute',
    top: '100%',
    marginTop: 5,
    backgroundColor: 'white',
    borderRadius: 2,
    width: 150,
    fontSize: '70%',
    boxShadow: '0 1px 5px #aaa',
    zIndex: 1000,
  },

  thumb: {
    backgroundColor: 'faa',
    cursor: 'pointer',
    width: 20,
    height: 20,
    borderRadius: 5,
  },

  active: {
    backgroundColor: Colors.Status.active,
  },
  later: {
    backgroundColor: Colors.Status.later,
  },
  done: {
    backgroundColor: Colors.Status.done,
  },

  listItem: {
    padding: 5,
    cursor: 'pointer',
    flexDirection: 'row',
    alignItems: 'center',
    transition: 'background-color .2s ease',
  },

  listItemHover: {
    backgroundColor: '#f0f0f0',
  },

  remove: {
    padding: '8px 10px',
    textAlign: 'center',
    justifyContent: 'center',
  },

  text: {
    marginLeft: 5,
  },
}


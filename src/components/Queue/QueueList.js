import React from 'react'
import View from '../../View'
import Text from '../../Text'
import connect from '../../connect'
import {LoginButton} from '../Buttons'
import QueueItem from './QueueItem'
import stateful from '../../util/stateful'
import memOnce, {memOnce2} from '../../util/memOnce'
import Colors from '../../util/Colors'
import Hoverable from '../Hoverable'
import FilterButtons from './FilterButtons'

const statusCounts = memOnce(queue => {
  return Object.values(queue).reduce(
    (counts, item) => (counts[item.status] += 1, counts),
    {active: 0, later: 0, done: 0}
  )
})

const StatefulQueueList = stateful({
  initial: {
    filterStatus: 'active',
  },
  render: props => {
    return (
      <View style={styles.statefulContainer}>
        <FilterButtons counts={statusCounts(props.queue)} onChange={props.setFilterStatus} selected={props.filterStatus} />
        <QueueList {...props} />
      </View>
    )
  }
})

export default connect({
  name: 'QueueList',
  props: ['loginStatus', 'queue', 'searchStatus'],
  render: ({loginStatus, queue, searchStatus, filter, ctx}) => (
    <View style={styles.container}>
      {loginStatus === true ?
        <StatefulQueueList {...{ctx, queue, searchStatus, filter}} /> :
        <LoggedOutPage loginStatus={loginStatus} />}
    </View>
  )
})

const sortedQueueNodes = memOnce2((queue, filterStatus) => {
  const items = Object.values(queue).filter(value => value.status === filterStatus)
  const mmap = {}
  const nodes = items.map(item => mmap[item.pid] = {item, children: []})
  items.forEach(item => {
    if (item.parentId && mmap[item.parentId]) {
      mmap[item.pid].isChild = true
      mmap[item.parentId].children.push(mmap[item.pid])
    }
  })
  const topLevel = Object.values(mmap).filter(node => !node.isChild)
  topLevel.sort((a, b) => {
    if (a.item.contextAdded === 'auto-search' && b.item.contextAdded === 'auto-search') {
      return a.item.dateAdded.getTime() - b.item.dateAdded.getTime()
    }
    if (a.item.contextAdded !== 'auto-search') {
      if (b.item.contextAdded !== 'auto-search') {
        return b.item.dateAdded.getTime() - a.item.dateAdded.getTime()
      }
      return -1
    }
    return 1
  })
  return topLevel
})

// TODO add a "Add by ID" dialog? Or tell people to go over the FS and add
// people from there.
const QueueList = ({queue, searchStatus, ctx, filterStatus}) => {
  const queueIsEmpty = Object.keys(queue).length === 0
  const nodes = sortedQueueNodes(queue, filterStatus)
  return (
    <ul style={styles.list}>
      {queueIsEmpty && !searchStatus &&
        <li style={styles.startSearching}>
          <Text style={styles.startSearchingMessage}>
            Looks like you don't have any people queued up to research!
          </Text>
          <button style={{...styles.button, ...styles.searchButton}} onClick={() => ctx.actions.startSearching()}>
            Find some automatically
          </button>
        </li>}
      <QueueNodes nodes={nodes} ctx={ctx} />
      {searchStatus ?
        <li style={styles.searchStatus}>
          Searching your tree for likely research leads...
          <Text style={styles.searchCount}>
            {searchStatus.total}
          </Text>
        </li> :
        !queueIsEmpty && filterStatus === 'active' && <button style={{...styles.button, ...styles.searchButton}} onClick={() => ctx.actions.startSearching()}>
          Find some more automatically
        </button>
      }
    </ul>
  )
}

const QueueNodes = ({nodes, ctx}) => (
  <View>
    {nodes.map(({item, children}) => (
      <View key={item.pid}>
        <QueueItem
          key={item.pid}
          item={item}
          api={ctx.api}
          onChangeStatus={status => ctx.actions.changeQueueStatus(item.pid, status)}
          onRemove={() => ctx.actions.removeQueueItem(item.pid)}
          onChangeNote={text => ctx.actions.changeNote(item.pid, text)}
          onClick={e => {
            if (e.button === 0) {
              ctx.actions.goToOrCreateTab(item.pid, item.display.name)
            } else if (e.button === 1) {
              ctx.actions.maybeCreateTab(item.pid, item.display.name)
            }
          }}
        />
        {children.length ? <View style={styles.children}>
          <QueueNodes nodes={children} ctx={ctx} />
        </View> : null}
      </View>
    ))}
  </View>
)

const LoggedOutPage = ({loginStatus}) => (
  <View>
    <LoginButton loginStatus={loginStatus} />
  </View>
)

const styles = {
  container: {
    alignItems: 'center',
    overflow: 'auto',
    flex: 1,
  },

  startSearching: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },

  children: {
    borderLeft: '7px solid #ccc',
    paddingLeft: 20,
  },

  startSearchingMessage: {
    marginTop: 30,
  },

  list: {
    width: 500,
  },

  searchStatus: {
    marginTop: 40,
    marginBottom: 40,
  },

  searchCount: {
    marginLeft: 20,
    fontWeight: 'bold',
  },

  button: {
    whiteSpace: 'nowrap',
    backgroundColor: 'green',
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    borderRadius: 4,
    textDecoration: 'none',
    boxSizing: 'border-box',
    display: 'block',
    cursor: 'pointer',
    border: 'none',
  },

  searchButton: {
    padding: '10px 20px',
    marginBottom: 20,
    marginTop: 30,
  },

  box: {
    width: 600,
    marginTop: 150,
  },
};


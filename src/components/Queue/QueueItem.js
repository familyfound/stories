
import React from 'react'
import View from '../../View'
import Text from '../../Text'
import Button from '../../Button'

import BlurTextarea from '../BlurTextarea'
import SharedStyles from '../../util/SharedStyles'

import Previews from './Previews'
import Notes from './Notes'
import QueueStatus from '../QueueStatus'

import probably from '../../probably'
import stateful from '../../util/stateful'

const QueueItemBase = ({item, onClick, onChangeNote, onChangeStatus, onRemove, children}) => (
  <View style={styles.container}>
    <View onClick={onClick} style={styles.header}>
      <QueueStatus
        status={item.status}
        setStatus={onChangeStatus}
        onRemove={onRemove}
      />
      <Text style={styles.name}>
        {item.display.name}
      </Text>
      <Text style={styles.lifespan}>
        {item.display.lifespan}
      </Text>
      <Text style={styles.age}>
        {!item.display.meta.estimated && '(' + item.display.meta.age + ')'}
      </Text>
    </View>
    <View style={styles.places}>
      {item.relation}
      {item.display.birthPlace}
      {item.display.deathPlace}
    </View>
    {children}
    <BlurTextarea style={[SharedStyles.yourNotes, styles.notesBox]} placeholder="Write a note to yourself" value={item.note} onChange={onChangeNote} />
    <ShowReasons reasons={item.reasons} />
  </View>
)

const QueueItemFull = probably({
  name: 'QueueItem',
  partial: true,
  shouldRefresh: (nextProps, prevProps) => nextProps.item !== prevProps.item,
  promises: ({item, api}) => ({
    recordHints: api.cache.recordHints(item.pid),
    sources: api.cache.sources(item.pid),
    duplicates: api.cache.duplicates(item.pid),
    personWithRelationships: api.cache.personWithRelationships(item.pid),
    notes: api.cache.notes(item.pid),
  }),
  render: props => (
    <QueueItemBase {...props}>
      <Previews pid={props.item.pid} recordHints={props.recordHints} sources={props.sources} duplicates={props.duplicates} personWithRelationships={props.personWithRelationships} />
      <Notes notes={props.notes} api={props.api} />
    </QueueItemBase>
  )
})

const QueueItemMini = props => (
  <QueueItemBase {...props}>
    <Button style={styles.showMoreButton} onClick={props.onShowMore}>
      Load more information
    </Button>
  </QueueItemBase>
)

const reasonTitle = {
  fewChildren: 'few children',
  noMother: 'no parent2',
  noFather: 'no parent1',
  noChildren: 'no children',
  noSpouse: 'no spouse',
}

const ShowReasons = ({reasons}) => (
  <View style={styles.reasons}>
    {reasons.map(reason => reason[0] !== '_' && <Text key={reason} style={[styles.reason, styles['reason' + reason]]}>{reasonTitle[reason]}</Text>)}
  </View>
)

export default QueueItemFull

const styles = {
  container: {
    padding: '20px 0',
    borderBottom: '1px solid #eee',
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    cursor: 'pointer',
  },

  showMoreButton: {
    padding: '10px 20px',
    margin: '10px 0',
    backgroundColor: 'white',
    border: '1px solid #ccc',
    borderRadius: 4,
  },

  name: {
    fontWeight: 'bold',
  },

  lifespan: {
    fontSize: '80%',
    color: '#444',
    marginLeft: 10,
  },

  notesBox: {
    height: '1.3em',
  },

  age: {
    fontSize: '80%',
    color: '#444',
    marginLeft: 10,
  },

  places: {
    margin: 10,
    fontSize: '80%',
  },

  reasons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },

  reason: {
    padding: '2px 5px',
    marginRight: 10,
  },
}


import React from 'react'

import View from '../View'
import Text from '../Text'
import Button from '../Button'
import QueueStatus from './QueueStatus'
import BlurTextarea from './BlurTextarea'
import SharedStyles from '../util/SharedStyles'

import probably from '../probably'

const PersonVitals = ({data: {person}, queueItem, onRemoveQueue, onChangeQueueStatus, onAddQueueItem, onChangeNote}) => (
  <View style={styles.container}>
    <View style={styles.header}>
      {queueItem ?
        <QueueStatus
          status={queueItem.status}
          onRemove={onRemoveQueue}
          setStatus={onChangeQueueStatus}
        /> :
        <Button style={SharedStyles.addToQueueButton} onClick={onAddQueueItem}>+</Button>}
      <Text style={styles.name}>
        {person.display.name}
      </Text>
      <Text style={styles.lifeSpan}>
        {person.display.lifespan}
        {!person.display.meta.estimatedBirth && !person.display.meta.estimatedDeath &&
          <Text>({person.display.meta.age})</Text>}
      </Text>
      <a style={styles.link} href={person.identifiers['http://gedcomx.org/Persistent'][0]} target="_blank">View on Familysearch</a>
    </View>
    <View style={styles.bottomRow}>
      <DataTable rows={{
        'Birth Date': person.display.birthDate,
        'Birth Place': person.display.birthPlace,
        'Death Date': person.display.deathDate,
        'Death Place': person.display.deathPlace,
      }} />
      {queueItem ?
        <BlurTextarea
          style={[SharedStyles.yourNotes, styles.notesText]}
          value={queueItem.note}
          placeholder={`Write a note to yourself about ${person.display.name}`}
          onChange={onChangeNote}
        /> : <Text style={styles.notesPlaceholder}>
          Add {person.display.name} to queue to write notes about them
        </Text>}
    </View>
  </View>
)

const DataTable = ({rows}) => (
  <table style={styles.dataTable}>
    <tbody>
      {Object.keys(rows).map(name => (
        <tr key={name}>
          <td><Text style={styles.dataTitle}>{name}</Text></td>
          <td>
            {rows[name] ?
              <Text style={styles.dataValue}>{rows[name]}</Text> :
              <MissingItem />}
          </td>
        </tr>
      ))}
    </tbody>
  </table>
)

const DataItem = ({title, value}) => (
  <Text style={styles.dataItem}>
    <Text style={styles.dataTitle}>{title}</Text>
    {value ?
      <Text style={styles.dataValue}>{value}</Text> :
      <MissingItem />}
  </Text>
);

const MissingItem = () => <Text style={styles.missingItem}>Missing!</Text>

const Loading = () => <View>Loading source data</View>

const ErrorMessage = () => <View>Unable to display source data</View>

const MaybePersonVitals = props => {
  if (props.data === probably.LOADING) {
    return <Loading />
  }

  if (props.data instanceof Error) {
    return <ErrorMessage />
  }

  return <PersonVitals {...props} />
}

export default MaybePersonVitals

const styles = {
  container: {
    padding: 20,
  },

  name: {
    fontSize: 30,
    fontWeight: 'bold',
  },

  header: {
    display: 'flex',
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },

  lifeSpan: {
    marginLeft: 10,
    fontSize: 20,
    color: '#333',
  },

  dataTable: {
    fontSize: 16,
  },

  notesText: {
    flex: 1,
    marginLeft: 20,
  },

  notesPlaceholder: {
    marginLeft: 20,
    padding: 10,
    flex: 1,
    fontStyle: 'italic',
    color: '#777',
  },

  dataItem: {
    marginBottom: 5,
  },

  link: {
    textDecoration: 'none',
    fontSize: 20,
    marginLeft: 30,
  },

  dataTitle: {
    marginRight: 10,
    marginBottom: 5,
    color: '#555',
  },

  missingItem: {
    color: '#a77',
  },

  bottomRow: {
    flexDirection: 'row',
  },
}


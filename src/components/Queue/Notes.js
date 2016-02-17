
import React from 'react'
import View from '../../View'
import Text from '../../Text'

import expandable from '../../util/expandable'
import probably from '../../probably'

const isGoodNote = note => {
  if (note.subject === note.subject.toUpperCase()) { // all caps -> ignore
    return false
  }
  if (note.subject.match(/Ancestral File|\bPAF\b|\bGEDCOM\b/)) { // automated, probably not useful
    return false
  }
  return true
}

const withoutExclamation = text => text[0] === '!' ? text.slice(1) : text

const Notes = ({notes, api}) => (
  <View style={styles.container}>
    {!notes.length && <View style={styles.empty}>No notes found on FamilySearch</View>}
    {notes.filter(isGoodNote).map(note => <ExpandableNote key={note.id} note={note} myTreeUserId={api.user.treeUserId} />)}
  </View>
)

const Note = ({note, myTreeUserId, isOpen, toggleOpen}) => (
  <View style={styles.note} onClick={toggleOpen}>
    <Text style={styles.subject}>
      {myTreeUserId === note.attribution.contributor.resourceId &&
        '⭐'}
      {withoutExclamation(note.subject)}
    </Text>
    {isOpen && <Text style={styles.text}>{withoutExclamation(note.text)}</Text>}
  </View>
)

const ExpandableNote = expandable(Note)

const Loading = () => <View style={styles.container}>
  <Text style={styles.loading}>
    Loading notes from FamilySearch...
  </Text>
</View>
const ErrorMessage = () => <View style={styles.container}>
  <Text style={styles.error}>
    Unable to load notes from FamilySearch
  </Text>
</View>

const MaybeNotes = props => {
  if (props.notes === probably.LOADING) {
    return <Loading />
  }
  if (props.notes instanceof Error) {
    return <ErrorMessage />
  }
  return <Notes {...props} />
}

const styles = {
  container: {
    padding: '10px 0 0',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
  },

  loading: {
    fontSize: '80%',
    margin: '0 10px 10px',
  },
  error: {
    fontSize: '80%',
    backgroundColor: '#faa',
    padding: '10px 15px',
    marginBottom: 10,
    borderRadius: 5,
  },

  empty: {
    fontSize: '80%',
    margin: '0 10px 10px',
  },

  note: {
    cursor: 'pointer',
    borderRadius: 4,
    border: '1px solid #ccc',
    marginRight: 10,
    marginBottom: 10,
    maxWidth: 200,
    padding: '5px 7px',
    fontSize: '80%',
  },

  subject: {
  },

  text: {
    marginTop: 10,
    borderTop: '1px solid #ccc',
    paddingTop: 10,
  },
}

export default MaybeNotes

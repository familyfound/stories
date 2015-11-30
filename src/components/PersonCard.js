
import React from 'react'
import View from '../View'
import Text from '../Text'
import {Link} from 'react-router'
import Colors from '../util/Colors'

import probably from '../probably'

const queueItemFromPerson = (person, personWithRelationships) => {
  throw new Error("aweomse")
}

const showAgeDiff = (person, mainPerson) => {
  if (person.id === mainPerson.id) {
    return
  }
  if (person.display.meta.estimatedBirth || mainPerson.display.meta.estimatedBirth) {
    return
  }
  const diff = person.display.meta.born - mainPerson.display.meta.born
  if (diff >= 0) return '+' + diff
  return '' + diff
}

const showMarriageDiff = (year, mainPerson) => {
  if (year == null) return
  if (mainPerson.display.meta.estimatedBirth) return
  const diff = year - mainPerson.display.meta.born
  if (diff >= 0) return '+' + diff
  return '' + diff
}

const PersonCard = probably({
  name: 'PersonCard',
  partial: true,
  shouldRefresh: (nextProps, prevProps) =>
    nextProps.person.id !== prevProps.person.id || nextProps.queueItem !== prevProps.queueItem,
  promises: ({ctx: {api}, person: {id: pid}}) => ({
    personWithRelationships: api.cache.personWithRelationships(pid),
  }),
  render: ({person, ctx, queueItemStatus, title, personWithRelationships, mainPerson, marriage}) => (
    <View style={[styles.personCard, styles[person.display.gender.toLowerCase()]]}>
      <View style={styles.topRow}>
        <View style={styles.ageDiff}>
          {showAgeDiff(person, mainPerson)}
        </View>
        {queueItemStatus}
        {person.id === mainPerson.id ?
          <Text style={[styles.name, styles.mainName]}>
            {person.display.name}
          </Text> :
          <View style={styles.nameWrapper} onClick={e => {
            if (e.button === 0) {
              if (e.metaKey) {
                ctx.actions.goToOrCreateTab(person.id, person.display.name)
              } else {
                ctx.actions.updateTab(ctx.params.tabid, person.id, person.display.name)
              }
            } else if (e.button === 1) {
              ctx.actions.maybeCreateTab(person.id, person.display.name)
            }
          }}>
            <Text style={styles.name}>
              {person.display.name}
            </Text>
          </View>}
        <View style={styles.spacer} />
        {calcAge(person.display)}
        <Text style={styles.lifespan}>
          {person.display.lifespan}
        </Text>
      </View>
      {marriage &&
        <View style={styles.marriage}>
          <View style={styles.ageDiff}>
            {showMarriageDiff(marriage.year, mainPerson)}
          </View>
          <Text style={styles.marriageText}>
            {marriage.date} {marriage.place && 'in ' + marriage.place}
          </Text>
        </View>}
    </View>
  )
})

const calcAge = display => {
  if (null != display.meta.age && !display.meta.estimated) {
    return <Text style={styles.age}>{display.meta.age}</Text>
  }
}

const EmptyPersonCard = ({title}) => (
  <View style={styles.missing}>
    <Text>Missing {title}</Text>
  </View>
)

const MaybeEmpty = props => props.person ?
  <PersonCard {...props} /> :
  <EmptyPersonCard {...props} />;

export default MaybeEmpty

const styles = {

  personCard: {
    position: 'relative',
    padding: '10px 5px',
    borderBottom: '1px solid #ccc',
    borderLeft: '5px solid #ccc',
  },

  nameWrapper: {
    cursor: 'pointer',
  },

  female: {
    borderLeftColor: Colors.Gender.female,
  },

  male: {
    borderLeftColor: Colors.Gender.male,
  },

  missing: {
    padding: '10px 0 10px 80px',
    borderBottom: '1px solid #ccc',
    fontStyle: 'italic',
    color: '#777',
  },

  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },

  marriage: {
    position: 'absolute',
    left: 40,
    right: 5,
    overflow: 'hidden',
    top: '100%',
    marginTop: '-.35em',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 5,
  },

  marriageText: {
    fontSize: '70%',
  },

  queueButton: {
    cursor: 'pointer',
    padding: '3px 7px',
    borderRadius: 4,
    marginRight: 10,
  },

  spacer: {
    flex: 1,
  },

  mainName: {
    fontWeight: 'bold',
  },

  lifespan: {
    fontSize: '80%',
  },

  age: {
    fontSize: '70%',
    fontStyle: 'italic',
    marginRight: 10,
  },

  ageDiff: {
    width: 30,
    fontSize: '70%',
    fontStyle: 'italic',
    marginRight: 15,
    textAlign: 'right',
  },
}


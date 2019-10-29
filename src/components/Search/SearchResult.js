
import React from 'react'
import View from '../../View'
import Text from '../../Text'
import {Link} from 'react-router'
import Colors from '../../util/Colors'

import probably from '../../probably'
import stateful from '../../util/stateful'

import {simpleSearchQuery} from '../../util/searchQuery'
import editDistance from '../../util/editDistance'
import analyzeNameParts from './analyzeNameParts'

const Name = ({name, realName}) => {
  name = name.trim()
  realName = realName.trim()
  if (name.toLowerCase() === realName.toLowerCase()) {
    return <Text style={[styles.name, styles.perfectName]}>{name}</Text>
  }
  return <Text style={styles.name}>
    {analyzeNameParts(name, realName)}
  </Text>
}

const getYear = text => {
  if (!text) return null
  const match = text.match(/\d{4}/)
  return match ? +match[0] : null
}

const latestYear = events => {
  return Math.max(...events.map(({date}) => getYear(date)))
}

const diffText = num => num >= 0 ? '+' + num : '' + num

const resultYear = (events, born) => {
  const year = latestYear(events)
  if (year === 0) return null
  return (
    <Text style={styles.resultYear}>
      {year}
      {born &&
        <Text style={styles.resultYearAge}>
          {diffText(year - born)}
        </Text>}
    </Text>
  )
}

const attachLink = (person, {personWithRelationships: {person: {id}}}) => {
  return `https://familysearch.org/platform/redirect?person=${id}&context=sourceLinker&hintId=${person.url}`
}

const eventYearDiff = (date, born) => {
  const year = getYear(date)
  if (!year) return
  return <Text style={styles.eventYearDiff}>{diffText(year - born)}</Text>
}

const scoreToText = score => {
  if (score > 1) {
    return 'Good match'
  }
  if (score > 0) {
    return 'Possible match'
  }
  if (score > -1) {
    return 'Unlikely match'
  }
  return 'Very unlikely match'
}

// TODO if researching a woman and the husband is listed w/ the same last
// name, throw up a warning notice: this is likely the woman's married name,
// while "Erikson" is Anna's birth name.
// TODO for places, check the places of siblings as well, amd children
// TODO it would be really nice for personData to include the families of the
// parents
const SearchResult = ({hit: {person, score}, personData, personBorn, alreadyAttached}) => (
  <View style={[styles.personHit, alreadyAttached && styles.alreadyAttached]}>
    <View style={styles.top}>
      {resultYear(person.event, personBorn)}
      <Name
        name={person.name}
        realName={personData.personWithRelationships.person.display.name}
      />
      {person.gender.toLowerCase() !== 'unknown' &&
       person.gender.toLowerCase() !== personData.personWithRelationships.person.display.gender.toLowerCase() ?
        'Wrong Gender!' : null}
      <View style={styles.spacer} />
      <Text style={styles.collection}>
        {person.isPartOf.title[0].value}
      </Text>
    </View>
    <View style={styles.main}>
      <View style={styles.events}>
      <table>
        <tbody>
          {person.event && person.event.reduce((arr, event) => (arr.push(
            event.date && <tr key={'date-' + event.type}>
              <td><Text style={styles.label}>{event.type.toLowerCase()} date</Text></td>
              <td>{event.date} {personBorn && eventYearDiff(event.date, personBorn)}</td>
            </tr>,
            event.place && <tr key={'place-' + event.type}>
              <td><Text style={styles.label}>{event.type.toLowerCase()} place</Text></td>
              <td>{event.place}</td>
            </tr>,
          ), arr), [])}
        </tbody>
      </table>
      </View>
    </View>
    <View style={styles.bottom}>
      <View style={styles.attachButton}>
        {alreadyAttached ?
          'Already attached' :
          <a style={styles.attachLink} href={attachLink(person, personData)} target="_blank">
            Attach record
          </a>}
      </View>
      <Text style={styles.score}>
        {scoreToText(score)}
      </Text>
      <View style={styles.spacer} />
      <View style={styles.viewOnFS}>
        <a style={styles.viewLink} href={person.url} target="_blank">
          View on FamilySearch
        </a>
      </View>
    </View>
  </View>
)

export default SearchResult

// const parentName = 

// const RelationShips = ({person}) => (
//   <table>
//     <tbody>
//       {maybeRelationship('parent2', person.motherName)}
//       {maybeRelationship('parent1', person.fatherName)}
//       {maybeRelationship('spouse', person.spouseName)}
//       {maybeRelationship('child', person.childName)}
//     </tbody>
//   </table>
// )

// const maybeRelationship = (title, value) => value ? <tr><td>{title}</td><td>{value}</td></tr> : null

const styles = {

  top: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },

  label: {
    fontSize: '80%',
    color: '#505',
    marginRight: 10,
    marginBottom: 15,
  },

  collection: {
    fontSize: '70%',
    fontWeight: 'bold',
  },

  resultYear: {
    fontSize: '80%',
    color: '#555',
  },

  resultYearAge: {
    margin: '0 10px',
    fontSize: '80%',
  },

  eventYearDiff: {
    margin: '0 10px',
    fontSize: '80%',
    color: '#555',
  },

  main: {
    padding: 10,
  },

  spacer: {
    flex: 1,
  },

  personHit: {
    borderBottom: '1px solid #ccc',
  },

  alreadyAttached: {
    borderLeft: '5px solid green',
  },

  perfectName: {
    backgroundColor: '#8f8',
    padding: '2px 4px',
    borderRadius: 2,
  },

  bottom: {
    flexDirection: 'row',
    padding: 10,
  },

  attachLink: {
    fontSize: '70%',
    textDecoration: 'none',
    color: '#666',
    cursor: 'pointer',
  },

  viewLink: {
    fontSize: '70%',
    textDecoration: 'none',
    color: '#666',
    cursor: 'pointer',
  },

  score: {
    padding: '0 10px',
    fontSize: '70%',
    color: '#555',
    marginLeft: 50,
  },
}



import React from 'react'
import View from '../View'
import Text from '../Text'
import probably from '../probably'

const getFirstNormalized = entries => entries && !!entries.length && getNormalized(entries[0])

const getNormalized = item => item.normalized && !!item.normalized.length && item.normalized[0]

const OtherSourceData = ({sourceData}) => {
  const gender = getFirstNormalized(sourceData.gender)
  const name = getFirstNormalized(sourceData.name)
  const characteristics = sourceData.characteristic ? sourceData.characteristic.map(item => {
    if (item.type === 'AGE') {
      return <Text key={item.type}>Age: {getNormalized(item).text}</Text>
    }
    if (item.type === 'PR_AGE_FORM') {
      return <Text key={item.type}>Full Age: {getNormalized(item).text}</Text>
    }
  }) : []
  return <View style={styles.container}>
    {name && <Text style={styles.row}>
      Name: {name.text || 'Unknown name'}
    </Text>}
    {gender && <Text style={styles.row}>
      Gender: {gender.text || titleCase(gender.genderType)}
    </Text>}
    {sourceData.parent && sourceData.parent.map(parent => (
      <View key={parent.url}>
        <Text>Parent: {parent.name} {titleCase(parent.gender)}</Text>
      </View>
    ))}
    {sourceData.spouse && sourceData.spouse.map(spouse => (
      <View key={spouse.url}>
        <Text>Spouse: {spouse.name} {titleCase(spouse.gender)}</Text>
      </View>
    ))}
    {sourceData.child && sourceData.child.map(child => (
      <View key={child.url}>
        <Text>Child: {child.name} {titleCase(child.gender)}</Text>
      </View>
    ))}
    {characteristics}
  </View>
}

const PersonsSourceData = ({sourceData}) => {
  return <View style={styles.container}>
    {/* TODO show relationships */}
    {sourceData.persons &&
      sourceData.persons.map(person => <Person key={person.id} person={person} />)}
    <Text>{Object.keys(sourceData) + ''}</Text>
  </View>
}

const getOtherName = names => {
  if (!names || !names.length || !names[0].nameForms.length) {
    return <Text style={styles.missing}>No listed name</Text>
  }
  return names[0].nameForms[0].fullText
}

const Person = ({person: {facts, principal, names}}) => {
  return (
    <View>
      <Text>Person: {getOtherName(names)}</Text>
      {facts && facts.map(fact => <ShowFact key={fact.id} fact={fact} />)}
    </View>
  )
}

const titleCase = text => text.toLowerCase().split(/\s/g).map(t => t[0].toUpperCase() + t.slice(1)).join(' ')

const ShowFact = ({fact: {type, primary, place, date}}) => {
  const title = type.split(/\//g).slice(-1)[0]
  const titleStyle = [styles.factTitle, primary && styles.primaryFact]
  return (
    <View>
      {date ? <Text style={titleStyle}>
        {title} Date: {date.original}
      </Text> : null}
      {place ? <Text style={titleStyle}>
        {title} Place: {titleCase(place.original)}
      </Text> : null}
    </View>
  )
}

const styles = {
  container: {
    fontSize: '90%',
    padding: 20,
  },
  header: {
    fontWeight: 'bold',
  },
  row: {
  },
  missing: {
    fontStyle: 'italic',
    color: '#777',
  },

  loading: {
    color: '#777',
  },

  primaryFact: {
    fontWeight: 'bold',
  },
}

const Loading = () => <View style={[styles.container, styles.loading]}>Loading source data</View>

const ErrorMessage = () => <View>Unable to display source data</View>

const MaybeSourceData = ({sourceData}) => {
  if (sourceData === probably.LOADING) {
    return <Loading />
  }

  if (sourceData instanceof Error) {
    return <ErrorMessage />
  }

  return sourceData.persons ?
    <PersonsSourceData sourceData={sourceData} /> :
    <OtherSourceData sourceData={sourceData} />
}

export default MaybeSourceData


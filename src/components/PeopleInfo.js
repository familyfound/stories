
import React from 'react'
import Text from '../Text'
import View from '../View'
import Button from '../Button'
import probably from '../probably'

const PeopleInfo = ({story, peopleInfo}) => (
  <View style={styles.container}>
    {story.people.map(person => (
      <PersonInfo person={person} info={peopleInfo[person.pid]} />
    ))}
  </View>
)

const PersonInfo = ({person, info}) => (
  <View style={styles.person}>
    {person.display.name}
    <Text>
      {person.display.lifespan} {!person.display.meta.estimated && person.display.meta.age}
    </Text>
    {person.relation}
    <a target="_blank" href={person.href}>View on FamilySearch.org</a>
  </View>
)

export default probably({
  shouldRefresh: (nextProps, prevProps) => false,
  promises: ({api, story}) => {
    const proms = {}
    /*
    story.people.forEach(person => {
      proms[person.pid] = api.cache.personWithRelationships(pid)
    })
    */
    return proms
  },
  name: 'PeopleInfo',
  render: props => {
    const {story, api, ...peopleInfo} = props
    return <PeopleInfo story={story} peopleInfo={peopleInfo} />
  }
})

const styles = {
  container: {
    padding: 40,
  },
}



import React from 'react'
import View from '../View'
import Text from '../Text'

import PersonCard from './PersonCard'
import ResearchHint from './ResearchHint'
import QueueStatus from './QueueStatus'
import Button from '../Button'
import SharedStyles from '../util/SharedStyles'

import probably from '../probably'

const PersonFamily = ({ctx, personWithRelationships, queue}) => (
  <View style={styles.container}>
    {/** TODO have a big button here (maybe) to say "analyze family members" **/}
    {/** TODO have them stack on small screens */}
    <SpousesAndChildren {...{ctx, personWithRelationships, queue}} />
    <ParentsAndSiblings {...{ctx, personWithRelationships, queue}} />
  </View>
)

const makeQueueStatus = (id, queue, actions) => (queue[id] ?
  <QueueStatus
    status={queue[id].status}
    onRemove={() => actions.removeQueueItem(id)}
    setStatus={status => actions.changeQueueStatus(id, status)}
  /> :
  <Button
    style={SharedStyles.addToQueueButton}
    onClick={() => actions.addQueueItemFromPerson(id, 'family')}
  >
    +
  </Button>
)

const diedHints = (person, spouse) => {
  const pmeta = person.display.meta
  const smeta = spouse.display.meta
  const hints = []
  if (!pmeta.estimatedDeath && !smeta.estimatedBirth) {
    if (pmeta.died < smeta.born) {
      hints.push(`${person.display.name} died before ${spouse.display.name} was born`)
    } else if (pmeta.died < smeta.born + 16) {
      hints.push(`${person.display.name} died when ${spouse.display.name} was only ${pmeta.died - smeta.born}`)
    }
  }
  return hints
}

const marriedRange = (marriage, person) => {
  if (!marriage || !marriage.year) return []
  const pmeta = person.display.meta
  const hints = []
  if (!pmeta.estimatedBirth) {
    if (pmeta.born > marriage.year) {
      hints.push(`they were married before ${person.display.name} was born`)
    } else if (marriage.year - pmeta.born < 16) {
      hints.push(`they were married when ${person.display.name} was only ${marriage.year - pmeta.born}`)
    }
  }
  if (!pmeta.estimatedDeath) {
    if (pmeta.died < marriage.year) {
      hints.push(`they were married after ${person.display.name} died`)
    }
  }
  return hints
}

const textList = items => {
  if (items.length === 1) return items[0]
  if (items.length === 2) return items[0] + ' and ' + items[1]
  return items.slice(0, -1).join(', ') + ' and ' + items[items.length - 1]
}

const showMarriageHints = (person, {marriage, spouse}) => {
  const hints = []
  if (!spouse) return hints
  const pmeta = person.display.meta
  const smeta = spouse.display.meta
  hints.push(...diedHints(person, spouse))
  hints.push(...diedHints(spouse, person))
  hints.push(...marriedRange(marriage, person))
  hints.push(...marriedRange(marriage, spouse))

  if (!pmeta.estimatedBirth && !smeta.estimatedBirth) {
    const ageDiff = Math.abs(smeta.born - pmeta.born)
    if (ageDiff > 35) {
      hints.push(`they were born ${ageDiff} years apart`)
    }
  }

  if (!hints.length) return
  return <ResearchHint>
    This marriage may be invalid: {textList(hints)}
  </ResearchHint>
}

const showMissingFamilyMessage = person => {
  const pmeta = person.display.meta
  if (!pmeta.estimated && pmeta.age <= 20) {
    return <Text style={styles.expectNoMarriages}>
      Given that {person.display.name} died at age {pmeta.age}, it's unsurprising that no marriages are recorded.
    </Text>
  }

  if (!pmeta.estimatedBirth && (new Date().getFullYear() - pmeta.born < 110)) {
    return <Text style={styles.expectNoMarriages}>
      No spouses are recorded, but {person.display.name} was born fewer than 110 years ago, so any spouses or children might still be alive.
    </Text>
  }

  if (!pmeta.estimated && pmeta.age > 20) {
    return (
      <ResearchHint>
        Possible missing spouse: no spouses are recorded, but {person.display.name} lived to age {pmeta.age}
      </ResearchHint>
    )
  }

  // TODO talk about determining if the person lived long enough...
  /*
  * Records that could be useful here:
  * - census w/ {person} as {head / spouse}
  *   If you can find that, you might find a whole family!
  * - marriage records w/ {person} as {bride / groom}
  *   marriage records w/ {person} as parent of bride or groom are less
  *   helpful, as there's usually not enough information to be confident
  *   that the record actually matches your person.
  * - birth records of a child
  * - death records (often show marital status)
  *   similarly, death records w/ {person} as father or mother rarely have
  *   the information needed to be confident of a match
  * - military/draft records
  *   sometimes list marital status or "closest relative"
  */
  return (
    <ResearchHint>
      Possible missing spouse: No spouses are recorded. It's possible that {person.display.name} died young, or that they just never married. Search around to see if you can find any census records or marriage records.
    </ResearchHint>
  )
}

const SpousesAndChildren = ({ctx, queue, personWithRelationships: {person, families}}) => (
  <View style={styles.spousesAndChildren}>
    <View style={styles.groupHeader}>Spouses and Children</View>
    {!Object.keys(families).length && <View style={styles.missingFamily}>
      {showMissingFamilyMessage(person)}
    </View>}
    {Object.values(families).map(family => (
      <View key={family.spouse ? family.spouse.id : 'missing'} style={styles.family}>
        <PersonCard
          ctx={ctx}
          title="mother"
          marriage={family.marriage}
          person={family.mother}
          queueItemStatus={family.mother && makeQueueStatus(family.mother.id, queue, ctx.actions)}
          mainPerson={person}
        />
        <PersonCard
          ctx={ctx}
          title="father"
          person={family.father}
          mainPerson={person}
          queueItemStatus={family.father && makeQueueStatus(family.father.id, queue, ctx.actions)}
        />
        {showMarriageHints(person, family)}
        {renderMyChildren(family, person, queue, ctx)}
      </View>
    ))}
  </View>
)

const getBorn = meta => meta.estimatedBirth ? null : meta.born
const getDied = meta => meta.estimatedDeath ? null : meta.died

const missingChildrenMessage = (isOldEnough, marriedEarlyEnough, marriageYear, mother) => {
  if (!marriedEarlyEnough) {
    return <View style={styles.expectNoChildren}>
      No children recorded, but they were married fewer than 110 years ago, so any children might still be alive.
    </View>
  }
  if (!isOldEnough) {
    if (!mother || mother.display.meta.estimatedBirth) {
      return <View style={styles.expectNoChildren}>
        No children recorded, but we don't know when {mother ? mother.display.name : 'the mother'} was born, so children might still be alive.
      </View>
    }
    return <View style={styles.expectNoChildren}>
      No children recorded, but {mother.display.name} was born fewer than 130 years ago, so any children might still be alive.
    </View>
  }
  if (mother && !mother.display.meta.estimatedDeath) {
    if (marriageYear) {
      if (mother.display.meta.died - marriageYear < 3) {
        return <View style={styles.expectNoChildren}>
          {mother.display.name} died within 3 years of their marriage, so it's likely they really didn't have any children.
        </View>
      } else {
        return <ResearchHint>
          Possible missing children: {mother.display.name} lived for {mother.display.meta.died - marriageYear} years after their marriage, so there might be children waiting to be found.
        </ResearchHint>
      }
    } else {
      if (mother.display.meta.age <= 22) {
        return <ResearchHint>
          Possible missing children: {mother.display.name} died at age {mother.display.meta.age}, so it's likely they really didn't have any children.
        </ResearchHint>
      } else {
        return <ResearchHint>
          Possible missing children: {mother.display.name} lived to be {mother.display.meta.age}, so it's likely that they really did have children, they just haven't been found yet.
        </ResearchHint>
      }
    }
  }
  // TODO give in-depth help
  return <ResearchHint>
    Possible missing children: No children recorded!
  </ResearchHint>
}

const renderMyChildren = ({children, mother, father, marriage}, mainPerson, queue, ctx) => {
  children = children.slice()
  children.sort((a, b) => a.display.meta.born - b.display.meta.born)
  const items = []

  const motherBorn = mother && getBorn(mother.display.meta)
  const motherDied = mother && getDied(mother.display.meta)
  const fatherDied = father && getDied(father.display.meta)
  const firstYear = children.length ? getBorn(children[0].display.meta) : null
  const lastChildYear = children.length ? getBorn(children[children.length - 1].display.meta) : null
  const isOldEnough = motherBorn != null && motherBorn < (new Date().getFullYear() - 130)
  const marriageYear = marriage && marriage.year
  const marriedEarlyEnough = !marriageYear || marriageYear < (new Date().getFullYear() - 110)

  let lastYear = null
  children.forEach(child => {
    if (lastYear !== null && !child.display.meta.estimatedBirth) {
      const diff = child.display.meta.born - lastYear
      if (diff > 3 && marriedEarlyEnough && isOldEnough) {
        items.push(<ResearchHint key={'hint-' + child.id}>Possible missing child ({diff} year gap between children)</ResearchHint>)
      }
    }
    items.push(
      <PersonCard
        ctx={ctx}
        key={child.id}
        mainPerson={mainPerson}
        title="child"
        person={child}
        queueItemStatus={makeQueueStatus(child.id, queue, ctx.actions)}
      />
    )
    lastYear = child.display.meta.estimatedBirth ? null : child.display.meta.born
  })

  const possibleMissingBefore = (
    isOldEnough && firstYear != null && marriedEarlyEnough &&
    (marriageYear ?
      firstYear - marriageYear > 3 :
      firstYear - motherBorn > 25)
  )
  const possibleMissingAfter = (
    isOldEnough && lastChildYear != null && marriedEarlyEnough &&
    lastChildYear - motherBorn < 38 &&
    (motherDied == null || motherDied - lastChildYear > 2) &&
    (fatherDied == null || fatherDied - lastChildYear > 2)
  )

  const possibleMissingAny = (
    isOldEnough && !children.length && marriedEarlyEnough &&
    (motherDied == null ||
      (marriageYear ?
        motherDied - marriageYear > 3 :
        motherDied - motherBorn > 22))
  )

  // TODO if there are only a few children, and a parent died shortly after
  // the last child, call that out in a message so it's easy to spot

  return (
    <View style={styles.children}>
      {possibleMissingBefore &&
        <ResearchHint>
          Possible missing child - {mother.display.name} was {firstYear - motherBorn} when she had the first recorded child
        </ResearchHint>}
      {items}
      {possibleMissingAfter &&
        <ResearchHint>
          Possible missing child - {mother.display.name} was only {lastChildYear - motherBorn} when she had her last recorded child
        </ResearchHint>}
      {!children.length && missingChildrenMessage(isOldEnough, marriedEarlyEnough, marriageYear, mother)}
    </View>
  )
}

const ParentsAndSiblings = probably({
  name: 'ParentsAndSiblings',
  partial: true,
  shouldRefresh: (nextProps, prevProps) =>
    prevProps.pid !== nextProps.pid,
  promises: ({ctx, pid, personWithRelationships: {parents}}) => (
    parents.reduce((promises, {mother, father}) => {
      const id = mother ? mother.id : father.id
      promises['relationshipsFor' + id] = ctx.api.cache.personWithRelationships(id)
      return promises
    }, {})
  ),
  render: (props) => {
    const {ctx, pid, queue, personWithRelationships: {person, parents}, ...parentRelationships} = props
    return <View style={styles.parentsAndSiblings}>
      <View style={styles.groupHeader}>Parents and Siblings</View>
      {!parents.length &&
        <View style={styles.parentFamily}>
          <ResearchHint>
            No parents recorded
          </ResearchHint>
        </View>}
      {parents.map(({mother, father}) => {
        const parentId = mother ? mother.id : father.id
        const parentPromise = parentRelationships['relationshipsFor' + parentId]
        const spouseId = (mother && (father && father.id) || 'missing')
        
        return <View style={styles.parentFamily} key={parentId}>
          <PersonCard
            title="mother"
            ctx={ctx}
            person={mother}
            mainPerson={person}
            marriage={parentPromise.families && parentPromise.families[spouseId].marriage}
            queueItemStatus={mother && makeQueueStatus(mother.id, queue, ctx.actions)}
          />
          <PersonCard
            title="father"
            ctx={ctx}
            person={father}
            mainPerson={person}
            queueItemStatus={father && makeQueueStatus(father.id, queue, ctx.actions)}
          />
          {renderSiblings(parentPromise, (mother || father), spouseId, person, queue, ctx)}
        </View>
      })}
    </View>
  }
})

const renderSiblings = (parentPromise, parent, spouseId, mainPerson, queue, ctx) => {
  if (parentPromise === probably.LOADING) {
    return <View>Loading children of {parent.display.name}</View>
  }
  if (parentPromise instanceof Error) {
    return <View>Unable to load family of {parent.display.name}</View>
  }
  const children = parentPromise.families[spouseId].children.slice()
  children.sort((a, b) => a.display.meta.born - b.display.meta.born)
  return (
    <View style={styles.siblings}>
      {children.map(child => (
        <PersonCard
          key={child.id}
          ctx={ctx}
          title="sibling"
          person={child}
          mainPerson={mainPerson}
          queueItemStatus={makeQueueStatus(child.id, queue, ctx.actions)}
        />
      ))}
    </View>
  )
}

const ErrorMessage = () => <View>Unable to load family</View>
const Loading = () => <View>Loading family</View>

const MaybePersonFamily = props => {
  if (props.personWithRelationships === probably.LOADING) {
    return <Loading />
  }
  if (props.personWithRelationships instanceof Error) {
    return <ErrorMessage />
  }
  return <PersonFamily {...props} />
}

export default MaybePersonFamily

const styles = {
  container: {
    padding: 10,
    flexDirection: 'row',
  },

  parentsAndSiblings: {
    flex: 1,
    padding: 10,
  },

  children: {
    marginLeft: 20,
  },

  siblings: {
    marginLeft: 20,
  },

  parentFamily: {
    borderTop: '5px solid #ccc',
    marginTop: 15,
  },

  family: {
    borderTop: '5px solid #ccc',
    marginTop: 15,
  },

  missingFamily: {
    borderTop: '5px solid #ccc',
    marginTop: 15,
  },

  expectNoMarriages: {
    padding: 10,
    lineHeight: 1.5,
  },

  expectNoChildren: {
    padding: 10,
    fontSize: '80%',
    lineHeight: 1.5,
  },

  groupHeader: {
    fontSize: '60%',
    textTransform: 'small-caps',
  },

  spousesAndChildren: {
    flex: 1,
    padding: 10,
  },
}


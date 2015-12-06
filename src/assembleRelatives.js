
const COUPLE_TYPE = "http://gedcomx.org/Couple"
const UNKNOWN = 'UNKNOWN'
const MARRIAGE_TYPE = "http://gedcomx.org/Marriage"

const getNormalized = item => {
  if (!item.normalized) return null
  let res = null
  item.normalized.some(val => {
    if (val.value) {
      res = val.value
      return true
    }
  })
  return res
}

const getDateYear = formal => {
  const match = formal && formal.match(/\d{4}/)
  return match ? parseInt(match[0]) : null
}

export default (pid, {relationships = [], childAndParentsRelationships = [], persons}) => {
  const families = {}
  const parents = []
  const parentIds = []
  const childIds = []
  persons = persons.reduce((obj, person) => (person.id !== UNKNOWN && (obj[person.id] = addMeta(person)), obj), {})
  const person = persons[pid]

  // Couple relationships
  relationships.forEach(({type, facts, person1: {resourceId: p1}, person2: {resourceId: p2}}) => {
    if (type !== COUPLE_TYPE) return
    const spouse = p1 === pid ? p2 : p1
    families[spouse] = {spouse: persons[spouse], children: []}
    const spouseIsFemale = person.display.gender.toLowerCase() !== 'female'
    if (spouseIsFemale) {
      families[spouse].mother = persons[spouse]
      families[spouse].father = person
    } else {
      families[spouse].father = persons[spouse]
      families[spouse].mother = person
    }
    if (facts) {
      facts.some(fact => {
        if (fact.type !== MARRIAGE_TYPE) return
        families[spouse].marriage = {
          date: fact.date && getNormalized(fact.date),
          year: fact.date && getDateYear(fact.date.formal),
          place: fact.place && getNormalized(fact.place),
        }
        return true
      })
    }
  })

  childAndParentsRelationships.forEach(({child, father, mother}) => {
    const childId = child && child.resourceId
    const fatherId = father ? father.resourceId : 'missing'
    const motherId = mother ? mother.resourceId : 'missing'
    // I am the child
    if (childId === pid) {
      parents.push({father: persons[fatherId], mother: persons[motherId]})
      if (father && parentIds.indexOf(fatherId) === -1) {
        parentIds.push(fatherId)
      }
      if (mother && parentIds.indexOf(motherId) === -1) {
        parentIds.push(motherId)
      }
      return
    }

    if (childIds.indexOf(childId) === -1) {
      childIds.push(childId)
    }

    const spouse = fatherId === pid ? motherId : fatherId
    if (families[spouse]) {
      families[spouse].children.push(persons[childId])
    } else {
      families[spouse] = {
        father: persons[fatherId],
        mother: persons[motherId],
        spouse: persons[spouse],
        children: [persons[childId]],
      }
    }
  })

  person.display.meta = estimateMeta(person, families)
  return {families, parents, parentIds, childIds, persons, person: persons[pid]}
}

const addMeta = (person) => {
  if (!person.display) {
    return null
  }
  person.display.meta = getMeta(person.display)
  return person
}

const estimateMeta = (person, families) => {
  const meta = getMeta(person.display)
  // TODO if birth || death is estimated, find the missing one
  if (!meta.born || isNaN(meta.born)) {
    return ofind(families, family => {
      const birthYears = family.children
        .map(child => getMeta(child.display).age)
        .filter(age => age !== false)
      if (!birthYears.length) {
        return null
      }
      const oldest = Math.min(birthYears)
      return {
        age: 40,
        born: oldest - 20,
        died: oldest + 20,
        original: meta,
        estimatedBirth: true,
        estimatedDeath: true,
        estimated: true,
      }
    }) || meta
  }
  return meta
}

export const getMeta = ({birthDate, lifespan}) => {
  const parts = lifespan.split('-')
  if (parts.length !== 2) {
    return {
      born: null,
      died: null,
      age: null,
      estimatedBirth: true,
      estimatedDeath: true,
      estimated: true,
    }
  }
  let born = parseInt(parts[0], 10)
  let died = parseInt(parts[1], 10)
  let estimatedBirth = false
  let estimatedDeath = false
  if (isNaN(born) && !isNaN(died)) {
    born = died - 40
    estimatedBirth = true
  }
  if (isNaN(died) && !isNaN(born)) {
    died = born + 40
    estimatedDeath = true
  }
  if (isNaN(born)) {
    return {
      born: null,
      died: null,
      age: null,
      estimatedBirth: true,
      estimatedDeath: true,
      estimated: true,
    }
  }
  const age = died - born
  return {born, died, age, estimatedBirth, estimatedDeath, estimated: estimatedBirth || estimatedDeath}
}

const ofind = (o, fn) => {
  const keys = Object.keys(o)
  for (let i=0; i<keys.length; i++) {
    const res = fn(o[keys[i]], keys[i])
    if (res) return res
  }
  return null
}



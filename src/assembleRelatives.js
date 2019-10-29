// @flow

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

import type {Person, FamiliesApiResponse} from './api-types'

export type PersonWithMeta = {...Person, display: {...$PropertyType<Person, 'display'>, meta: Meta}}

export type Family = {|
  spouse: ?PersonWithMeta,
  parent2?: ?PersonWithMeta,
  parent1?: ?PersonWithMeta,
  children: Array<PersonWithMeta>,
  marriage?: {date: ?string, year: ?number, place: ?string}
|}

export type Relatives = {|
  families: {[spouseId: string]: Family},
  parents: Array<{|
    parent1: PersonWithMeta,
    parent2: PersonWithMeta,
  |}>,
  parentIds: Array<string>,
  childIds: Array<string>,
  persons: {[personId: string]: PersonWithMeta},
  person: PersonWithMeta,
|}

export default (pid: string, {relationships = [], childAndParentsRelationships = [], persons: personsArray}: FamiliesApiResponse) => {
  const families: {[key: string]: Family} = {}
  const parents = []
  const parentIds = []
  const childIds = []
  const persons: {[key: string]: PersonWithMeta} = personsArray.reduce((obj, person) => (person.id !== UNKNOWN && (obj[person.id] = addMeta(person)), obj), {})
  const person = persons[pid]

  // Couple relationships
  relationships.forEach(({type, facts, person1: {resourceId: p1}, person2: {resourceId: p2}}) => {
    if (type !== COUPLE_TYPE) return
    const spouse = p1 === pid ? p2 : p1
    families[spouse] = {spouse: persons[spouse], children: []}
    const spouseIsFemale = person.display.gender.toLowerCase() !== 'female'
    if (spouseIsFemale) {
      families[spouse].parent2 = persons[spouse]
      families[spouse].parent1 = person
    } else {
      families[spouse].parent1 = persons[spouse]
      families[spouse].parent2 = person
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

    // parents, parentIds, childIds, families[]
  childAndParentsRelationships.forEach(({child, parent1, parent2}) => {
    const childId = child && child.resourceId
    const parent1Id = parent1 ? parent1.resourceId : 'missing'
    const parent2Id = parent2 ? parent2.resourceId : 'missing'
    // I am the child
    if (childId === pid) {
      parents.push({parent1: persons[parent1Id], parent2: persons[parent2Id]})
      if (parent1 && parentIds.indexOf(parent1Id) === -1) {
        parentIds.push(parent1Id)
      }
      if (parent2 && parentIds.indexOf(parent2Id) === -1) {
        parentIds.push(parent2Id)
      }
      return
    }

    if (childIds.indexOf(childId) === -1) {
      childIds.push(childId)
    }

    const spouse = parent1Id === pid ? parent2Id : parent1Id
    if (families[spouse]) {
      families[spouse].children.push(persons[childId])
    } else {
      families[spouse] = {
        parent1: persons[parent1Id],
        parent2: persons[parent2Id],
        spouse: persons[spouse],
        children: [persons[childId]],
      }
    }
  })

  person.display.meta = estimateMeta(person, families)
  return {families, parents, parentIds, childIds, persons, person: persons[pid]}
}

const addMeta = (person: Person): ?PersonWithMeta => {
  if (!person.display) {
    return null
  }
  // $FlowFixMe
  person.display.meta = getMeta(person.display)
  // $FlowFixMe
  return person
}

const estimateMeta = (person, families) => {
  const meta = getMeta(person.display)
  // TODO if birth || death is estimated, find the missing one
  if (!meta.born || isNaN(meta.born)) {
    return ofind(families, family => {
      const birthYears = family.children
        .map(child => getMeta(child.display).age)
        .filter(age => age != null)
      if (!birthYears.length) {
        return null
      }
       // $FlowFixMe
      const oldest = Math.min(...birthYears)
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

export type Meta = {
  born: ?number,
  died: ?number,
  age: ?number,
  estimatedBirth: boolean,
  estimatedDeath: boolean,
  estimated: boolean,
}

export const getMeta = ({birthDate, lifespan}: {birthDate: ?string, lifespan: string}): Meta => {
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
    const res = fn(o[keys[i]])
    if (res) return res
  }
  return null
}

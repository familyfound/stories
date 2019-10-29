
const find = (ar, fn) => {
  for (const item of ar) {
    if (fn(item)) return item
  }
}

const GIVEN_TYPE = "http://gedcomx.org/Given"
const SURNAME_TYPE = "http://gedcomx.org/Surname"
const CHRISTENING_TYPE = "http://gedcomx.org/Christening"
const BIRTH_TYPE = "http://gedcomx.org/Birth"

const getNameParts = person => {
  if (!person || !person.names || !person.names.length) return
  const name = find(person.names, name => name.preferred)
  if (!name) return
  if (!name.nameForms || !name.nameForms.length) return
  const parts = name.nameForms[0].parts
  let given
  let surname
  parts.forEach(part => {
    switch (part.type) {
      case GIVEN_TYPE:
        return (given = part.value)
      case SURNAME_TYPE:
        return (surname = part.value)
    }
  })
  return {given, surname}
}

const organizeFacts = person => person.facts.reduce(
  (obj, fact) => (obj[fact.type] = fact, obj),
  {}
)

const getNormalized = val => val.normalized && val.normalized.length && val.normalized[0].value

const yearFromStr = str => {
  if (!str) return
  const match = str.match(/\d{4}/)
  return match ? +match[0] : null
}

const getBirthYear = facts => {
  if (facts[BIRTH_TYPE] && facts[BIRTH_TYPE].date) {
    const year = yearFromStr(facts[BIRTH_TYPE].date.formal)
    if (year) return year
  }
  if (facts[CHRISTENING_TYPE] && facts[CHRISTENING_TYPE].date) {
    const year = yearFromStr(facts[CHRISTENING_TYPE].date.formal)
    if (year) return year
  }
}

const getBirthPlace = facts => {
  if (facts[BIRTH_TYPE] && facts[BIRTH_TYPE].place) {
    return getNormalized(facts[BIRTH_TYPE].place) || facts[BIRTH_TYPE].place.original
  }
  if (facts[CHRISTENING_TYPE] && facts[CHRISTENING_TYPE].place) {
    return getNormalized(facts[CHRISTENING_TYPE].place) || facts[CHRISTENING_TYPE].place.original
  }
}

const queryToString = attrs => Object.entries(attrs).map(([key, value]) => `+${key}:${value}`).join(' ')

const escapeString = str => {
  if (true || str.indexOf(' ') !== -1) return JSON.stringify(str)
  return str
}

const simpleQueryAttrs = person => {
  const attrs = {}
  const name = getNameParts(person)
  if (name) {
    if (name.given) {
      attrs.givenname = escapeString(name.given) + '~'
    }
    if (name.surname) {
      attrs.surname = escapeString(name.surname) + '~'
    }
  }
  const facts = organizeFacts(person)
  const birthYear = getBirthYear(facts)
  if (birthYear) {
    attrs.birth_year = `${birthYear - 2}-${birthYear+2}~`
  }
  const birthPlace = getBirthPlace(facts)
  if (birthPlace) {
    attrs.birth_place = escapeString(birthPlace) + `~`
  }
  return attrs
}

export const simpleSearchQuery = person => {
  return queryToString(simpleQueryAttrs(person))
}

export const parentsSearchQuery = ({person, parents}) => {
  // TODO search for a set of parents individually
  const attrs = simpleQueryAttrs(person)
  if (!parents.length) return queryToString(attrs)
  const {parent2, parent1} = parents[0]
  if (parent2) {
    const motherName = getNameParts(parent2)
    if (motherName) {
      if (motherName.given) {
        attrs.mother_givenname = escapeString(motherName.given) + '~'
      }
      if (motherName.surname) {
        attrs.mother_surname = escapeString(motherName.surname) + '~'
      }
    }
  }

  if (parent1) {
    const fatherName = getNameParts(parent1)
    if (fatherName) {
      if (fatherName.given) {
        attrs.father_givenname = escapeString(fatherName.given) + '~'
      }
      if (fatherName.surname) {
        attrs.father_surname = escapeString(fatherName.surname) + '~'
      }
    }
  }
  return queryToString(attrs)
}


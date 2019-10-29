
const thisYear = new Date().getFullYear()

const getEarliestMarriageYear = relatives => {
  const year = osomeval(relatives.families, family => family.marriage && family.marriage.year)
  if (year != null) return year
  return Math.min(relatives.childIds.map(cid => {
    const child = relatives.persons[cid]
    if (!child.display.meta.estimatedBirth && !isNaN(+child.display.meta.born)) {
      return child.display.meta.born
    }
    return thisYear
  }))
}

export default (relatives) => {
  const person = relatives.person
  // TODO need much more nuanced "no/few children" logic, maybe unify w/
  // PersonFamily.js stuff? or at least align them
  const meta = {
    numChildren: ocount(relatives.families, family => family.children.length),
    hasSpouse: osome(relatives.families, family => !!family.spouse),
    earliestMarriageYear: getEarliestMarriageYear(relatives),
  }
  const reasons = []
  Object.keys(checkers).forEach(name => {
    if (Array.isArray(checkers[name])) {
      if (!checkers[name].some(sub => reasons.indexOf(sub) === -1)) {
        reasons.push(name)
      }
    } else {
      if (checkers[name](person, relatives, meta)) {
        reasons.push(name)
      }
    }
  })
  const numStrong = strongCriteria.filter(items => !items.some(sub => reasons.indexOf(sub) === -1)).length
  return {reasons, numStrong}
}

const checkers = {
  _dead: person => !person.living,
  _livedTo16: ({display: {meta}}) => meta.age === false || meta.age >= 16,
  _moreThan90Years: ({display: {meta}}) => thisYear - meta.born >= 90,
  _moreThan110Years: ({display: {meta}}) => thisYear - meta.born >= 110,
  _moreThan110Years: ({display: {meta}}) => thisYear - meta.born >= 110,
  _moreThan130Years: ({display: {meta}}) => thisYear - meta.born >= 130,
  _marriedMoreThan110Years: (_, $, meta) => meta.earliestMarriageYear == null || thisYear - meta.earliestMarriageYear >= 110,
  _couldBeMarried: ['_livedTo16', '_dead', '_moreThan110Years'],
  _couldHaveChildren: ['_livedTo16', '_dead', '_moreThan130Years', '_marriedMoreThan110Years'],

  invalidFather: (person, {parents}) => false,
  invalidMother: (person, {perents}) => false,
  noFather: (person, {parents}) => !parents.some(parents => !!parents.parent1),
  noMother: (person, {parents}) => !parents.some(parents => !!parents.parent2),
  noChildren: (_, $, meta) => meta.hasSpouse && meta.numChildren === 0,
  fewChildren: (_, $, meta) => meta.hasSpouse && meta.numChildren < 3 && meta.numChildren !== 0,
  noSpouse: (_, $, meta) => !meta.hasSpouse,
  invalidSpouse: (_, {families}, meta) => false,
  invalidChild: (_, {families}, meta) => false,
}

const strongCriteria = [
  ['_couldBeMarried', 'noSpouse'],
  ['_couldBeMarried', 'invalidSpouse'],
  ['_couldHaveChildren', 'fewChildren'],
  ['_couldHaveChildren', 'noChildren'],
  ['_couldHaveChildren', 'invalidChild'],
  ['_moreThan90Years', 'noFather'],
  ['_moreThan90Years', 'noMother'],
  ['_moreThan90Years', 'invalidFather'],
  ['_moreThan90Years', 'invalidMother'],
]

const ocount = (o, fn) => Object.keys(o).reduce((num, key) => num + fn(o[key], key), 0)
const osome = (o, fn) => Object.keys(o).some(key => fn(o[key], key))
const osomeval = (o, fn) => {
  let res = null
  Object.keys(o).some(key => (res = fn(o[key]), res))
  return res
}

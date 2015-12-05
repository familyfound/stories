
import memOnce, {memOnce2} from '../../util/memOnce'

export default memOnce2((people, mainPerson) => {
  if (!mainPerson || !people[mainPerson]) return []
  const peopleList = []
  const add = (id, gen, num) => {
    if (!people[id]) return
    const person = people[id]
    peopleList.push({
      id,
      gen,
      num,
      person,
      mother: person.parents.length && person.parents[0].mother,
      father: person.parents.length && person.parents[0].father,
    })
    // TODO find siblings
  }

  add(mainPerson, 0, 0)
  for (let i=0; i<peopleList.length; i++) {
    if (peopleList[i].gen < 8) {
      const {mother, father, gen, num} = peopleList[i]
      add(mother, gen + 1, num * 2 + 1)
      add(father, gen + 1, num * 2)
    }
  }

  return peopleList
})



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
      parent2: person.parents.length && person.parents[0].parent2,
      parent1: person.parents.length && person.parents[0].parent1,
    })
    // TODO find siblings
  }

  add(mainPerson, 0, 0)
  for (let i=0; i<peopleList.length; i++) {
    if (peopleList[i].gen < 8) {
      const {parent2, parent1, gen, num} = peopleList[i]
      add(parent2, gen + 1, num * 2 + 1)
      add(parent1, gen + 1, num * 2)
    }
  }

  return peopleList
})


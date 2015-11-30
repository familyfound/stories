
import metaphone from 'metaphone'
import editDistance from '../../util/editDistance'

const matchType = (one, two) => {
  if (!two) return 'extra'
  if (one === two) {
    return 'exact'
  }
  if (editDistance(one, two) < 2) {
    return 'close'
  }
  if (metaphone(one) === metaphone(two)) {
    return 'similar'
  }
  return 'different'
}

export default (name, realName) => {
  const parts = name.toLowerCase().split(/\s+/g)
  const realParts = realName.toLowerCase().split(/\s+/g)
  // const meta = parts.map(metaphone)
  // const realMeta = realParts.map(metaphone)

  // TODO what if there is no last name?
  // align last names
  const last = parts.pop()
  const realLast = realParts.pop()
  const result = parts.map((part, i) => {
    return {text: part, match: matchType(part, realParts[i])}
  })
  result.push({text: last, match: matchType(last, realLast)})
  return result
}



const backPrefix = num => {
  if (num === 0) return 'You'
  if (num === 1) return ''
  if (num === 2) return 'grand'
  if (num === 3) return 'great-grand'
  if (num === 4) return 'great-great-grand'
  if (num === 5) return '3rd great-grand'
  return (num - 2) + 'th great-grand'
}

const auntPrefix = num => {
  if (num === 0) return ''
  if (num === 1) return 'great-'
  if (num === 2) return 'great-great-'
  if (num === 3) return '3rd great-'
  return num + 'th great-'
}

const cousinPrefix = num => {
  if (num === 1) return '1st'
  if (num === 2) return '2nd'
  if (num === 3) return '3rd'
  return num + 'th'
}

const calcRelation = (trail, numUp, numDown, possessive = 'Your') => {
  if (!trail.length) return 'You'
  const side = trail[0].rel
  const lastUpRel = numUp > 1 && trail[numUp - 1].rel
  if (!numDown) {
    if (numUp === 1) {
      return `${possessive} ${side}`
    }
    if (numUp === 2) {
      return `${possessive} ${side}'s ${trail[1].rel}`
    }
    return `${possessive} ${side}'s ${backPrefix(numUp - 1)}${lastUpRel}`
  }
  const lastGender = trail[trail.length - 1].gender
  if (numDown === 1) {
    const auntWord = lastGender === 'female' ? 'aunt' : 'uncle';
    if (numUp === 2) {
      return '${possessive} ' + auntWord
    }
    return `${possessive} ${side}'s ${auntPrefix(numUp - 3)}${auntWord}`
  }
  const prefix = backPrefix(numUp - 1 - numDown)
  return `${possessive} ${side}'s ${prefix}${lastUpRel}'s ${cousinPrefix(numDown - 1)} cousin`
}

export default calcRelation


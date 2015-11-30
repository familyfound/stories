
export default val => {
  if (typeof val === 'function') {
    return e => {
      e.stopPropagation()
      e.preventDefault()
      return val(e)
    }
  } else {
    val.stopPropagation()
    val.preventDefault()
  }
}


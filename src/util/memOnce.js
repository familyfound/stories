
export default fn => {
  let lastArg = null
  let lastVal = null
  return arg => arg === lastArg ? lastVal : (lastVal = fn(lastArg = arg))
}

export const memOnce2 = fn => {
  let lastArg1 = null
  let lastArg2 = null
  let lastVal = null
  return (arg1, arg2) => (arg1 === lastArg1 && arg2 === lastArg2)
    ? lastVal : (lastVal = fn(lastArg1 = arg1, lastArg2 = arg2))
}


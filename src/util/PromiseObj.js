
export default obj => {
  const names = Object.keys(obj)
  return Promise.all(names.map(name => obj[name])).then(
    vals => names.reduce(
      (obj, name, i) => (obj[name] = vals[i], obj), {}
    )
  )
}



export default (obj, names) => {
  const result = {
    _data: {},
  }
  names.forEach(name => {
    const cache = result._data[name] = {}
    result[name] = (...args) => {
      const key = args.join(':')
      if (!cache[key]) {
        const promise = cache[key] = obj[name](...args)
        promise.catch(err => {
          // forget failed requests
          delete cache[key]
        })
        if (promise.finally) {
          promise.finally(() => {
            if (promise.isCancelled()) {
              delete cache[key]
            }
          })
        }
      }
      return cache[key]
    }
  })

  result.dump = async () => {
    const data = {}
    for (const name in result._data) {
      data[name] = {}
      for (const key in result._data[name]) {
        try {
          data[name][key] = await result._data[name][key]
        }catch(e) {
          console.log('nope', name, key)
        }
      }
    }
    return data
  }

  result.remove = (name, key) => {
    delete result._data[name][key]
  }

  result.load = data => {
    Object.keys(data).forEach(name => {
      if (!result._data[name]) {
        result._data[name] = {}
      }
      Object.keys(data[name]).forEach(key => {
        result._data[name][key] = Promise.resolve(data[name][key])
      })
    })
  }
  return result
}


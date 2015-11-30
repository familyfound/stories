
import api from './api'
import * as creators from './creators'

const checkErr = fn => (...args) => fn(...args).catch(err => console.error(err, err.stack))

window.setToken = checkErr(async (token) => {
  window.store.dispatch(creators.setLoggedIn('checking'))
  const isGood = await api.checkToken(token)
  window.store.dispatch(creators.setLoggedIn(isGood))
  if (isGood) {
    localStorage.token = token
  }
})


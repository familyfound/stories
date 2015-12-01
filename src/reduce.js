
import * as handlers from './handlers'
import * as extras from './extras'

export default (state, action) => {
  if (!handlers[action.type]) {
    console.log('Invalid action', action)
    throw new Error(`Unexpected action ${action.type}`)
  }
  const newState = handlers[action.type](state, action.args || {})
  Object.values(extras).forEach(fn => fn(newState, state))
  return newState
}


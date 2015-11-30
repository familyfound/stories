
import * as handlers from './handlers'

export default (state, action) => {
  if (!handlers[action.type]) {
    console.log('Invalid action', action)
    throw new Error(`Unexpected action ${action.type}`)
  }
  return handlers[action.type](state, action.args || {})
}


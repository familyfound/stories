// @flow
import Store from './Store'

export default <T: Object, State, Action>(creators: T, store: Store<State, Action>): T => {
  // $FlowIgnore
  const actions: T = {}
  Object.keys(creators).forEach(name => {
    actions[name] = (...args) => {
      const action = creators[name](...args, store.state)
      if (!action) return
      if (typeof action.then === 'function') {
        action.then(val => store.dispatch(val), err => console.error('Failed to make action', name, args, store.state, err))
      } else {
        store.dispatch(action)
      }
    }
  })
  return actions
}


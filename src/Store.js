
export default class Store {
  constructor(state, reduce) {
    this.listeners = []
    this.state = state
    this.reduce = reduce
    this.dispatch = this.dispatch.bind(this)
  }

  dispatch(action) {
    const newState = this.state = this.reduce(this.state, action)
    this.listeners.forEach(fn => fn(newState))
  }

  on(fn) {
    if (this.listeners.indexOf(fn) === -1) {
      this.listeners.push(fn)
    }
  }

  off(fn) {
    const ix = this.listeners.indexOf(fn)
    if (ix !== -1) {
      this.listeners.splice(ix, 1)
    }
  }
}


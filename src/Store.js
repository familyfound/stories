// @flow

export default class Store<State, Action> {
  state: State
  reduce: (State, Action) => State;
  listeners: Array<State => void>;
  dispatch: Action => void;

  constructor(state: State, reduce: (State, Action) => State) {
    this.listeners = []
    this.state = state
    this.reduce = reduce
    this.dispatch = this.dispatch.bind(this)
  }

  dispatch(action: Action) {
    const newState = this.state = this.reduce(this.state, action)
    this.listeners.forEach(fn => fn(newState))
  }

  on(fn: State => void) {
    if (this.listeners.indexOf(fn) === -1) {
      this.listeners.push(fn)
    }
  }

  off(fn: State => void) {
    const ix = this.listeners.indexOf(fn)
    if (ix !== -1) {
      this.listeners.splice(ix, 1)
    }
  }
}


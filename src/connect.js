
import React from 'react'

export default ({props: propNames, render: Component, name}) => {
  class Wrapper extends React.Component {
    constructor(props) {
      super(props)
      this.state = getState(propNames, props.ctx.store.state)
      this.update = newState => this.setState(getState(propNames, newState))
    }

    componentDidMount() {
      this.props.ctx.store.on(this.update)
    }

    componentWillUnmount() {
      this.props.ctx.store.off(this.update)
    }

    shouldComponentUpdate(nextProps, nextState) {
      return (nextState !== this.state &&
              neq(nextState, this.state)) || neq(nextProps, this.props)
    }

    render() {
      return (
        <Component
          {...this.props}
          {...this.state}
          dispatch={this.props.ctx.store.dispatch}
        />
      )
    }
  }
  if (name && !Component.displayName) {
    Component.displayName = name
  }
  Wrapper.displayName = `ConnectWrapper(${Component.displayName || Component.name})`
  return props => <Wrapper {...props}/>
}

const getState = (propNames, state) => {
  return propNames.reduce((obj, name) => (
    (obj[name] = state[name]), obj
  ), {})
}

const neq = (a, b) => {
  for (const name in a) {
    if (a[name] !== b[name]) return true
  }
  for (const name in b) {
    if (a[name] !== b[name]) return true
  }
  return false
}


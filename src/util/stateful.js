import React from 'react'

export default ({initial, helpers, shouldReset, render, name}) => {
  if ('object' !== typeof initial) {
    throw new Error(`Invalid initial state for ${name || render.displayName || render.name}`)
  }
  const Component = render
  class Wrapper extends React.Component {
    constructor(props) {
      super(props)
      this.state = initial
      this.helpers = {}
      if (helpers) {
        for (const name in helpers) {
          this.helpers[name] = (...args) => this.setState(helpers[name](this.props, this.state, ...args))
        }
      }
      for (const name in initial) {
        const fn = 'set' + name[0].toUpperCase() + name.slice(1)
        if (this.helpers[fn]) {
          continue
        }
        this.helpers[fn] = val => this.setState({[name]: val})
      }
    }

    componentWillReceiveProps(nextProps) {
      if (shouldReset && shouldReset(nextProps, this.props)) {
        this.setState(initial)
      }
    }

    render() {
      return <Component {...this.props} {...this.state} {...this.helpers} />
    }
  }

  if (name) {
    render.displayName = name
  }
  Wrapper.displayName = `StatefulWrapper(${render.displayName || render.name})`
  return Wrapper
}


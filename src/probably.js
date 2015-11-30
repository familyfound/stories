
import React from 'react'

const LOADING = Symbol('probably:loading')

const probably = ({
  name,
  promises,
  render: Component,
  shouldRefresh = () => true,
  shouldUpdate = null,
}) => {
  class Wrapper extends React.Component {
    constructor(props) {
      super(props)
      this._removed = false
      this.state = {
        $promises: promises(props),
      }
      for (const name in this.state.$promises) {
        if (this.state.$promises[name] && typeof this.state.$promises[name].then === 'function') {
          this.state[name] = LOADING
          if (this.state.$promises[name].isFulfilled && this.state.$promises[name].isFulfilled()) {
            this.state[name] = this.state.$promises[name].value()
          } else {
            this.state.$promises[name].then(
              val => !this._removed && this.setState({[name]: val}),
              err => !this._removed && this.setState({[name]: err}),
            )
          }
        } else {
          this.state[name] = this.state.$promises[name]
        }
      }
    }

    componentWillUnmount() {
      this._removed = true
      // TODO we don't cancel promises that would have been forgotten due to
      // intermediate componentWillReceiveProps stuff... but I'm ok with that
      // for now.
      Object.values(this.state.$promises).forEach(promise => {
        if (promise.cancel) {
          promise.cancel()
        }
      })
    }

    componentWillReceiveProps(nextProps) {
      if (!shouldRefresh(nextProps, this.props)) {
        return
      }
      const newState = {
        $promises: promises(nextProps),
      }
      for (const name in this.state.$promises) {
        if (newState.$promises[name] && typeof newState.$promises[name].then === 'function') {
          newState[name] = LOADING
          newState.$promises[name].then(
            val => !this._removed && this.setState({[name]: val}),
            err => {
              console.error('promise failed', err)
              if (this._removed) return
              this.setState({[name]: err})
            }
          )
        } else {
          newState[name] = newState.$promises[name]
        }
      }
      this.setState(newState)
    }

    shouldComponentUpdate(nextProps, nextState) {
      return (
        nextState !== this.state ||
        (shouldUpdate ?
          shouldUpdate(nextProps, this.props) :
          shouldRefresh(nextProps, this.props))
      )
    }

    render() {
      return <Component {...this.state} {...this.props} />
    }
  }

  if (name && !Component.displayName) {
    Component.displayName = name
  }
  Wrapper.displayName = `PromiseWrapper(${Component.displayName || Component.name})`
  return Wrapper
}

probably.LOADING = LOADING

export default probably


import React from 'react'
import {findDOMNode} from 'react-dom'

const isWithinNode = (target, node) => {
  if (target === node) return true
  while (target.parentNode && target.parentNode !== document.body) {
    target = target.parentNode
    if (target === node) return true
  }
  return false
}

export default Component => class Wrapper extends React.Component {
  constructor(props) {
    super(props)
    this.state = {isOpen: this.props.initialValue}
    this._closer = e => {
      if (isWithinNode(e.target, this._node)) return
      e.stopPropagation()
      e.preventDefault()
      if (!this._unmounted) {
        this.setState({isOpen: false})
      }
    }
    this._unmounted = false
  }

  componentDidMount() {
    this._node = findDOMNode(this)
  }

  componentWillUnmount() {
    this._unmounted = true
    window.removeEventListener('mousedown', this._closer, true)
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.isOpen && !this.state.isOpen) {
      window.removeEventListener('mousedown', this._closer, true)
    } else if (!prevState.isOpen && this.state.isOpen) {
      window.addEventListener('mousedown', this._closer, true)
    }
  }

  render() {
    return (
      <Component
        {...this.props}
        isOpen={this.state.isOpen}
        toggleOpen={() => this.setState({isOpen: !this.state.isOpen})}
      />
    )
  }
}


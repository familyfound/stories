
import React from 'react'
import {findDOMNode} from 'react-dom'

export default class Popover extends React.Component {
  componentDidMount() {
    window.addEventListener('mousedown', evt => {
      const div = findDOMNode(this)
      let isChild = false
      let node = evt.target
      while (node.parentNode) {
        if (node === div) {
          isChild = true
          break
        }
        node = node.parentNode
      }
      if (!isChild) {
        this.props.
      }
    }, true)
  }

  render() {
    return this.props.children
  }
}



import React from 'react'
import View from '../View'

const mediaMatches = media => {
  if (media.minWidth) {
    return media.minWidth <= window.innerWidth
  }
  if (media.maxWidth) {
    return media.maxWidth >= window.innerWidth
  }
  return false
}

class MediaQueried extends React.Component {
  constructor(props) {
    super(props)
    this.state = {active: mediaMatches(props)}
  }
  componentDidMount() {
    this.handler = () => {
      this.setState({active: mediaMatches(this.props)})
    }
    window.addEventListener('resize', this.handler)
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.handler)
  }
  render() {
    if (typeof this.props.children !== 'function') {
      throw new Error('Children needs to be a function')
    }
    return this.props.children(this.state.active)
  }
}

export default MediaQueried



import React from 'react'
import View from '../View'

class Hoverable extends React.Component {
  constructor(props) {
    super(props)
    this.state = {hover: false}
  }

  render() {
    return (
      <View
        {...this.props}
        onMouseOver={() => this.setState({hover: true})}
        onMouseOut={() => this.setState({hover: false})}
        style={[this.props.style, this.state.hover && this.props.hoverStyle]}
      />
    )
  }
}

export default Hoverable

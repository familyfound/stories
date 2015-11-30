import React from 'react'

export default Component => class Wrapper extends React.Component {
  constructor(props) {
    super(props)
    this.state = {isOpen: this.props.initialValue}
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



import React from 'react'
import mergeStyles from '../mergeStyles'

class BlurTextarea extends React.Component {
  constructor(props) {
    super(props)
    this.state = {tmpValue: this.props.value}
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.value !== this.props.value) {
      this.setState({tmpValue: nextProps.value})
    }
  }

  render() {
    return <textarea
      {...this.props}
      style={mergeStyles({}, this.props.style)}
      value={this.state.tmpValue}
      onChange={e => this.setState({tmpValue: e.target.value})}
      onBlur={() => this.props.onChange(this.state.tmpValue)}
    />
  }
}

export default BlurTextarea

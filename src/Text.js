import React from 'react'
import mergeStyles from './mergeStyles'

const Text = props => {
  const style = props.style ? mergeStyles(defaultStyle, props.style) : defaultStyle
  return <span {...props} style={style} />
}

export default Text

const defaultStyle = {
  display: 'inline-block',
  flexShrink: 0,
  boxSizing: 'border-box',
}


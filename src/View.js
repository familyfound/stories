import React from 'react'
import mergeStyles from './mergeStyles'

const View = props => {
  const style = props.style ? mergeStyles(defaultStyle, props.style) : defaultStyle
  return <div {...props} style={style} />
}

export default View

const defaultStyle = {
  display: 'flex',
  flexDirection: 'column',
  minHeight: 0,
  flexShrink: 0,
  boxSizing: 'border-box',
}


import React from 'react'
import mergeStyles from './mergeStyles'

const Button = props => {
  const style = props.style ? mergeStyles(defaultStyle, props.style) : defaultStyle
  return <button {...props} style={style} onClick={props.onClick && (e => {
    e.stopPropagation()
    return props.onClick(e)
  })}/>
}

export default Button

const defaultStyle = {
  display: 'inline-block',
  flexShrink: 0,
  boxSizing: 'border-box',
  cursor: 'pointer',
  backgroundColor: 'transparent',
  border: '1px solid',
  borderRadius: 5,
}




const mergeStyles = (base, styles) => {
  if (Array.isArray(styles)) {
    return styles.reduce(mergeStyles, base);
  }
  if (!styles) {
    return base
  }
  return {...base, ...styles}
}

export default mergeStyles


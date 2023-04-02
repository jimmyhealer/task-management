function isColorDark(color: string) {
  let hex = color.replace('#', '')
  let r = parseInt(hex.substring(0, 2), 16)
  let g = parseInt(hex.substring(2, 4), 16)
  let b = parseInt(hex.substring(4, 6), 16)
  let luma = 0.2126 * r + 0.7152 * g + 0.0722 * b
  return luma < 128
}

export {
  isColorDark
}
export const clamp = (i: number, min: number, max: number) => {
  if (i < min) {
    return min
  } else if (i > max) {
    return max
  } else {
    return i
  }
}
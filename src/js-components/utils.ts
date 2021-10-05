import { shuffle } from 'lodash-es'

/**
 * Generate a random integer.
 *
 * Lowerbound inclusive, upperbound exclusive.
 */
export const randInt = (a: number, b?: number): number => {
  if (b) {
    return Math.floor(Math.random() * (b - a) + a)
  } else {
    return Math.floor(Math.random() * a)
  }
}

/**
 * Generate a bag of randum numbers starting from 0 to `x`.
 */
export const randBag = (x: number): number[] => {
  return shuffle(range(x))
}

/**
 * Pick an element from an array.
 */
export const pick = <T>(arr: T[]): T => {
  return arr[randInt(arr.length)]
}

/**
 * Pick some elements from an array.
 */
export const pickArray = <T>(arr: T[], num: number): T[] => {
  const pickedIndex = randBag(num)
  const picked: T[] = []
  for (const i of pickedIndex) picked.push(arr[i])
  return picked
}

/**
 * Generate an array contains 0 (inclusive) to `x` (exclusive)
 *
 * If `x` is not an integer, `x` would be floored (but still exclusive)
 */
export const range = (x: number): number[] => {
  return [...Array(Math.floor(x)).keys()]
}

/**
 * Generate an array whose length is `length` and is filled with `value`.
 */
export const fillArray = <T>(length: number, value: T): T[] => {
  return [...Array(Math.floor(length)).fill(value)]
}
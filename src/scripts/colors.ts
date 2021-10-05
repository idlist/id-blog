import { cwd } from 'process'
import type { Chalk } from 'chalk'

interface TColors {
  red: Chalk
  orange: Chalk
  yellow: Chalk
  green: Chalk
  cyan: Chalk
  blue: Chalk
  purple: Chalk
  pink: Chalk
  gray: Chalk
}

const colors = (await import(`file://${cwd()}/utils/colors.js`)).default as TColors

export default colors
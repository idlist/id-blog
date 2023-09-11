import fs from 'fs/promises'
import dedent from 'dedent'
import { ymdFormat } from '../src/utils/server'

const date = new Date()
const update = ymdFormat(date)
const year = date.getFullYear()

const content = dedent`
  export const content = '${update}'
  export const year = ${year}
  `

await fs.writeFile('src/constants.ts', content, { encoding: 'utf8' })
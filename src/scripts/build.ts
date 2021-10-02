import { readFile, writeFile } from 'fs/promises'
import { readdir } from 'fs/promises'
import { cwd } from 'process'

import c from '../../utils/colors.js'
import BlogConfig from './.blogconfig.js'

const config = (await import(`file://${cwd()}/.blogconfig.js`)).default as BlogConfig

const postList = await readdir(`${config.root}/${config.blog.posts}`)

for (const postFilename of postList) {
  const content = await readFile(`${cwd()}/${config.blog.posts}/${postFilename}`)
}
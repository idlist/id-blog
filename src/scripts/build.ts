import { readFile, writeFile } from 'fs/promises'
import { readdir, access, mkdir, rm } from 'fs/promises'
import { cwd } from 'process'
import { createHash } from 'crypto'

import yaml from 'js-yaml'
import markdownIt from 'markdown-it'

import c from '../../utils/colors.js'
import type BlogConfig from './.blogconfig.js'
import type { RawPostMeta, PostMeta, MetaCategory } from '../.data-types.js'

const config = (await import(`file://${cwd()}/.blogconfig.js`)).default as BlogConfig
const metaDelimiter = `${config.blog.metaDelimiter}\r\n`

const allMeta: PostMeta[] = []
const category: MetaCategory = {
  tags: {},
  date: {}
}

const postList = await readdir(`${config.root}/${config.blog.posts}`)

try {
  await access(`${config.root}/${config.blog.cache}`)
} catch {
  await mkdir(`${config.root}/${config.blog.cache}`)
}

try {
  await rm(`${config.root}/${config.blog.output}`, { recursive: true })
} catch { /* Do nothing */}
await mkdir(`${config.root}/${config.blog.output}`)

for (const post of postList) {
  const content = await readFile(`${cwd()}/${config.blog.posts}/${post}`, 'utf-8')

  if (!content.startsWith(metaDelimiter)) {
    console.warn(`${c.yellow('[W]')} Post ${c.green(post)} `
      + 'does not contain valid metadata. skipped.')
    continue
  }

  const metaSection = content.indexOf(metaDelimiter, metaDelimiter.length)
  if (metaSection === -1) {
    console.warn(`${c.yellow('[W]')} Post ${c.green(post)}`
      + 'does not contain ending delimiter of metadata. skipped.')
  }

  const metaString = content.slice(metaDelimiter.length, metaSection)
  let rawMeta: RawPostMeta
  try {
    rawMeta = yaml.load(metaString) as RawPostMeta
  } catch {
    console.warn(`${c.yellow('[W]')} Metadata of post ${c.green(post)} `
      + 'cannot be parsed. skipped.')
    continue
  }

  const missingMeta: (keyof RawPostMeta)[] = []
  if (!rawMeta.title) missingMeta.push('title')
  if (!rawMeta.date || !(rawMeta.date instanceof Date)) missingMeta.push('date')
  if (missingMeta.length) {
    console.warn(`${c.yellow('[W]')} Post ${c.green(post)} does not have `
      + `following required metadata: ${missingMeta.join(', ')}. skipped.`)
  }

  const meta: PostMeta = {
    filename: post,
    title: rawMeta.title,
    route: rawMeta.route
      ?? encodeURI(rawMeta.title.toLowerCase().replace(/\s+/g, '-')),
    date: {
      year: rawMeta.date.getFullYear(),
      month: rawMeta.date.getMonth() + 1,
      day: rawMeta.date.getDate()
    },
    tags: rawMeta.tags
      ? rawMeta.tags.split(' ').map(tag => tag.replace('_', ' ')).filter(tag => tag)
      : []
  }

  if (allMeta.find(existedMeta => existedMeta.route == meta.route)) {
    console.warn(`${c.yellow('[W]')} Metadata of post ${c.green(post)} `
      + 'has dupicated route with previous posts, skipped.')
    continue
  }
  allMeta.push(meta)

  if (!category.date[meta.date.year]) {
    category.date[meta.date.year] = {}
  }
  if (!category.date[meta.date.year][meta.date.month]) {
    category.date[meta.date.year][meta.date.month] = []
  }
  category.date[meta.date.year][meta.date.month].push(meta.route)

  for (const tag in meta.tags) {
    if (!category.tags[tag]) category.tags[tag] = []
    category.tags[tag].push(meta.route)
  }
}
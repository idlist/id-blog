import { readFile, writeFile } from 'fs/promises'
import { readdir, access, mkdir, rm } from 'fs/promises'
import { cwd, argv } from 'process'
import { createHash } from 'crypto'

import yaml from 'js-yaml'
import markdownIt from 'markdown-it'

import c from '../../utils/colors.js'
import type BlogConfig from './.blogconfig.js'
import type { RawPostMeta, PostMeta, MetaCategory } from '../.data-types.js'

// Import Configuration

const config = (await import(`file://${cwd()}/.blogconfig.js`)).default as BlogConfig

const metaDelimiter = `${config.blog.metaDelimiter}\r\n`
const postDir = `${config.root}/${config.blog.posts}`
const cacheDir = `${config.root}/${config.blog.cache}`
const outputDir = `${config.root}/${config.blog.output}`

const options = {
  rebuild: argv.includes('--rebuild-cache')
}

// Prepare global variables

const allMeta: Record<string, PostMeta> = {}
const category: MetaCategory = {
  tags: {},
  date: {}
}

// Prepare functions

const noop = () => { /* Do nothing */ }

const md = markdownIt()

// Prepare folders and files

const postList = await readdir(postDir)

try {
  await access(cacheDir)
  if (options.rebuild) {
    await rm(cacheDir, { recursive: true })
    await mkdir(cacheDir)
  }
} catch {
  await mkdir(cacheDir)
}

let allMetaCache: Record<string, PostMeta> = {}
try {
  allMetaCache = JSON.parse(await readFile(`${cacheDir}/meta.json`, 'utf-8'))
} catch { noop() }

try {
  await rm(outputDir, { recursive: true })
} catch { noop() }
await mkdir(outputDir)

for (const post of postList) {
  const content = await readFile(`${postDir}/${post}`, 'utf-8')
  const contentHash = createHash('md5').update(content).digest('hex')
  const postName = post.split('.')[0]

  // Read from cached metadata

  if (allMetaCache[postName] &&
    allMetaCache[postName].hash === contentHash &&
    !options.rebuild) {
    console.log(`${c.blue('[I]')} Post ${c.green(post)} didn't change. skipped`)
    allMeta[postName] = { ...allMetaCache[postName] }
    continue
  }

  // Extract metadata from posts

  if (!content.startsWith(metaDelimiter)) {
    console.warn(`${c.yellow('[W]')} Post ${c.green(post)} ` +
      'does not contain valid metadata. skipped.')
    continue
  }

  const metaSection = content.indexOf(metaDelimiter, metaDelimiter.length)
  if (metaSection === -1) {
    console.warn(`${c.yellow('[W]')} Post ${c.green(post)}` +
      'does not contain ending delimiter of metadata. skipped.')
  }

  const metaString = content.slice(metaDelimiter.length, metaSection)

  // Parse metadata

  let rawMeta: RawPostMeta
  try {
    rawMeta = yaml.load(metaString) as RawPostMeta
  } catch {
    console.warn(`${c.yellow('[W]')} Metadata of post ${c.green(post)} ` +
      'cannot be parsed. skipped.')
    continue
  }

  const missingMeta: (keyof RawPostMeta)[] = []
  if (!rawMeta.title) missingMeta.push('title')
  if (!rawMeta.date || !(rawMeta.date instanceof Date)) missingMeta.push('date')
  if (missingMeta.length) {
    console.warn(`${c.yellow('[W]')} Post ${c.green(post)} does not have or has wrong ` +
      `metadata: ${missingMeta.map(str => c.blue(str)).join(', ')}. skipped.`)
    continue
  }

  const meta: PostMeta = {
    hash: contentHash,
    title: rawMeta.title,
    route: rawMeta.route
      ?? encodeURI(rawMeta.title.toLowerCase().replace(/\s+/g, '-')),
    date: {
      year: rawMeta.date.getFullYear(),
      month: rawMeta.date.getMonth() + 1,
      day: rawMeta.date.getDate()
    },
    timestamp: rawMeta.date.getTime(),
    tags: rawMeta.tags
      ? rawMeta.tags.split(' ').map(tag => tag.replace('_', ' ')).filter(tag => tag)
      : []
  }

  // Categorize metadata

  if (Object.values(allMeta).find(existedMeta => existedMeta.route == meta.route)) {
    console.warn(`${c.yellow('[W]')} Metadata of post ${c.green(post)} ` +
      'has dupicated route with previous posts, skipped.')
    continue
  }
  allMeta[postName] = meta

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

  // Parse markdown and write cache

  const article = content.slice(metaSection + metaDelimiter.length)
  const parsedArticle = md.render(article)
  await writeFile(`${cacheDir}/${postName}.html`, parsedArticle)
}

// Write metadata cache

await writeFile(`${cacheDir}/meta.json`, JSON.stringify(allMeta))
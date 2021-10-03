import { readFile, writeFile, copyFile } from 'fs/promises'
import { readdir, access, mkdir } from 'fs/promises'
import { cwd, argv, exit } from 'process'
import { createHash } from 'crypto'

import { emptyDir } from 'fs-extra'
import yaml from 'js-yaml'
import markdownIt from 'markdown-it'
import jsBeautify from 'js-beautify'

import type { RawPostMeta, PostMeta, MetaCategory, Meta, Layout } from '../.data-types.js'
import type BlogConfig from './.blogconfig.js'

import c from '../../utils/colors.js'
import { noop, filename } from './utils.js'

// Import Configuration

const config = (await import(`file://${cwd()}/.blogconfig.js`)).default as BlogConfig

const metaDelimiter = `${config.blog.metaDelimiter}\r\n`
const dirLayouts = `${config.root}/${config.compiler.dist}/${config.blog.layouts}`
const dirPosts = `${config.root}/${config.blog.posts}`
const dirCache = `${config.root}/${config.blog.cache}`
const dirOutput = `${config.root}/${config.blog.output}`

const options = {
  watch: argv.includes('--watch') || argv.includes('-w'),
  rebuild: argv.includes('--rebuild-cache')
}

// Prepare global variables

const AllMeta: Record<string, PostMeta> = {}
const Category: MetaCategory = {
  allTags: {},
  allDate: {}
}
const Layouts: Record<string, Layout> = {}

// Prepare markdown factory

const md = markdownIt()

const beautify = jsBeautify.html

// Prepare folders

try {
  await access(dirCache)
  if (options.rebuild) {
    await emptyDir(dirCache)
    await mkdir(dirCache)
  }
} catch {
  await mkdir(dirCache)
}

let AllMetaCache: Record<string, PostMeta> = {}
try {
  AllMetaCache = JSON.parse(await readFile(`${dirCache}/meta.json`, 'utf-8'))
} catch { noop() }

try {
  await emptyDir(dirOutput)
} catch {
  await mkdir(dirOutput)
}
await mkdir(`${dirOutput}/p`)
await mkdir(`${dirOutput}/assets`)

// Prepare files

let postList: string[]
try {
  postList = await readdir(dirPosts)
} catch {
  console.error(`${c.red('[E]')} Cannot found directory for posts: ${dirPosts}, aborted.`)
  exit(1)
}

let layoutList: string[]
try {
  layoutList = await readdir(dirLayouts)
} catch {
  console.error(`${c.red('[E]')} Cannot found directory for transpiled layouts: ${dirLayouts}, aborted.`)
  exit(1)
}

const importLayout = async (layoutFilename: string) => {
  const layoutImport = await import(`file://${cwd()}/${dirLayouts}/${layoutFilename}`)
  const layout = layoutImport.default as Layout
  const layoutName = filename(layoutFilename)
  Layouts[layoutName] = layout
}

/**
 * Process posts in an asynchronous way.
 * @param post Filename of the post, with extension.
 */
const processPosts = async (post: string) => {
  const content = await readFile(`${dirPosts}/${post}`, 'utf-8')
  const contentHash = createHash('md5').update(content).digest('hex')
  const postName = filename(post)

  /**
   * Categorize Metadata
   * @param meta
   */
  const categorizeMeta = (meta: PostMeta) => {
    if (!Category.allDate[meta.date.year]) {
      Category.allDate[meta.date.year] = {}
    }
    if (!Category.allDate[meta.date.year][meta.date.month]) {
      Category.allDate[meta.date.year][meta.date.month] = []
    }
    Category.allDate[meta.date.year][meta.date.month].push(meta.route)

    for (const tag in meta.tags) {
      if (!Category.allTags[tag]) Category.allTags[tag] = []
      Category.allTags[tag].push(meta.route)
    }
  }

  // Read from cached metadata

  if (AllMetaCache[postName] &&
    AllMetaCache[postName].hash === contentHash &&
    !options.rebuild) {

    AllMeta[postName] = { ...AllMetaCache[postName] }
    categorizeMeta(AllMeta[postName])
    return
  }

  // Extract metadata from posts

  if (!content.startsWith(metaDelimiter)) {
    console.warn(`${c.yellow('[W]')} Post ${c.green(post)} ` +
      'does not contain valid metadata. skipped.')
    return
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
    return
  }

  const missingMeta: (keyof RawPostMeta)[] = []
  if (!rawMeta.title) missingMeta.push('title')
  if (!rawMeta.date || !(rawMeta.date instanceof Date)) missingMeta.push('date')
  if (!rawMeta.layout) missingMeta.push('layout')
  if (missingMeta.length) {
    console.warn(`${c.yellow('[W]')} Post ${c.green(post)} does not have or has wrong ` +
      `metadata: ${missingMeta.map(str => c.blue(str)).join(', ')}. skipped.`)
    return
  }

  const meta: PostMeta = {
    ...rawMeta,
    hash: contentHash,
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

  if (Object.values(AllMeta).find(existedMeta => existedMeta.route == meta.route)) {
    console.warn(`${c.yellow('[W]')} Metadata of post ${c.green(post)} ` +
      'has dupicated route with previous posts, skipped.')
    return
  }
  AllMeta[postName] = meta
  categorizeMeta(meta)

  // Parse markdown and write cache

  const article = content.slice(metaSection + metaDelimiter.length)
  const parsedArticle = md.render(article)
  await writeFile(`${dirCache}/${postName}.html`, parsedArticle)

  console.log(`${c.blue('[I]')} Cache built for ${c.green(post)}.`)
}

// Wait for all posts to be processed and all layouts to be imported

await Promise.all([
  ...layoutList.map(async (layoutFilename) => await importLayout(layoutFilename)),
  ...postList.map(async (post) => await processPosts(post))])

// Write metadata cache

await writeFile(`${dirCache}/meta.json`, JSON.stringify(AllMeta))

/**
 * Render the posts
 * @param post Filename of the post, with extension.
 */
const renderPost = async (post: string) => {
  const postName = filename(post)
  const postHtml = await readFile(`${dirCache}/${postName}.html`, 'utf-8')
  const postRoute = `${dirOutput}/p/${AllMeta[postName].route}`

  let renderedHtml = postHtml

  let currentMeta = {
    ...AllMeta[postName],
    ...Category,
    head: '',
    liveReload: options.watch
  }
  let layoutName = currentMeta.layout
  do {
    const currentLayout = Layouts[layoutName](currentMeta)
    renderedHtml = currentLayout.layout(currentMeta, renderedHtml)
    layoutName = currentLayout.parentLayout ?? ''
    if (layoutName) currentMeta = currentLayout.parentMeta as Meta
  } while (layoutName)

  renderedHtml = beautify(renderedHtml, {
    indent_size: 2,
    preserve_newlines: false
  })

  await mkdir(postRoute)
  await writeFile(`${postRoute}/index.html`, renderedHtml)
}

// Wait for all posts to be rendered

await Promise.all(postList.map(async (post) => await renderPost(post)))

if (options.watch) {
  await copyFile('./dist/inject-scripts/live-reload.js', './_site/assets/live-reload.js')
}
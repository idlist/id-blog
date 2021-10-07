import { readFile, writeFile, copyFile } from 'fs/promises'
import { readdir, access, mkdir, rm, cp } from 'fs/promises'
import { cwd, argv, exit } from 'process'
import { extname } from 'path'
import { createHash } from 'crypto'

import yaml from 'js-yaml'
import markdownIt from 'markdown-it'
import markdownItAnchor from 'markdown-it-anchor'
import markdownItAttrs from 'markdown-it-attrs'
import { slugify } from 'transliteration'
import prism from 'prismjs'
import prismLangs from 'prismjs/components/index.js'
import jsBeautify from 'js-beautify'
import HTMLparser from 'node-html-parser'

import type { RawPostMeta, PostMeta, MetaCategory, Meta } from '../.data-types.js'
import type { Layout, TOCNode } from '../.data-types.js'

import config, { TConfig } from '../config.js'
import { noop, filename } from './utils.js'
import c from './colors.js'

// Import Configurations

const metaDelimiter = config.blog.metaDelimiter + '\r\n'
const dir: TConfig['blog'] = {
  ...config.blog,
  layouts: `${config.dist}/${config.blog.layouts}`,
  js: `${config.dist}/${config.blog.js}`
}
const routes: TConfig['routes'] = { ...config.routes }
for (const property in routes) {
  routes[property] = `${dir.output}/${routes[property]}`
}

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

let AllMetaCache: Record<string, PostMeta> = {}
let postList: string[] = []
let layoutList: string[] = []

// Prepare markdown factory

prismLangs(['sass'])

const md: markdownIt = markdownIt({
  html: true,
  highlight: (content, lang) => {
    content = content.trimEnd()

    if (lang && lang in prism.languages) {
      try {
        return prism.highlight(content, prism.languages[lang], 'js')
      } catch { noop() }
    }

    return md.utils.escapeHtml(content)
  }
})

md.use(markdownItAnchor, { slugify: s => slugify(s, { fixChineseSpacing: false }) })
md.use(markdownItAttrs)

const beautify = jsBeautify.html

// Prepare folders and files

try {
  await access(dir.cache)
  if (options.rebuild) {
    await rm(dir.cache, { recursive: true })
    await mkdir(dir.cache)
  }
} catch {
  await mkdir(dir.cache)
}

try {
  await rm(dir.output, { recursive: true })
} catch { noop() }
await mkdir(dir.output)
for (const route of Object.values(routes)) {
  await mkdir(route, { recursive: true })
}

try {
  AllMetaCache = JSON.parse(await readFile(`${dir.cache}/meta.json`, 'utf-8'))
} catch { noop() }

// Read file lists

try {
  postList = await readdir(dir.posts)
} catch {
  console.error(`${c.red('[E]')} Cannot found directory for posts: ${dir.posts}, aborted.`)
  exit(1)
}

try {
  layoutList = await readdir(dir.layouts)
} catch {
  console.error(`${c.red('[E]')} Cannot found directory for transpiled layouts: ${dir.layouts}, aborted.`)
  exit(1)
}

// Load layouts

const importLayout = async (layoutFilename: string) => {
  if (!(extname(layoutFilename) == '.js')) return
  const layoutPath = `file://${cwd()}/${dir.layouts}/${layoutFilename}`
  const layout = (await import(layoutPath)).default as Layout
  const layoutName = filename(layoutFilename)
  Layouts[layoutName] = layout
}

// Copy files

const injectLiveReloadScript = async () => {
  if (options.watch) {
    await copyFile('./dist/inject-scripts/live-reload.js', './_site/assets/live-reload.js')
  }
}

const copyAssets = async () => {
  const copyCssAssets = async (file: string) => {
    if (extname(file) == '.css') {
      await copyFile(`${dir.layouts}/${file}`, `${routes.assets}/${file}`)
    }
  }

  const copyPublicAssets = async () => {
    try {
      await cp(dir.public, routes.public, { recursive: true })
    } catch { noop() }
  }

  const copyJsAssets = async () => {
    try {
      await cp(dir.js, routes.js, { recursive: true })
    } catch { noop() }
  }

  await Promise.all([
    ...layoutList.map(async (file) => { await copyCssAssets(file) }),
    copyPublicAssets(),
    copyJsAssets()
  ])
}

/**
 * Process posts in an asynchronous way.
 * @param post Filename of the post, with extension.
 */
const processPosts = async (post: string) => {
  const content = await readFile(`${dir.posts}/${post}`, 'utf-8')
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

  // Parse markdown to HTML

  const article = content.slice(metaSection + metaDelimiter.length)
  const parsedArticle = md.render(article)

  // Extract table of contents from parsed HTML

  const tocTree: TOCNode[] = []

  const document = HTMLparser.parse(parsedArticle)
  const headers = ['h2', 'h3', 'h4']

  const headerElements = document.querySelectorAll(headers.join(','))
  for (const h of headerElements) {
    const level = parseInt((h.tagName[1]))
    const id = h.getAttribute('id') ?? ''
    const text = h.innerHTML
    tocTree.push({ level, id, text })
  }

  // Write HTML cache

  await writeFile(`${dir.cache}/${postName}.html`, parsedArticle)
  console.log(`${c.blue('[I]')} Cache built for ${c.green(post)}.`)

  // Summarize metadata

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
      : [],
    toc: tocTree
  }

  // Categorize metadata

  if (Object.values(AllMeta).find(existedMeta => existedMeta.route == meta.route)) {
    console.warn(`${c.yellow('[W]')} Metadata of post ${c.green(post)} ` +
      'has dupicated route with previous posts, skipped.')
    return
  }
  AllMeta[postName] = meta
  categorizeMeta(meta)
}

// Wait for all asynchronous methods to finish

await Promise.all([
  // Import all layouts
  ...layoutList.map(async (layoutFilename) => await importLayout(layoutFilename)),
  // Extract metadata and cache all posts
  ...postList.map(async (post) => await processPosts(post)),
  // Copy client-side live-reload script in development mode
  injectLiveReloadScript(),
  // Copy assets to blog directory
  copyAssets()
])

// Write metadata cache

await writeFile(`${dir.cache}/meta.json`, JSON.stringify(AllMeta))

/**
 * Render the posts
 * @param post Filename of the post, with extension.
 */
const renderPost = async (post: string) => {
  const postName = filename(post)
  const postHtml = await readFile(`${dir.cache}/${postName}.html`, 'utf-8')
  const postRoute = `${routes.posts}/${AllMeta[postName].route}`

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

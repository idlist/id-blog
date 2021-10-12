import { readFile, writeFile, copyFile } from 'fs/promises'
import { readdir, access, mkdir, rm, cp } from 'fs/promises'
import { cwd, argv, exit } from 'process'
import { platform } from 'os'
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
import cheerio from 'cheerio'
import html from 'outdent'

import { Lang, TLang, DefaultLang } from '../data-types.js'
import type { RawPostMeta, PostMeta } from '../data-types.js'
import type { TAllCategory, TCategory, Meta, TLangMeta, TAllMeta } from '../data-types.js'
import type { Layout, TOCNode, DefaultProps } from '../data-types.js'

import config, { TConfig } from '../config.js'
import { noop, filename } from './utils.js'
import c from './colors.js'

// Import Configurations

const metaDelimiter = config.blog.metaDelimiter + (platform() == 'win32' ? '\r\n' : '\n')
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

const AllMeta: TAllMeta = {}
const AllCategory: TAllCategory = {}
const Layouts: Record<string, Layout> = {}

let AllMetaCache: TAllMeta = {}
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

md.use(markdownItAttrs)
md.use(markdownItAnchor, {
  slugify: s => slugify(s, { fixChineseSpacing: false }),
  tabIndex: false
})

const beautify = jsBeautify.html

// Prepare folders and files

try {
  await access(dir.cache)
  if (options.rebuild) {
    await rm(dir.cache, { recursive: true })
    await mkdir(dir.cache, { recursive: true })
  }
} catch {
  await mkdir(dir.cache, { recursive: true })
}

try {
  await rm(dir.output, { recursive: true })
} catch { noop() }
await mkdir(dir.output, { recursive: true })

for (const route of Object.values(routes)) {
  await mkdir(route, { recursive: true })
}

await Promise.all(Lang.map(async (lang) => {
  if (lang == DefaultLang) return

  await mkdir(`${dir.output}/${lang}`)
  await Promise.all([
    await mkdir(`${dir.output}/${lang}/${config.routes.posts}`),
    await mkdir(`${dir.output}/${lang}/${config.routes.tags}`),
    await mkdir(`${dir.output}/${lang}/${config.routes.timeline}`)
  ])
}))

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

  const copyPostAssets = async () => {
    try {
      await cp(dir.postAssets, routes.postAssets, { recursive: true })
    } catch { noop() }
  }

  await Promise.all([
    ...layoutList.map(async (file) => { await copyCssAssets(file) }),
    copyPublicAssets(),
    copyJsAssets(),
    copyPostAssets()
  ])
}

/**
 * Process posts in an asynchronous way.
 * @param post Filename of the post, with extension.
 */
const processPosts = async (post: string) => {
  /**
   * Categorize Metadata
   */
  const categorizeMeta = (meta: PostMeta) => {
    if (!AllCategory[meta.lang]) {
      AllCategory[meta.lang] = {
        allTags: {},
        allDate: {}
      }
    }

    const category = AllCategory[meta.lang] as TCategory

    if (!category.allDate[meta.date.year]) {
      category.allDate[meta.date.year] = {}
    }
    if (!category.allDate[meta.date.year][meta.date.month]) {
      category.allDate[meta.date.year][meta.date.month] = []
    }
    category.allDate[meta.date.year][meta.date.month].push(meta.name)

    for (const tag of meta.tags) {
      if (!category.allTags[tag]) category.allTags[tag] = []
      category.allTags[tag].push(meta.name)
    }
  }

  // Read post files

  const content = await readFile(`${dir.posts}/${post}`, 'utf-8')
  const contentHash = createHash('md5').update(content).digest('hex')
  const postName = filename(post)

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

  // Get language of the post

  let postLang: TLang
  switch (rawMeta.lang?.toLowerCase()) {
    case 'j':
    case 'ja':
    case 'jp':
    case 'japanese':
      postLang = 'j'
      break
    case 'e':
    case 'en':
    case 'english':
      postLang = 'e'
      break
    default:
      postLang = DefaultLang
      break
  }

  // Read from cached metadata

  const metaCacle = AllMetaCache[postLang]

  if (metaCacle &&
    metaCacle[postName] &&
    metaCacle[postName].hash === contentHash &&
    !options.rebuild) {

    if (!AllMeta[postLang]) AllMeta[postLang] = {}
    const allMeta = AllMeta[postLang] as TLangMeta

    allMeta[postName] = { ...metaCacle[postName] }
    categorizeMeta(allMeta[postName])
    return
  }

  const wrongMeta: (keyof RawPostMeta)[] = []

  if (!rawMeta.title) wrongMeta.push('title')
  if (!rawMeta.date || !(rawMeta.date instanceof Date)) wrongMeta.push('date')
  if (!rawMeta.layout) wrongMeta.push('layout')
  if (wrongMeta.length) {
    console.warn(`${c.yellow('[W]')} Post ${c.green(post)} does not have or has wrong ` +
      `metadata: ${wrongMeta.map(str => c.blue(str)).join(', ')}. skipped.`)
    return
  }

  // See if the metadata post is duplicated
  // (Same route and language)

  const postRoute = rawMeta.route
    ? slugify(rawMeta.route, { fixChineseSpacing: true })
    : slugify(rawMeta.title, { fixChineseSpacing: true })

  if (Object.values(AllMeta[postLang] ?? {}).find(existedMeta => {
    return existedMeta.route == postRoute && existedMeta.lang == postLang
  })) {
    console.warn(`${c.yellow('[W]')} Metadata of post ${c.green(post)} ` +
      'has dupicated route with previous posts, skipped.')
    return
  }

  // Parse markdown to HTML

  const article = content.slice(metaSection + metaDelimiter.length)
  let parsedArticle = md.render(article)

  const $ = cheerio.load(parsedArticle)

  // Truncate summary

  let summary = $.text()
  if (summary.length > 192) summary = summary.slice(0, 192).trim() + ' ......'

  // Extract table of contents from parsed HTML

  const toc: TOCNode[] = []
  const headers = ['h1', 'h2', 'h3', 'h4']
  const level: number[] = []

  $(headers.join(', ')).each((_, header) => {
    const node = {
      level: parseInt(($(header).prop('tagName') as unknown as string)[1]),
      id: $(header).attr('id') ?? '',
      text: $(header).text()
    }

    toc.push(node)
    level.push(node.level)

    $(header).html(html`
    <a href="#${node.id}" aria-hidden="true">
      <img class="article-anchor" src="/${config.routes.public}/buttons/link.svg">
    </a>
    ${$(header).html()}
    `)
  })

  const parsedLevel: number[] = []
  for (let i = 0; i < level.length; i++) {
    if (!parsedLevel.length) {
      parsedLevel.push(level[i])
    } else if (level[i] == level[i - 1]) {
      parsedLevel.push(parsedLevel[i - 1])
    } else if (level[i] > level[i - 1]) {
      parsedLevel.push(parsedLevel[i - 1] + 1)
    } else if (level[i] < level[i - 1]) {
      let upmost = 0
      for (let j = 0; j < i; j++) {
        if (level[j] < level[i] && level[j] > level[upmost]) upmost = j
      }

      if (level[i] > level[upmost]) {
        parsedLevel.push(level[upmost] + 1)
      } else {
        parsedLevel.push(level[upmost])
      }
    }
  }

  const highestLevel = Math.min(...parsedLevel) - 1
  toc.forEach((node, i) => node.level = parsedLevel[i] - highestLevel)

  // Wrap tables around a wrapper element

  $('table').wrap(html`<div class="table-container"></div>`)

  // Add copy icon to code block

  const codeBlocks = $('pre code')
    .parent()
    .wrap(html`<div class="code-wrapper"></div>`)

  $(html`
  <div class="code-copy-success hidden">Copy Succeeded!</div>
  <div class="code-copy">
    <img class="code-copy-icon" alt="copy"
      src="/${config.routes.public}/buttons/copy.svg">
  </div>
  `).insertBefore(codeBlocks)

  // Write HTML cache

  parsedArticle = $.html()

  await writeFile(`${dir.cache}/${postName}.html`, parsedArticle)
  console.log(`${c.blue('[I]')} Cache built for ${c.green(post)}.`)

  // Process and summarize metadata

  const processTags = (tagString: string): string[] => {
    const tags = tagString.split(' ').map(tag => tag.toLowerCase())
    return [...new Set(tags)].sort()
  }

  const postDate = {
    year: rawMeta.date.getFullYear(),
    month: rawMeta.date.getMonth() + 1,
    day: rawMeta.date.getDate()
  }

  const lastUpdateDate = rawMeta.lastUpdate ? {
    year: rawMeta.lastUpdate.getFullYear(),
    month: rawMeta.lastUpdate.getMonth() + 1,
    day: rawMeta.lastUpdate.getDate()
  } : postDate

  const meta: PostMeta = {
    ...rawMeta,
    name: postName,
    hash: contentHash,
    lang: postLang,
    route: postRoute,
    date: postDate,
    lastUpdate: lastUpdateDate,
    timestamp: rawMeta.date.getTime(),
    tags: rawMeta.tags ? processTags(rawMeta.tags) : [],
    toc: toc,
    summary: summary
  }

  // Categorize metadata

  if (!AllMeta[postLang]) AllMeta[postLang] = {}
  const allLangMeta = AllMeta[postLang] as TLangMeta
  allLangMeta[postName] = meta
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

const renderLangPages = async (lang: TLang) => {
  if (!AllMeta[lang]) return

  const LangMeta = AllMeta[lang] as TLangMeta
  const LangMetaArray = Object.values(LangMeta).sort((a, b) => b.timestamp - a.timestamp)
  const LangCategory = AllCategory[lang] as TCategory
  const LangRoute = lang == DefaultLang ? '.' : lang

  /**
   * Render a webpage
   * @param meta
   */
  const renderPage = (meta: Partial<Meta>, props?: DefaultProps): string => {
    let currentMeta = {
      ...LangCategory,
      liveReload: options.watch,
      ...meta
    }

    let renderedHtml = (props?.content ?? '')
    let layoutName = currentMeta.layout as string
    let firstLayout = true

    do {
      if (!Layouts[layoutName]) {
        console.log(`${c.yellow('[W]')} layout ${layoutName} does not exist, skipped`)
        return ''
      }

      const currentLayout = Layouts[layoutName](currentMeta)
      if (firstLayout && currentLayout.unavailable) {
        console.log(`${c.yellow('[W]')} layout ${layoutName} should not be used directly, skipped`)
        return ''
      }

      renderedHtml = currentLayout.layout(currentMeta, {
        ...props,
        content: renderedHtml
      })
      layoutName = currentLayout.parentLayout ?? ''
      if (layoutName && currentLayout.parentMeta) {
        currentMeta = {
          ...currentMeta,
          ...currentLayout.parentMeta
        }
      }

      firstLayout = false
    } while (layoutName)

    renderedHtml = beautify(renderedHtml, {
      indent_size: 2,
      preserve_newlines: false
    })

    return renderedHtml
  }

  /**
   * Render the posts
   * @param meta Metadata of the post
   */
  const renderPost = async (meta: PostMeta, props?: DefaultProps) => {
    const postHtml = await readFile(`${dir.cache}/${meta.name}.html`, 'utf-8')
    const postRoute = `${dir.output}/${LangRoute}/${config.routes.posts}/${meta.route}`

    const renderedHtml = renderPage(meta, {
      ...props,
      content: postHtml
    })

    await mkdir(postRoute)
    await writeFile(`${postRoute}/index.html`, renderedHtml)
  }

  interface PaginationOption {
    i: number
    length: number
    route: string
    extraIndex?: string,
    props?: DefaultProps
  }

  /**
   * Render single page in a page list with pagination
   */
  const renderPagination = async (meta: Partial<Meta>, options: PaginationOption) => {
    const renderedHtml = renderPage({
      ...meta,
      postNumber: meta.allMeta?.length ?? 0,
      pagination: {
        current: options.i,
        length: options.length
      },
      allMeta: meta.allMeta?.slice(config.postPerPage * (options.i - 1), config.postPerPage * options.i) ?? []
    }, options.props)

    await mkdir(`${options.route}/${options.i}`, { recursive: true })
    await writeFile(`${options.route}/${options.i}/index.html`, renderedHtml)
    if (options.extraIndex && options.i == 1) {
      await writeFile(`${options.route}/${options.extraIndex}/index.html`, renderedHtml)
    }
  }

  const renderHomepage = async () => {
    const pageNumber = Math.ceil(LangMetaArray.length / config.postPerPage)

    const pageIndex: number[] = []
    for (let i = 1; i <= pageNumber; i++) pageIndex.push(i)

    await Promise.all(pageIndex.map(async (i) => {
      await renderPagination({
        title: html`i'D Blog - Reinventing the Wheel`,
        layout: 'homepage',
        allMeta: LangMetaArray
      }, {
        i: i,
        length: pageNumber,
        route: `${dir.output}/${LangRoute}/${config.routes.page}`,
        extraIndex: '..'
      })
    }))
  }

  const renderTags = async () => {
    const renderSingleTag = async (tag: string) => {
      const postWithTag = LangCategory.allTags[tag]
      const allMetaWithTag = postWithTag.map(postName => LangMeta[postName])
      const pageNumber = Math.ceil(allMetaWithTag.length / config.postPerPage)

      const pageIndex: number[] = []
      for (let i = 1; i <= pageNumber; i++) pageIndex.push(i)

      await Promise.all(pageIndex.map(async (i) => {
        await renderPagination({
          title: html`Tag: ${tag} | i'D Blog`,
          layout: 'category',
          allMeta: allMetaWithTag
        }, {
          i: i,
          length: pageNumber,
          route: `${dir.output}/${LangRoute}/${config.routes.tags}/${tag}`,
          extraIndex: '.',
          props: {
            type: 'Tags: ',
            category: tag.replace('_', ' '),
            route: `${config.routes.tags}/${tag}`
          }
        })
      }))
    }

    await Promise.all(Object.keys(LangCategory.allTags).map(async (tag) => {
      await mkdir(`${routes.tags}/${tag}`, { recursive: true })
      await renderSingleTag(tag)
    }))
  }

  const renderTimeline = async () => {
    const renderSingleTimeline = async (year: number, month: number) => {
      const postWithTime = LangCategory.allDate[year][month]
      const allMetaWithTime = postWithTime.map(postName => LangMeta[postName])
      const pageNumber = Math.ceil(allMetaWithTime.length / config.postPerPage)

      const pageIndex: number[] = []
      for (let i = 1; i <= pageNumber; i++) pageIndex.push(i)

      await Promise.all(pageIndex.map(async (i) => {
        await renderPagination({
          title: html`Timeline: ${year} / ${month} | i'D Blog`,
          layout: 'category',
          allMeta: allMetaWithTime
        }, {
          i: i,
          length: pageNumber,
          route: `${dir.output}/${LangRoute}/${config.routes.timeline}//${year}-${month}`,
          extraIndex: '.',
          props: {
            type: 'Timeline: ',
            category: `${year} / ${month}`,
            route: `${config.routes.timeline}/${year}-${month}`
          }
        })
      }))
    }

    await Promise.all(Object.entries(LangCategory.allDate).map(async ([year, allMonths]) => {
      await Promise.all(Object.keys(allMonths).map(async (month) => {
        await mkdir(`${routes.timeline}/${year}-${month}`, { recursive: true })
        await renderSingleTimeline(parseInt(year), parseInt(month))
      }))
    }))
  }

  // Wait for all pages to be rendered

  await Promise.all([
    ...Object.values(LangMeta).map(async (meta) => await renderPost(meta)),
    renderHomepage(),
    renderTags(),
    renderTimeline()
  ])
}

await Promise.all(Lang.map(async (lang) => await renderLangPages(lang)))
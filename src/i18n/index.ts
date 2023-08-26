import type { Lang, LangCode, I18nBranch, I18nNode, I18nTree } from './types'
import { ui } from '@/locales/ui'

export type { I18nBranch } from './types'

declare module '@/i18n/types' {
  interface Lang {
    zh: string
    en: string
    ja: string
  }
}

const lang: Lang = {
  zh: '简体中文',
  en: 'English',
  ja: '日本語',
}

const defaultLang: LangCode = 'zh'

const branches: I18nBranch[] = [
  ui,
]

const tree: I18nTree = {
  zh: {},
  en: {},
  ja: {},
}

const parseNode = (code: LangCode, node: I18nNode, level: string[]) => {
  if (typeof node === 'string') {
    const path = level.join('.')
    tree[code][path] = node
  } else {
    for (const [key, next] of Object.entries(node)) {
      parseNode(code, next, [...level, key])
    }
  }
}

const parseBranch = (branch: I18nBranch) => {
  for (const [code, node] of Object.entries(branch)) {
    if (code in lang) {
      parseNode(code as LangCode, node, [])
    }
  }
}

for (const branch of branches) {
  parseBranch(branch)
}

export const getLangCode = (url: URL) => {
  const [, segment] = url.pathname.split('/')
  return segment in lang ? (segment as LangCode) : defaultLang
}

interface UseLangShape {
  (code: LangCode): (path: string) => string
  (url: URL): (path: string) => string
}

export const useLang = ((codeOrUrl: LangCode | URL) => {
  let code: LangCode

  if (codeOrUrl instanceof URL) {
    const url = codeOrUrl
    code = getLangCode(url)
  } else {
    code = codeOrUrl
  }

  const collection = tree[code]
  const fallback = tree[defaultLang]

  const t = (path: string): string => {
    if (path in collection) {
      return collection[path]
    } else if (path in fallback) {
      console.log(`path doesn't exists in i18n dictionary of language code ${code}: ${path}.`)
      return fallback[path]
    } else {
      console.log(`path doesn't exists in all i18n dictionaries: ${path}.`)
      return ''
    }
  }

  return t
}) as UseLangShape

export const getRoot = (code: LangCode) => {
  return code == defaultLang ? '/' : `/${code}/`
}

export const mapRoute = (
  name: string = 'lang',
  params: Record<string, string | undefined> = {},
) => {
  return Object.keys(lang).map((code) => {
    const path = code === defaultLang ? undefined : code
    return { params: { [name]: path, ...params } }
  })
}
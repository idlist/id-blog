import type { Lang, LangCode, I18nBranch, I18nNode, I18nLeaf, I18nTree } from './types'
import { ui } from '@/locales/ui'
import { article } from '@/locales/article'

export { default as html } from 'dedent'
export type { I18nBranch, I18nLeaf, LangCode } from './types'

declare module '@/i18n/types' {
  interface Lang {
    zh: string
    en: string
    ja: string
  }
}

export const lang: Lang = {
  zh: '简体中文',
  en: 'English',
  ja: '日本語',
}

export const defaultLang: LangCode = 'zh'

const branches: Record<string, I18nBranch> = {
  ui,
  a: article,
}

const tree: I18nTree = {
  zh: {},
  en: {},
  ja: {},
}

const parseNode = (code: LangCode, node: I18nNode, level: string[]) => {
  if (typeof node === 'string' || typeof node === 'function') {
    const path = level.join('.')
    tree[code][path] = node
  } else {
    for (const [key, next] of Object.entries(node)) {
      parseNode(code, next, [...level, key])
    }
  }
}

const parseBranch = (scope: string, branch: I18nBranch) => {
  for (const [code, node] of Object.entries(branch)) {
    if (code in lang) {
      parseNode(code as LangCode, node, scope == 'index' ? [] : [scope])
    }
  }
}

for (const [scope, branch] of Object.entries(branches)) {
  parseBranch(scope, branch)
}

export const getLangCode = (url: URL) => {
  const [, segment] = url.pathname.split('/')
  return segment in lang ? (segment as LangCode) : defaultLang
}

export const undef = <T>(value: T, ifValue: T, elseValue: T | string = value) => {
  return value === ifValue ? undefined : elseValue
}

export const langParam = (code: LangCode) => {
  return code === defaultLang ? undefined : code
}

export const getRoot = (codeOrUrl: LangCode | URL) => {
  let code: LangCode

  if (codeOrUrl instanceof URL) {
    code = getLangCode(codeOrUrl)
  } else {
    code = codeOrUrl
  }

  return code == defaultLang ? '/' : `/${code}/`
}

type UseTemplate = (path: string, ...interp: unknown[]) => string

interface UseLangShape {
  (code: LangCode): UseTemplate
  (url: URL): UseTemplate
}

export const useLang: UseLangShape = (codeOrUrl: LangCode | URL) => {
  let code: LangCode

  if (codeOrUrl instanceof URL) {
    const url = codeOrUrl
    code = getLangCode(url)
  } else {
    code = codeOrUrl
  }

  const collection = tree[code]
  const fallback = tree[defaultLang]

  const t: UseTemplate = (path, ...interp) => {
    let content: I18nLeaf

    if (path in collection) {
      content = collection[path]
    } else if (path in fallback) {
      console.log(`path doesn't exists in i18n dictionary of language code ${code}: ${path}.`)
      content = fallback[path]
    } else {
      console.log(`path doesn't exists in all i18n dictionaries: ${path}.`)
      content = ''
    }

    let parsed: string

    if (typeof content === 'function') {
      parsed = content(...interp)
    } else {
      parsed = content
      let find: number = 0

      for (let i = 0; i < interp.length; i++) {
        find = parsed.search('{}')
        if (find == -1) {
          break
        }
        parsed = parsed.replace('{}', interp[i] as string)
      }
    }

    return parsed
  }

  return t
}

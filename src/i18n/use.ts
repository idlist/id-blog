import { lang, defaultLang } from './lang'
import type { LangCode, I18nBranch, I18nNode, I18nTree } from './lang'
import { ui } from './content/ui'

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
  const segments = url.pathname.split('/')
  console.log(segments)
}

export const useLang = (code: LangCode) => {
  const collection = tree[code]
  const fallback = tree[defaultLang]

  const t = (path: string): string => {
    if (path in collection) {
      return collection[path]
    } else if (path in fallback) {
      return fallback[path]
    } else {
      console.log(`path doesn't exists in i18n dictionary: ${path}.`)
      return ''
    }
  }

  return t
}

export const mapRoute = (
  name: string = 'lang',
  params: Record<string, string | undefined> = {},
) => {
  return Object.keys(lang).map((code) => {
    return { params: { [name]: code === defaultLang ? undefined : code, ...params } }
  })
}
/* eslint-disable no-unused-vars */

import { TLang, Lang, DefaultLang } from '../data-types.js'
import i18n from '../i18n.js'

type I18nString = {
  [lang in TLang]: string
}

interface I18nData {
  [property: string]: I18nString
}

export const getLang = (lang?: string): TLang => {
  return Lang.includes(lang as TLang) ? lang as TLang : DefaultLang
}

export default class LanguageTemplate {
  lang: TLang
  root: string

  constructor(lang: string | undefined) {
    this.lang = getLang(lang)
    this.root = this.lang == DefaultLang ? '' : `/${this.lang}`
  }

  use(data: string, ...nested: string[]): string {
    const template = i18n[data][this.lang]
    if (!template) return ''

    const tokens = template.split('{}')
    let result = ''
    for (let i = 0; i < tokens.length; i++) {
      result += tokens[i] + (nested[i] ?? '')
    }
    return result
  }
}

export type { I18nData }
export interface Lang {
  zh: string
  en: string
  ja: string
}

export const lang: Lang = {
  zh: '简体中文',
  en: 'English',
  ja: '日本語',
}

export type LangCode = keyof Lang

export const defaultLang: LangCode = 'zh'

export type I18nDict = { [key: string]: I18nNode }

export type I18nNode = string | I18nDict

type I18nRoot = Record<string, I18nNode>

export type I18nBranch = Partial<Record<LangCode, I18nRoot>>

export type I18nTree = Record<LangCode, Record<string, string>>
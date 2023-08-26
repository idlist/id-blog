export interface Lang {}

export type LangCode = keyof Lang

export type I18nDict = { [key: string]: I18nNode }

export type I18nNode = string | I18nDict

type I18nRoot = Record<string, I18nNode>

export type I18nBranch = Partial<Record<LangCode, I18nRoot>>

export type I18nTree = Record<LangCode, Record<string, string>>
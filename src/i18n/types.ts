export interface Lang {}

export type LangCode = keyof Lang

export type I18nRender = <T extends unknown[]>(...args: T) => string

export type I18nDict = { [key: string]: I18nNode }

export type I18nLeaf = string | I18nRender

export type I18nNode = I18nLeaf | I18nDict

type I18nRoot = Record<string, I18nNode>

export type I18nBranch = Partial<Record<LangCode, I18nRoot>>

export type I18nTree = Record<LangCode, Record<string, I18nLeaf>>

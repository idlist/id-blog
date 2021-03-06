/* eslint-disable no-unused-vars */

interface RequiredMeta {
  title: string
  layout: string
}

export const Lang = ['c', 'j', 'e'] as const

export const DefaultLang = 'c'

export type TLang = typeof Lang[number]

export interface RawPostMeta extends RequiredMeta {
  date: Date
  lastUpdate?: Date
  lang?: string
  route?: string
  tags?: string
}

type ProcessedPostMeta = 'tags' | 'date' | 'lastUpdate'

export interface TOCNode {
  text: string
  id: string
  level: number
}

export interface PostDate {
  year: number
  month: number
  day: number
}

export interface PostMeta extends Omit<RawPostMeta, ProcessedPostMeta> {
  name: string
  hash: string
  lang: TLang
  route: string
  date: PostDate
  lastUpdate: PostDate
  timestamp: number
  tags: string[]
  toc: TOCNode[]
  summary: string
}

export type TLangMeta = Record<string, PostMeta>

export type TAllMeta = {
  [lang in TLang]?: TLangMeta
}

export interface TCategory {
  allTags: Record<string, string[]>
  allDate: Record<string, Record<string, string[]>>
}

export type TAllCategory = {
  [lang in TLang]?: TCategory
}

interface InheritMeta {
  liveReload: boolean
  allMeta?: PostMeta[]
  postNumber?: number
  pagination?: {
    current: number
    length: number
  }
  head?: string
  scripts?: string[]
}

export type Meta = Partial<PostMeta> & InheritMeta & TCategory

export interface DefaultProps {
  [property: string]: unknown
  lang?: TLang
  content?: string
}

interface LayoutOutput<T> {
  layout: (meta: Meta, props?: T & DefaultProps) => string
  unavailable?: boolean
  parentMeta?: Partial<Meta>
  parentLayout?: string
}

export type Layout<T = Record<string, unknown>> = (meta?: Meta) => LayoutOutput<T>

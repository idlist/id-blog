/* eslint-disable no-unused-vars */

interface RequiredMeta {
  title: string
  layout: string
}

export const PostLang = ['c', 'j', 'e'] as const

export type TPostLang = typeof PostLang[number]

export interface RawPostMeta extends RequiredMeta {
  date: Date
  lastUpdate?: Date
  lang?:  string
  route?: string
  tags?: string
}

type ProcessedPostMeta = 'tags' | 'date' | 'lastUpdate'

export interface TOCNode {
  text: string
  id: string
  level: number
}

interface PostDate {
  year: number
  month: number
  day: number
}

export interface PostMeta extends Omit<RawPostMeta, ProcessedPostMeta> {
  name: string
  hash: string
  lang: TPostLang
  route: string
  date: PostDate
  lastUpdate: PostDate
  timestamp: number
  tags: string[]
  toc: TOCNode[]
  summary: string
}

export interface CategoryType {
  allTags: Record<string, string[]>
  allDate: Record<string, Record<string, string[]>>
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

export type Meta = Partial<PostMeta> & InheritMeta & CategoryType

export interface DefaultProps {
  [property: string]: unknown
  content?: string
}

interface LayoutOutput<T> {
  layout: (meta: Meta, props?: T & DefaultProps) => string
  unavailable?: boolean
  parentMeta?: Partial<Meta>
  parentLayout?: string
}

export type Layout<T = Record<string, unknown>> = (meta?: Meta) => LayoutOutput<T>

/* eslint-disable no-unused-vars */

interface RequiredMeta {
  title: string
  layout: string
}

export interface RawPostMeta extends RequiredMeta {
  date: Date
  route?: string
  tags?: string
}

type ProcessedPostMeta = 'tags' | 'date'

export interface TOCNode {
  text: string
  id: string
  level: number
}

export interface PostMeta extends Omit<RawPostMeta, ProcessedPostMeta> {
  name: string
  hash: string
  route: string
  date: {
    year: number
    month: number
    day: number
  }
  timestamp: number
  tags: string[]
  toc: TOCNode[]
  summary: string
}

export interface MetaCategory {
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

export type Meta = Partial<PostMeta> & InheritMeta & MetaCategory

export interface DefaultProps {
  [property: string]: unknown
  content?: string
}

interface LayoutOutput<T> {
  layout: (meta: Meta, props: T & DefaultProps) => string
  unavailable?: boolean
  parentMeta?: Meta
  parentLayout?: string
}

export type Layout<T = Record<string, unknown>> = (meta?: Meta) => LayoutOutput<T>

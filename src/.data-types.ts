export interface RawPostMeta {
  title: string
  route?: string
  date: Date
  tags?: string
  layout: string
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
  allMeta: PostMeta[]
  postNumber?: number
  pagination?: {
    current: number
    length: number
  }
  head?: string
  scripts?: string[]
  liveReload: boolean
}

type LayoutMeta = InheritMeta & PostMeta

export type Meta = LayoutMeta & MetaCategory

interface LayoutOutput<T> {
  layout: (meta: Partial<Meta>, props: T) => string
  unavailable?: boolean
  parentMeta?: Partial<Meta>
  parentLayout?: string
}

export type Layout<T = any> = (meta?: Partial<Meta>) => LayoutOutput<T>

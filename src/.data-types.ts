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
}

export interface MetaCategory {
  allTags: Record<string, string[]>
  allDate: Record<string, Record<string, string[]>>
}

interface InheritMeta {
  allMeta: PostMeta[]
  head?: string
  scripts?: string[]
  liveReload: boolean
}

type LayoutMeta = InheritMeta & PostMeta

export type Meta = LayoutMeta & MetaCategory

interface LayoutOutput {
  layout: (meta?: Partial<Meta>, content?: string) => string
  unavailable?: boolean
  parentMeta?: Partial<Meta>
  parentLayout?: string
}

export type Layout = (meta?: Partial<Meta>) => LayoutOutput

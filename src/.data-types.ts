export interface RawPostMeta {
  title: string
  route?: string
  date: Date
  tags?: string
  layout: string
}

type ProcessedPostMeta = 'tags' | 'date'

export interface PostMeta extends Omit<RawPostMeta, ProcessedPostMeta> {
  hash: string
  route: string
  date: {
    year: number
    month: number
    day: number
  }
  timestamp: number
  tags: string[]
}

export interface MetaCategory {
  allTags: Record<string, string[]>
  allDate: Record<string, Record<string, string[]>>
}

export interface LayoutMeta extends PostMeta {
  head: string
}

export type Meta = LayoutMeta & MetaCategory

interface LayoutOutput {
  layout: (meta: Meta, content: string) => string
  unavailable?: boolean
  parentMeta?: Meta
  parentLayout?: string
}

export type Layout = (meta: Meta) => LayoutOutput
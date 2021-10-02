export interface RawPostMeta {
  title: string
  route?: string
  date: Date
  tags?: string
}

type ProcessedPostMeta = 'tags' | 'date'

export interface PostMeta extends Omit<RawPostMeta, ProcessedPostMeta> {
  filename: string
  route: string
  date: {
    year: number
    month: number
    day: number
  }
  tags: string[]
}

export interface MetaCategory {
  tags: Record<string, string[]>
  date: Record<string, Record<string, string[]>>
}

export interface LayoutMeta extends PostMeta {
  head: string
  body: string
}

export interface Layout {
  layout: (meta: LayoutMeta, category: MetaCategory) => string
  parentLayout?: string
  unavailable?: boolean
}
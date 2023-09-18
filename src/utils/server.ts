import { slugify } from 'transliteration'
import { padStart as pad } from 'lodash-es'
import TagMap from './tag-map'

export const tagify = (str: string) => {
  const lower = str.toLowerCase()
  const slug = TagMap[lower]
  if (slug) {
    return slug
  }

  return slugify(lower, {
    allowedChars: 'a-zA-Z0-9-',
    fixChineseSpacing: false,
  })
}

interface YearMonthDay {
  year: number
  month: number
  day: number
}

export const ymd = (date: Date): YearMonthDay => {
  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
  }
}

export const ymdFormat = (date: Date) => {
  const d = ymd(date)
  return `${d.year} / ${d.month} / ${d.day}`
}

export const ymKey = (year: string | number, month: string | number) => {
  return `${pad(`${year}`, 4, '0')}-${pad(`${month}`, 2, '0')}`
}

export interface Paging {
  current: number
  prev: number
  next: number
  last: number
}

export const pageSize = 15

export const paginate = <T>(collection: T[], page: number) => {
  return collection.slice((page - 1) * pageSize, page * pageSize)
}

export const createPaging = (page: number, count: number): Paging => {
  return {
    current: page,
    prev: page - 1 < 1 ? 1 : page - 1,
    next: page + 1 > count ? count : page + 1,
    last: count,
  }
}

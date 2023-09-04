import { slugify as slug } from 'transliteration'

export const slugify = (str: string) => slug(str, {
  allowedChars: 'a-zA-Z0-9-',
  fixChineseSpacing: false,
})

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

export interface Paging {
  current: number
  prev: number
  next: number
  last: number
}

export const createPaging = (page: number, count: number): Paging => {
  return {
    current: page,
    prev: page - 1 < 1 ? 1 : page - 1,
    next: page + 1 > count ? count : page + 1,
    last: count,
  }
}
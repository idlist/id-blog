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

export const range = (i: number) => Array.from({ length: i }).map((_, idx) => idx + 1)

import type { LangCode } from '@/i18n'

export const defaultLang: LangCode = 'zh'

export const ones = <T>(length: number, value: T) => {
  return Array.from<T>({ length }).map(() => structuredClone(value))
}

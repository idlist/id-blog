/* eslint-disable no-unused-vars */

import type { TLang } from '../data-types'

type I18nString = {
  [lang in TLang]: string
}

interface I18nData {
  [property: string]: I18nString
}

export type { I18nData }
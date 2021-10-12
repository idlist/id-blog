/* eslint-disable no-unused-vars */

import type { TLang } from '../data-types'

type I18nString = {
  [lang in TLang]: string
}

interface I18nData {
  [property: string]: I18nString
}

const i18n: I18nData = {
  totalPosts: {
    c: '共有 {} 篇文章。',
    j: '総計 {} 編の文章。',
    e: 'There are {} articles in total.'
  },
  seeSourceCodeOuter: {
    c: '查看这个博客的 {}',
    j: 'このブログの {} をチェックする',
    e: 'See the {} of this blog'
  },
  seeSourceCodeInner: {
    c: '源码',
    j: 'ソースコード',
    e: 'Source Code'
  },
  backToTop: {
    c: '回到顶部',
    j: 'トップに戻る',
    e: 'Back to Top'
  }
}

export default i18n
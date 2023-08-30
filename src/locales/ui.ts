import type { I18nBranch, I18nLeaf } from '@/i18n'

export const ui: I18nBranch = {
  zh: {
    articles: '文章',
    language: '语言',
    'to-index': '个人页',
    'total-posts': ((number: number) => {
      switch (number) {
        case 0:
          return '没有文章。'
        default:
          return `共有 ${number} 篇文章。`
      }
    }) as I18nLeaf,
    'no-posts-in-lang': '暂时没有这个语言的文章。',
    'no-tags': '没有标签',
    'no-timeline': '没有时间线',
    'no-toc': '没有目录',
    'see-source-code-outer': '查看这个博客的 {}',
    'see-source-code-inner': '源码',
    'back-to-top': '回到顶部',
  },
  en: {
    articles: 'Articles',
    language: 'Language',
    'to-index': 'Homepage',
    'total-posts': ((number: number) => {
      switch (number) {
        case 0:
          return 'No articles.'
        case 1:
          return 'There is 1 article in total.'
        default:
          return `There are ${number} articles in total.`
      }
    }) as I18nLeaf,
    'no-posts-in-lang': 'There are no articles in this language now.',
    'no-tags': 'No tags',
    'no-timeline': 'No timeline',
    'no-toc': 'No table of contents',
    'see-source-code-outer': 'See the {} of this blog',
    'see-source-code-inner': 'source code',
    'back-to-top': 'Back To Top',
  },
  ja: {
    articles: '記事',
    language: '言語',
    'to-index': '個人ページ',
    'total-posts': ((number: number) => {
      switch (number) {
        case 0:
          return `総計 ${number} 編の記事です。`
        default:
          return '記事がありません。'
      }
    }) as I18nLeaf,
    'no-posts-in-lang': 'この言語で書いた記事がまたありません。',
    'no-tags': 'タグがありません',
    'no-timeline': 'タイムラインがありません',
    'no-toc': '目次がありません',
    'see-source-code-outer': 'このブログの {} を見る',
    'see-source-code-inner': 'ソースコード',
    'back-to-top': 'トップに戻る',
  },
}

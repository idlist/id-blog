import { html } from '@/i18n'
import type { I18nBranch, I18nLeaf } from '@/i18n'

export const ui: I18nBranch = {
  zh: {
    'articles': '文章',
    'language': '语言',
    'to-index': '个人页',
    'total-posts': ((number: number) => {
      switch (number) {
        case 0:
          return '没有文章。'
        default:
          return html`共有 <b>${number}</b> 篇文章。`
      }
    }) as I18nLeaf,
    'check-source-code': () => html`
      查看这个博客的
      <a
        class="homepage-source__link"
        href="https://github.com/idlist/id-blog"
        target="_blank"
        rel="noopener noreferer"
      >GitHub 仓库</a>
    `,
    'no-posts-in-lang': '暂时没有这个语言的文章。',
    'no-tags': '没有标签',
    'no-timeline': '没有时间线',
    'no-toc': '没有目录',
    'back-to-top': '回到顶部',
  },
  en: {
    'articles': 'Articles',
    'language': 'Language',
    'to-index': 'Homepage',
    'total-posts': ((number: number) => {
      switch (number) {
        case 0:
          return 'No articles.'
        case 1:
          return html`There is <b>1</b> article in total.`
        default:
          return html`There are <b>${number}</b> articles in total.`
      }
    }) as I18nLeaf,
    'check-source-code': () => html`
      Check this blog at
      <a
        class="homepage-source__link"
        href="https://github.com/idlist/id-blog"
        target="_blank"
        rel="noopener noreferer"
      >GitHub</a>
    `,
    'no-posts-in-lang': 'There are no articles in this language right now.',
    'no-tags': 'No tags',
    'no-timeline': 'No timeline',
    'no-toc': 'No table of contents',
    'back-to-top': 'Back To Top',
  },
  ja: {
    'articles': '記事',
    'language': '言語',
    'to-index': '個人ページ',
    'total-posts': ((number: number) => {
      switch (number) {
        case 0:
          return '記事がありません。'
        default:
          return `総計 ${number} 編の記事です。`
      }
    }) as I18nLeaf,
    'check-source-code': () => html`
      このブログを
      <a
        class="homepage-source__link"
        href="https://github.com/idlist/id-blog"
        target="_blank"
        rel="noopener noreferer"
      >GitHub</a>
      で見る
    `,
    'no-posts-in-lang': 'この言語で書いた記事がまたありません。',
    'no-tags': 'タグがありません',
    'no-timeline': 'タイムラインがありません',
    'no-toc': '目次がありません',
    'back-to-top': 'トップに戻る',
  },
}

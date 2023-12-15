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
    'share-article': '分享这篇文章',
    'share-article-succeed': '链接已复制至剪贴板。',
    'word-count': '约 {} 字',
    'code-copied': '已复制！',
    'back-to-top': '回到顶部',
    'last-update': '最近更新：',
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
    'share-article': 'Share this article',
    'share-article-succeed': 'Link copied to the clipboard.',
    'word-count': ((number: number) => {
      switch (number) {
        case 0:
          return 'No words'
        case 1:
          return 'Approx. 1 word'
        case 2:
          return `Approx. ${number} words`
      }
    }) as I18nLeaf,
    'code-copied': 'Copied!',
    'back-to-top': 'Back To Top',
    'last-update': 'Last Update: ',
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
    'share-article': 'この記事をシェアします',
    'share-article-succeed': 'リンクがコピーされました。',
    'word-count': '约 {} 字',
    'code-copied': 'コピーしました！',
    'back-to-top': 'トップに戻る',
    'last-update': '最近のアップデート：',
  },
}

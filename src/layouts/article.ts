import html from 'outdent'

import { Layout } from '../.data-types.js'

const Article: Layout = meta => {
  return {
    layout: (meta, content) => html`
      <div>${meta.date.year}/${meta.date.month}/${meta.date.day}</div>
      <div>标签：${meta.tags.join(', ')}</div>
      <article>
        ${content}
      </article>
    `,
    parentLayout: 'base',
    parentMeta: {
      ...meta,
      title: html`${meta.title} | i'D Blog`,
      head: html`
      <link rel="stylesheet" type="text/css" href="assets/article.css">
      `
    }
  }
}

export default Article
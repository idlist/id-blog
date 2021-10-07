import html from 'outdent'

import { Layout } from '../.data-types.js'

const Article: Layout = meta => {
  return {
    layout: (meta, content) => html`
    <div class="article-container">
      <article>
        <h1 class="article-title">${meta.title}</h1>
        ${content}
      </article>
      <div class="article-information">
        <div>${meta.date.year}/${meta.date.month}/${meta.date.day}</div>
        <div>标签：${meta.tags.join(', ')}</div>
        <div class="article-toc">
          <div class="article-toc-title">Table of contents</div>
          ${meta.toc.map(h => html`<a href="#${h.id}" class="article-toc-l${h.level}">${h.text}</a>`).join('')}
        </div>
      </div>
    </div>
    `,
    parentLayout: 'base',
    parentMeta: {
      ...meta,
      title: html`${meta.title} | i'D Blog`,
      head: html`
      <link rel="stylesheet" type="text/css" href="/assets/article.css">
      `
    }
  }
}

export default Article
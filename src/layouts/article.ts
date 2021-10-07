import html from 'outdent'

import type { Layout } from '../.data-types.js'
import config from '../config.js'

const Article: Layout = meta => {
  return {
    layout: (meta, content) => html`
    <div class="article-container">
      <article>
        <h1 class="article-title">${meta.title}</h1>
        ${content}
      </article>
      <div class="article-information">
        <div class="article-time">
          <img class="article-time-icon" src="/${config.routes.public}/icon/time.svg">
          <span>${meta.date.year}/${meta.date.month}/${meta.date.day}</span>
        </div>
        <div class="article-tags">
          <img class="article-tags-icon" src="/${config.routes.public}/icon/tags.svg">
          ${meta.tags.map(tag => html`
          <a class="article-tags-tagname" href="/${config.routes.tags}/${tag}">${tag.replace('_', ' ')}</a>
          `).join('')}
        </div>
        <div class="article-toc">
          <div class="article-toc-title">Table of contents</div>
          ${meta.toc.map(h => html`
          <a href="#${h.id}" class="article-toc-l${h.level}">${h.text}</a>
          `).join('')}
        </div>
      </div>
    </div>
    `,
    parentLayout: 'base',
    parentMeta: {
      ...meta,
      title: html`${meta.title} | i'D Blog`,
      head: html`
      <link rel="stylesheet" type="text/css" href="/${config.routes.assets}/article.css">
      `,
      scripts: [`/${config.routes.assets}/article.js`]
    }
  }
}

export default Article
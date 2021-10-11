/* eslint-disable indent */

import html from 'outdent'

import type { Layout } from '../data-types.js'
import config from '../config.js'

const routes = config.routes

const Tags: Layout = () => {
  return {
    layout: (meta) => html`
    <div class="tags">
      <div class="tags-title">Tags</div>
      <div class="tags-content">
        ${Object.keys(meta?.allTags ?? {}).length
        ? Object.entries(meta?.allTags ?? {})
          .sort((a, b) => a[0].localeCompare(b[0]))
          .map(([tagname, tagRoutes]) => html`
          <a class="tags-item" href="/${routes.tags}/${tagname}">
            <span class="tags-name">${tagname.replace('_', ' ')}</span>
            <span class="tags-number">${tagRoutes.length}</span>
          </a>
          `).join('')
        : html`<div class="tags-notag">没有标签</div>`}
      </div>
    </div>
    `
  }
}

export default Tags
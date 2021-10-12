/* eslint-disable indent */

import html from 'outdent'

import type { Layout } from '../data-types.js'
import config from '../config.js'

import Pagination, { PaginationProps } from './pagination.js'

import LanguageTemplate from '../scripts/i18n-utils.js'

const routes = config.routes

type PostListProps = PaginationProps

const PostList: Layout<PostListProps> = () => {
  return {
    layout: (meta, props) => {
      const t = new LanguageTemplate(props?.lang)
      const allMeta = meta.allMeta ?? []

      return allMeta.length
        ? allMeta.map(postMeta => html`
          ${Pagination().layout(meta, props)}
          <div class="post">
            <a class="post-link" href="${t.root}${routes.posts}/${postMeta.route}">
              <h2 class="post-title">${postMeta.title}</h2>
            </a>
            <div class="post-meta">
              <div class="post-time">
                <img class="post-time-icon" src="/${routes.public}/icon/time.svg" alt="time">
                <span>${postMeta.date.year} / ${postMeta.date.month} / ${postMeta.date.day}</span>
              </div>
              <div class="post-tags">
                <img class="post-tags-icon" src="/${routes.public}/icon/tags.svg" alt="tags">
                ${postMeta.tags.length
                ? postMeta.tags.map(tag => html`
                <a class="post-tags-item" href="${t.root}${routes.tags}/${tag}">
                  ${tag.replace('_', ' ')}
                </a>
                `).join('')
                : html`<div class="post-tags-notag">${t.use('noTags')}</div>`}
              </div>
            </div>
            <hr class="post-hr">
            <div class="post-summary">${postMeta.summary}</div>
          </div>
          ${Pagination().layout(meta, props)}
          `).join('')
        : html`<div class="post-noarticle">${t.use('noPostsLong')}</div>`
    }
  }
}

export default PostList
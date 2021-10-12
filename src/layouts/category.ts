/* eslint-disable indent */

import html from 'outdent'

import type { Layout } from '../data-types.js'
import config from '../config.js'

import Container from '../layouts-components/container.js'
import Tags from '../layouts-components/tags.js'
import Timeline from '../layouts-components/timeline.js'
import PostList from '../layouts-components/post-list.js'

import LanguageTemplate from '../scripts/i18n-utils.js'

const routes = config.routes

interface CategoryProps {
  type: string
  category: string
  route: string
}

const Category: Layout<CategoryProps> = () => {
  return {
    layout: (meta, props) => {
      const t = new LanguageTemplate(props?.lang)

      return html`
      ${Container().layout(meta, {
        content: html`
        <div class="category-container">
          <div class="category-sidebar">
            ${Tags().layout(meta, props)}
            ${Timeline().layout(meta, props)}
          </div>
          <div class="category">
            <h1 class="category-info">
              <span>${props?.type}</span>
              <span class="category-name">${props?.category}</span>
            </h1>
            <div class="category-stat">
              <div>${t.use('totalPosts', html`<b>${meta?.postNumber}</b>`)}</div>
            </div>
            ${PostList().layout(meta, props)}
          </div>
        </div>
      `})}
      `
    },
    parentLayout: 'base',
    parentMeta: {
      head: html`
      <link rel="stylesheet" type="text/css" href="/${routes.assets}/category.css">
      `,
      scripts: [`/${routes.assets}/category.js`]
    }
  }
}

export default Category
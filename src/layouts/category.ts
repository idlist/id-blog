/* eslint-disable indent */

import html from 'outdent'

import type { Layout } from '../data-types.js'
import config from '../config.js'

import Container from '../layouts-components/container.js'

const routes = config.routes

interface CategoryProps {
  prompt: string
  route: string
}

const Category: Layout<CategoryProps> = () => {
  return {
    layout: (meta) => html`
    ${Container().layout(meta, {
      content: html`
      <div class="category-container">
        <div>Test</div>
      </div>
      `
    })}
    `,
    parentLayout: 'base',
    parentMeta: {
      head: html`
      <link rel="stylesheet" type="text/css" href="/${routes.assets}/category.css">
      `,
      scripts: [`/${routes.assets}/homepage.js`]
    }
  }
}

export default Category
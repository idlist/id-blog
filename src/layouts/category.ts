import html from 'outdent'

import type { Layout } from '../.data-types.js'
import config from '../config.js'

import Container from '../layouts-components/container.js'

const routes = config.routes

const Category: Layout = () => {
  return {
    layout: (meta) => html`
    ${Container().layout(meta, html`
    `)}
    `,
    parentLayout: 'base'
  }
}

export default Category
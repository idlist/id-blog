import html from 'outdent'

import { Layout } from '../.data-types.js'

const Article: Layout = {
  layout: (meta) => html`
  <article>
    ${meta.body}
  </article>
  `,
  parentLayout: 'base'
}

export default Article
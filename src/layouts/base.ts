import html from 'outdent'

import { Layout } from '../.data-types.js'

const Base: Layout = {
  layout: (meta) => html`
  <!DOCTYPE html>
  <html>

  <head>
    <title>${meta.title}</title>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    ${meta.head}
  </head>

  <body>
    ${meta.body}
  </body>

  </html>
  `,
  unavailable: true
}

export default Base
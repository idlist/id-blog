import html from 'outdent'

import { Layout } from '../.data-types.js'

const Base: Layout = () => {
  return {
    layout: (meta, content) => html`
      <!DOCTYPE html>
      <html>

      <head>
        <title>${meta.title}</title>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="stylesheet" type="text/css" href="assets/base.css">
        ${meta.head}
      </head>

      <body>
        ${content}
      </body>

      </html>
    `,
    unavailable: true
  }
}

export default Base
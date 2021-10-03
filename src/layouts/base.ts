import html from 'outdent'

import { Layout } from '../.data-types.js'

const Base: Layout = () => {
  return {
    layout: (meta, content) => html`
      <!DOCTYPE html>
      <html lang="zh-CN">

      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>${meta.title}</title>
        <link rel="stylesheet" type="text/css" href="../../assets/base.css">
        ${meta.head}
      </head>

      <body>
        <div class="header">
          <div>i'D Handmade blog</div>
        </div>
        <div class="container">
          ${content}
        </div>
        ${meta.liveReload ? html`<script type="module" src="../../assets/live-reload.js"></script>` : html``}
      </body>

      </html>
    `,
    unavailable: true
  }
}

export default Base
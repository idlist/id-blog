import html from 'outdent'

import { Layout } from '../.data-types.js'
import config from '../config.js'

const Base: Layout = () => {
  return {
    layout: (meta, content) => html`
      <!DOCTYPE html>
      <html lang="zh-CN">

      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${meta.title}</title>
        <link rel="stylesheet" type="text/css" href="/assets/base.css">
        ${meta.head}
      </head>

      <body>
        <header>
          <div class="header">
            <img class="header-banner"
              src="/${config.routes.public}/banner.png"
              alt="banner">
            <hr class="header-divider">
            <div>i'D Blog</div>
          </div>
          <div class="menu-fullscreen">
            <a class="menu-link" href="/">Home</a>
            <a class="menu-link" href="/posts">Articles</a>
          </div>
        </header>
        <div class="container">
          ${content}
        </div>
        ${meta.liveReload ? html`<script type="module" src="/assets/live-reload.js"></script>` : html``}
      </body>

      </html>
    `,
    unavailable: true
  }
}

export default Base
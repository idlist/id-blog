import html from 'outdent'

import { Layout } from '../.data-types.js'
import config from '../config.js'

const routes = config.routes

const Base: Layout = () => {
  return {
    layout: (meta, content) => html`
      <!DOCTYPE html>
      <html lang="zh-CN">

      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${meta.title}</title>
        <link rel="shortcut icon" type="image/png" href="/public/favicon.png">
        <link rel="stylesheet" type="text/css" href="/assets/base.css">
        ${meta.head}
      </head>

      <body>
        <a class="menu-expander">
          <img class="menu-button" src="/${routes.public}/buttons/menu.svg" alt="menu_button">
        </a>
        <div class="menu-fullscreen hidden">
          <div class="menu-fs-container">
            <a class="menu-fs-link" href="https://idl.ist/">
              <span>To Homepage</span>
              <img class="menu-link-external" src="/${routes.public}/buttons/external.svg" alt="external">
            </a>
            <hr class="menu-fs-hr">
            <a class="menu-fs-link" href="/">Articles</a>
            <hr class="menu-fs-hr">
            <a class="menu-fs-link" href="/${routes.tag}">Tags</a>
            <hr class="menu-fs-hr">
          </div>
        </div>
        <header>
          <div class="header-container">
            <div class="header">
              <img class="header-banner"
                src="/${routes.public}/banner.png"
                alt="banner">
              <hr class="header-divider">
              <div>i'D Blog</div>
            </div>
            <div class="menu-landscape">
              <a class="menu-link" href="/">Articles</a>
              <a class="menu-link" href="/${routes.tags}">Tags</a>
              <a class="menu-link" href="https://idl.ist/">
                <span>To Homepage</span>
                <img class="menu-link-external" src="/${routes.public}/buttons/external.svg" alt="external">
              </a>
            </div>
          </div>
        </header>
        <div class="container-wrapper">
          <div class="container">
          ${content}
          </div>
        </div>
        <div id="bg-tiles"></div>
        <script type="module" src="/assets/base.js"></script>
        ${meta.liveReload ? html`<script type="module" src="/assets/live-reload.js"></script>` : html``}
      </body>

      </html>
    `,
    unavailable: true
  }
}

export default Base
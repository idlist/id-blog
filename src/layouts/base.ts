import html from 'outdent'

import type { Layout } from '../data-types.js'
import config from '../config.js'

import LanguageTemplate from '../scripts/i18n-utils.js'

const routes = config.routes

const Base: Layout = () => {
  return {
    layout: (meta, props) => {
      const t = new LanguageTemplate(props?.lang)

      return html`
      <!DOCTYPE html>
      <html lang="zh-CN">

      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${meta?.title}</title>
        <link rel="shortcut icon" type="image/png" href="/${routes.public}/favicon.png">
        <link rel="stylesheet" type="text/css" href="/${routes.assets}/base.css">
        ${meta?.head}
      </head>

      <body>
        <a class="menu-expander">
          <img class="menu-button" src="/${routes.public}/buttons/menu.svg" alt="menu_button">
        </a>
        <div class="menu-fullscreen hidden">
          <div class="menu-fs-container">
            <a class="menu-fs-link" href="https://idl.ist/">
              <span class="menu-fs-link-text">${t.use('toIndex')}</span>
              <img class="menu-fs-link-external" src="/${routes.public}/buttons/external.svg" alt="external">
            </a>
            <hr class="menu-fs-hr">
            <div class="menu-fs-link-title">${t.use('language')}</div>
            <a class="menu-fs-link" href="/">简体中文</a>
            <a class="menu-fs-link" href="/e/">English</a>
            <a class="menu-fs-link" href="/j/">日本語</a>
            <hr class="menu-fs-hr">
            <a class="menu-fs-link" href="${t.root}">${t.use('articles')}</a>
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
              <a class="menu-link" href="${t.root}">${t.use('articles')}</a>
              <div class="menu-link-dropdown">
                <div>${t.use('language')}</div>
                <div class="menu-link-dropdown-content">
                  <a class="menu-link-dropdown-link" href="/">简体中文</a>
                  <a class="menu-link-dropdown-link" href="/e/">English</a>
                  <a class="menu-link-dropdown-link" href="/j/">日本語</a>
                </div>
              </div>
              <a class="menu-link" href="https://idl.ist/">
                <span>${t.use('toIndex')}</span>
                <img class="menu-link-external" src="/${routes.public}/buttons/external.svg" alt="external">
              </a>
            </div>
          </div>
        </header>
          ${props?.content}
        </div>
        <div id="bg-tiles"></div>
        <script type="module" src="/assets/base.js"></script>
        ${meta?.liveReload ? html`<script type="module" src="/${routes.assets}/live-reload.js"></script>` : html``}
        ${meta?.scripts?.map(script => html`
        <script type="module" src="${script}"></script>
        `) ?? ''}
      </body>

      </html>
      `
    },
    unavailable: true
  }
}

export default Base
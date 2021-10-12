/* eslint-disable indent */

import html from 'outdent'

import type { Layout } from '../data-types.js'
import config from '../config.js'

import Container from '../layouts-components/container.js'

import i18n from '../i18n.js'
import { getLang } from '../scripts/i18n-utils.js'

const routes = config.routes

const Article: Layout = meta => {
  return {
    layout: (meta, props) => html`
    ${Container().layout(meta, {
      content: html`
      <div class="article-container">
        <article>
          <div id="top-of-article"></div>
          <h1 class="article-title">${meta?.title}</h1>
          ${props?.content}
        </article>
        <div class="article-information">
          <div class="article-me">
            <div class="article-me-icon-container">
              <img class="article-me-icon" src="/${routes.public}/idlist.png" alt="idlist">
            </div>
            <a class="article-me-text" href="mailto:me@idl.ist">me@idl.ist</a>
          </div>
          <div class="article-sidebar">
            <div class="article-item">
              <img class="article-item-icon" src="/${routes.public}/icon/time.svg" alt="time">
              <span>${meta?.date?.year} / ${meta?.date?.month} / ${meta?.date?.day}</span>
            </div>
            <div class="article-item">
              <img class="article-item-icon" src="/${routes.public}/icon/update.svg" alt="time">
              <span>${meta?.lastUpdate?.year} / ${meta?.lastUpdate?.month} / ${meta?.lastUpdate?.day}</span>
            </div>
            <div class="article-tags">
              <img class="article-tags-icon" src="/${routes.public}/icon/tags.svg" alt="tags">
              ${meta?.tags?.length
              ? meta.tags.map(tag => html`
                <a class="article-tags-tagname" href="/${routes.tags}/${tag}">${tag.replace('_', ' ')}</a>
                `).join('')
              : html`<div class="article-tags-notag">${i18n.noTags[getLang(props?.lang)]}</div>`}
            </div>
            <div class="article-item">
              <img class="article-item-icon-small" src="/${routes.public}/icon/creative-common.svg" alt="tags">
              <a class="article-item-link" href="https://creativecommons.org/licenses/by-nc-sa/4.0/">
                CC-BY-NC-SA 4.0
              </a>
            </div>
            <div class="article-toc">
              <div class="article-toc-title">Table of contents</div>
              ${meta?.toc?.length
              ? meta.toc.map(h => html`
              <a href="#${h.id}" class="article-toc-l${h.level}">${h.text}</a>
              `).join('')
              : html`<span class="article-toc-nomenu">${i18n.noTOC[getLang(props?.lang)]}</span>`}
            </div>
            <a class="article-back" href="#top-of-article">
              <img class="article-back-icon" src="/${routes.public}/icon/back-to-top.svg" alt="back to top">
              <span>${i18n.backToTop[getLang(props?.lang)]}</span>
            </a>
          </div>
        </div>
      </div>
    `
    })}
    <a class="article-back-mobile" href="#top-of-article">
      <img class="article-back-mobile-button" src="/${routes.public}/buttons/back-to-top.svg" alt="menu_button">
    </a>
    `,
    parentLayout: 'base',
    parentMeta: {
      title: html`${meta?.title} | i'D Blog`,
      head: html`
      <link rel="stylesheet" type="text/css" href="/${routes.assets}/article.css">
      `,
      scripts: [`/${routes.assets}/article.js`]
    }
  }
}

export default Article
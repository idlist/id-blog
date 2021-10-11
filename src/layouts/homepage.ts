/* eslint-disable indent */

import html from 'outdent'

import type { Layout } from '../.data-types.js'
import config from '../config.js'

import Container from '../layouts-components/container.js'
import PostList from '../layouts-components/post-list.js'

const routes = config.routes

const Homepage: Layout = () => {
  const Contact = (icon: string, text: string, link: string) => html`
  <div class="homepage-contact">
    <img class="homepage-contact-icon" src="/${routes.public}/icon/${icon}.svg" alt="${icon}">
    <a class="homepage-contact-link" href="${link}">${text}</a>
  </div>
  `

  return {
    layout: (meta) => html`
    ${Container().layout(meta, html`
    <div class="homepage-container">
      <div class="homepage-information">
        <div class="homepage-me">
          <div class="homepage-me-icon-container">
            <img class="homepage-me-icon" src="/${routes.public}/idlist.png" alt="idlist">
          </div>
          <div class="homepage-me-name">i'DLisT</div>
        </div>
        ${Contact('email', 'me@idl.ist', 'mailto:me@idl.ist')}
        ${Contact('home', 'idl.ist', 'https://idl.ist')}
        ${Contact('github', 'idlist', 'https://github.com/idlist')}
        ${Contact('twitter', '@i_dlist', 'https://twitter.com/i_dlist')}
        ${Contact('soundcloud', 'i\'DLisT', 'https://soundcloud.com/idlist')}
        <div class="homepage-stat">
        ${meta?.postNumber
        ? html`<div>共有 <b>${meta?.postNumber}</b> 篇文章。</div>`
        : html`<div>没有文章。</div>`}
        </div>
        <div class="homepage-tags">
          <div class="homepage-tags-title">Tags</div>
          <div class="homepage-tags-content">
          ${Object.keys(meta?.allTags ?? {}).length
          ? Object.entries(meta?.allTags ?? {})
            .sort((a, b) => a[0].localeCompare(b[0]))
            .map(([tagname, tagRoutes]) => html`
            <a class="homepage-tags-item" href="/${routes.tags}/${tagname}">
              <span class="homepage-tags-name">${tagname.replace('_', ' ')}</span>
              <span class="homepage-tags-number">${tagRoutes.length}</span>
            </a>
            `).join('')
          : html`<div class="homepage-tags-notag">没有标签</div>`}
          </div>
        </div>
        <div class="homepage-tl">
          <div class="homepage-tl-title">Timeline</div>
          ${Object.keys(meta?.allDate ?? {}).length
          ? Object.entries(meta?.allDate ?? {})
            .sort((a, b) => parseInt(b[0]) - parseInt(a[0]))
            .map(([year, monthData]) => html`
            <div class="homepage-tl-year">${year}</div>
            <div class="homepage-tl-content">
            ${Object.entries(monthData)
              .sort((a, b) => parseInt(b[0]) - parseInt(a[0]))
              .map(([month, monthRoutes]) => html`
              <a class="homepage-tl-item" href="/${routes.timeline}/${year}-${month}">
                <span class="homepage-tl-month">${month}</span>
                <span class="homepage-tl-number">${monthRoutes.length}</span>
              </a>
              `).join('')}
            </div>
            `).join('')
          : html`<div class="homepage-tl-notl">没有时间线</div>`}
        </div>
      </div>
      <div class="homepage">
      ${PostList().layout(meta, routes.page)}
      </div>
    </div>`)}
    `,
    parentLayout: 'base',
    parentMeta: {
      head: html`
      <link rel="stylesheet" type="text/css" href="/${routes.assets}/homepage.css">
      `,
      scripts: [`/${routes.assets}/homepage.js`]
    }
  }
}

export default Homepage
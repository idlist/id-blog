/* eslint-disable indent */

import html from 'outdent'

import type { Layout } from '../.data-types.js'
import config from '../config.js'

import Container from '../layouts-components/container.js'

const routes = config.routes

const Homepage: Layout = () => {
  return {
    layout: (meta) => html`
    ${Container().layout(meta, html`
    <div class="homepage-container">
      <div class="homepage-information">
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

      </div>
    </div>`)}
    `,
    parentLayout: 'base',
    parentMeta: {
      head: html`
      <link rel="stylesheet" type="text/css" href="/${routes.assets}/homepage.css">
      `
    }
  }
}

export default Homepage
/* eslint-disable indent */

import html from 'outdent'

import type { Layout } from '../data-types.js'
import config from '../config.js'

const routes = config.routes

const Timeline: Layout = () => {
  return {
    layout: (meta) => html`
    <div class="tl">
      <div class="timeline-title">Timeline</div>
      ${Object.keys(meta?.allDate ?? {}).length
      ? Object.entries(meta?.allDate ?? {})
        .sort((a, b) => parseInt(b[0]) - parseInt(a[0]))
        .map(([year, monthData]) => html`
        <div class="timeline-year">${year}</div>
        <div class="timeline-content">
        ${Object.entries(monthData)
          .sort((a, b) => parseInt(b[0]) - parseInt(a[0]))
          .map(([month, monthRoutes]) => html`
          <a class="timeline-item" href="/${routes.timeline}/${year}-${month}/1">
            <span class="timeline-month">${month}</span>
            <span class="timeline-number">${monthRoutes.length}</span>
          </a>
          `).join('')}
        </div>
        `).join('')
      : html`<div class="timeline-notl">没有时间线</div>`}
    </div>
    `
  }
}

export default Timeline
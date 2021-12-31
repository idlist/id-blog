/* eslint-disable indent */

import html from 'outdent'

import type { Layout } from '../data-types.js'
import config from '../config.js'

import LanguageTemplate from '../scripts/i18n-utils.js'

const routes = config.routes

const Timeline: Layout = () => {
  return {
    layout: (meta, props) => {
      const t = new LanguageTemplate(props?.lang)

      return html`
      <div class="timeline">
        <div class="timeline-title">Timeline</div>
          ${Object.keys(meta?.allDate ?? {}).length
          ? Object.entries(meta?.allDate ?? {})
            .sort((a, b) => parseInt(b[0]) - parseInt(a[0]))
            .map(([year, monthData]) => html`
            <div class="timeline-year">${year}</div>
            <div class="timeline-content">
            ${Object.entries(monthData)
              .sort((a, b) => parseInt(a[0]) - parseInt(b[0]))
              .map(([month, monthRoutes]) => html`
              <a class="timeline-item" href="${t.root}${routes.timeline}/${year}-${month}">
                <span class="timeline-month">${month}</span>
                <span class="timeline-number">${monthRoutes.length}</span>
              </a>
              `).join('')}
            </div>
            `).join('')
          : html`<div class="timeline-notl">${t.use('noTimeline')}</div>`}
      </div>
      `
    }
  }
}

export default Timeline
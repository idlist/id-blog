import html from 'outdent'

import type { Layout } from '../data-types.js'

interface PaginationProps {
  route: string
}

const Pagination: Layout<PaginationProps> = () => {
  const prevPage = (current: number): number => {
    if (current <= 1) return 1
    else return current - 1
  }

  const nextPage = (current: number, length: number): number => {
    if (current >= length) return length
    else return current + 1
  }

  return {
    layout: (meta, props) => {
      const current = meta?.pagination?.current ?? 1
      const length = meta?.pagination?.length ?? 1

      return html`
      <div class="pagination-container">
        <div class="pagination">
          <a class="pagination-button"
            href="/${props?.route}/${prevPage(current)}">
            &lt;
          </a>
          <div class="pagination-current">${current}</div>
          <a class="pagination-button"
            href="/${props?.route}/${nextPage(current, length)}">
            &gt;
          </a>
          <input class="pagination-input" type="text">
          <div class="pagination-divider">/</div>
          <div class="pagination-limit">${length}</div>
          <a class="pagination-go">GO</a>
        </div>
      </div>
      `
    }
  }
}

export default Pagination
export type { PaginationProps }
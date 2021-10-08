import html from 'outdent'

import type { Layout } from '../.data-types.js'

const Container: Layout = () => {
  return {
    layout: (_, content) => html`
    <div class="container-wrapper">
      <div class="container">
      ${content}
      </div>
    </div>
    `
  }
}

export default Container
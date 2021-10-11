import html from 'outdent'

import type { Layout } from '../data-types.js'

interface ContainerProps {
  content: string
}

const Container: Layout<ContainerProps> = () => {
  return {
    layout: (_, props) => html`
    <div class="container-wrapper">
      <div class="container">
      ${props.content}
      </div>
    </div>
    `
  }
}

export default Container
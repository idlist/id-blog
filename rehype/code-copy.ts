import type { RehypePlugin } from '@astrojs/markdown-remark'
import type { Element } from 'hast'
import { visit } from 'unist-util-visit'
import { selectAll } from 'hast-util-select'
import { h } from 'hastscript'

const copyCode: RehypePlugin = () => {
  return (tree: Element) => {
    const codeBlocks = selectAll('pre:has(> code)', tree)

    visit(tree, codeBlocks, (node, i, parent) => {
      const wrapper = h('div', { class: 'code-wrapper' }, [
        h('div', { class: 'code-copy__success hidden' }, 'Copied!'),
        h('div', { class: 'code-copy' }, [
          h('img', { class: 'code-copy__icon', src: '/assets/copy.svg', alt: 'copy' }),
        ]),
      ])
      wrapper.children.push(node)
      parent!.children[i!] = wrapper
    })
  }
}

export default copyCode
import type { RehypePlugin } from '@astrojs/markdown-remark'
import type { Element } from 'hast'
import { visit } from 'unist-util-visit'
import { selectAll } from 'hast-util-select'
import { h } from 'hastscript'

const wrapTable: RehypePlugin = () => {
  return (tree) => {
    const tables = selectAll('table', tree)

    visit(tree, tables, (node, i, parent) => {
      const wrapper = h('.table-wrapper')
      wrapper.children = [node as Element]
      parent!.children[i!] = wrapper
    })
  }
}

export default wrapTable
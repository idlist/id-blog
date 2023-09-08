import type { Element } from 'hast'
import type { Plugin } from 'unified'
import { visit } from 'unist-util-visit'
import { selectAll } from 'hast-util-select'
import { h } from 'hastscript'

const wrapTable: Plugin<[], Element> = () => {
  return (tree) => {
    const tables = selectAll('table', tree)

    visit(tree, tables, (node, i, parent) => {
      const wrapper = h('.table-wrapper')
      wrapper.children = [node]
      parent!.children[i!] = wrapper
    })
  }
}

export default wrapTable
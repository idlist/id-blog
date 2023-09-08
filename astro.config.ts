import { defineConfig } from 'astro/config'
import { h } from 'hastscript'
import vue from '@astrojs/vue'
import mdx from '@astrojs/mdx'
import sitemap from '@astrojs/sitemap'
import { rehypeHeadingIds, type RehypePlugin } from '@astrojs/markdown-remark'
import rehypeExternalLinks from 'rehype-external-links'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeWrapTable from './rehype/wrap-table'

// https://astro.build/config
export default defineConfig({
  site: 'https://blog.idl.ist',
  server: {
    port: 19198,
  },
  markdown: {
    smartypants: false,
    rehypePlugins: [
      rehypeHeadingIds,
      [
        rehypeAutolinkHeadings as RehypePlugin, {
          behavior: 'prepend',
          content: () =>
            h('img', { class: 'article-anchor', src: '/assets/link.svg', alt: 'link' }),
        },
      ],
      [
        rehypeExternalLinks as RehypePlugin, {
          target: '_blank',
          rel: ['nofollow', 'noreferer', 'noopener'],
        },
      ],
      rehypeWrapTable as unknown as RehypePlugin,
    ],
  },
  integrations: [
    vue(),
    mdx(),
    sitemap(),
  ],
})

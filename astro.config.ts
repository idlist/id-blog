import { defineConfig } from 'astro/config'
import { h } from 'hastscript'
import vue from '@astrojs/vue'
import mdx from '@astrojs/mdx'
import sitemap from '@astrojs/sitemap'
import { rehypeHeadingIds } from '@astrojs/markdown-remark'
import rehypeExternalLinks from 'rehype-external-links'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import adds2head from 'astro-adds-to-head'

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
        rehypeAutolinkHeadings, {
          behavior: 'prepend',
          content: () =>
            h('img', { class: 'article-anchor', src: '/assets/link.svg', alt: 'link' }),
        },
      ],
      [
        rehypeExternalLinks, {
          target: '_blank',
          rel: ['nofollow', 'noreferer', 'noopener'],
        },
      ],
    ],
  },
  integrations: [
    vue(),
    mdx(),
    sitemap(),
    // https://github.com/lilnasy/gratelets/tree/main/packages/adds-to-head
    // Fix https://github.com/withastro/astro/issues/7761.
    adds2head(),
  ],
})

import { defineConfig } from 'astro/config'
import { h } from 'hastscript'
import vue from '@astrojs/vue'
import mdx from '@astrojs/mdx'
import sitemap from '@astrojs/sitemap'
import { rehypeHeadingIds } from '@astrojs/markdown-remark'
import autoprefixer from 'autoprefixer'
import rehypeExternalLinks from 'rehype-external-links'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'

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
  vite: {
    css: {
      postcss: {
        plugins: [
          autoprefixer,
        ],
      },
      preprocessorOptions: {
        sass: {
          api: 'modern-compiler',
        },
        scss: {
          api: 'modern-compiler',
        },
      },
    },
  },
  integrations: [
    vue(),
    mdx(),
    sitemap(),
  ],
})

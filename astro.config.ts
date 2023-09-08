import { defineConfig } from 'astro/config'
import vue from '@astrojs/vue'
import mdx from '@astrojs/mdx'
import sitemap from '@astrojs/sitemap'
import rehypeExternalLinks from 'rehype-external-links'

// https://astro.build/config
export default defineConfig({
  site: 'https://blog.idl.ist',
  server: {
    port: 19198,
  },
  markdown: {
    smartypants: false,
    rehypePlugins: [
      [
        rehypeExternalLinks as unknown as string, {
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
  ],
})

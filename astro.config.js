import { defineConfig } from 'astro/config'
import vue from '@astrojs/vue'
import sitemap from '@astrojs/sitemap'

// https://astro.build/config
export default defineConfig({
  site: 'https://blog.idl.ist',
  server: {
    port: 19198,
  },
  integrations: [vue(), sitemap()],
})
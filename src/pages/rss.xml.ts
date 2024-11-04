import rss from '@astrojs/rss'
import { getContainerRenderer as mdx } from '@astrojs/mdx'
import type { APIRoute } from 'astro'
import { getCollection } from 'astro:content'
import { loadRenderers } from 'astro:container'
import { experimental_AstroContainer } from 'astro/container'
import { defaultLang, undef } from '@/i18n'

const container = await experimental_AstroContainer.create({
  renderers: await loadRenderers([mdx()]),
})

export const GET: APIRoute = async (ctx) => {
  const posts = await getCollection('posts')

  const items = await Promise.all(posts.map(async (post) => {
    const { Content } = await post.render()
    const rendered = await container.renderToString(Content)

    return {
      title: post.data.title,
      pubDate: post.data.date,
      description: post.data.summary,
      link: `/a/${undef(post.data.lang, defaultLang) ?? ''}/${post.data.route}`,
      content: rendered,
    }
  }))

  return rss({
    title: 'Reinventing the Wheel | i\'D Blog',
    description: '',
    site: ctx.site!,
    trailingSlash: false,
    items,
  })
}

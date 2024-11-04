import rss from '@astrojs/rss'
import type { APIRoute } from 'astro'
import { getCollection } from 'astro:content'
import { defaultLang, undef } from '@/i18n'

export const GET: APIRoute = async (ctx) => {
  const posts = await getCollection('posts')

  return rss({
    title: 'Reinventing the Wheel | i\'D Blog',
    description: '',
    site: ctx.site!,
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      description: post.data.summary,
      link: `/a/${undef(post.data.lang, defaultLang) ?? ''}/${post.data.route}`,
    })),
  })
}

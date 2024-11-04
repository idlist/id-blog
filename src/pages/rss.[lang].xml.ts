import rss, { type RSSFeedItem } from '@astrojs/rss'
import type { APIRoute } from 'astro'
import { getCollection } from 'astro:content'
import { defaultLang, lang, langTags, type LangCode } from '@/i18n'

export const GET: APIRoute = async ({ params, site }) => {
  const posts = await getCollection('posts')
  const lang = params.lang
  const postsByLang = posts.filter(({ data }) => {
    return data.lang == lang || (data.lang === undefined && lang == defaultLang)
  })

  return rss({
    title: 'Reinventing the Wheel | i\'D Blog',
    description: '',
    site: site!,
    trailingSlash: false,
    customData: `<language>${langTags[lang as LangCode]}</language>`,
    items: postsByLang.map(({ data }): RSSFeedItem => ({
      title: data.title,
      author: 'i\'DLisT',
      pubDate: data.date,
      description: data.summary,
      categories: data.tags ?? [],
      link: `/a/${data.lang == defaultLang ? '' : `${data.lang}/`}${data.route}`,
    })),
  })
}

export const getStaticPaths = () => {
  return Object.keys(lang).flatMap((code) => ({
    params: { lang: code },
  }))
}

import rss, { type RSSFeedItem } from '@astrojs/rss'
import type { APIRoute } from 'astro'
import { getCollection } from 'astro:content'
import { defaultLang, lang, langTags, undef, type LangCode } from '@/i18n'

export const GET: APIRoute = async ({ params, site }) => {
  const posts = await getCollection('posts')
  const code = params.lang as LangCode
  const postsByLang = posts.filter(({ data }) => {
    return data.lang == code || (data.lang === undefined && code == defaultLang)
  })

  return rss({
    title: `Reinventing the Wheel | i'D Blog - ${lang[code]}`,
    description: '',
    site: site!,
    trailingSlash: false,
    customData: `<language>${langTags[code]}</language>`,
    items: postsByLang.map(({ data }): RSSFeedItem => ({
      title: data.title,
      author: 'i\'DLisT',
      pubDate: data.date,
      description: data.summary,
      categories: data.tags ?? [],
      link: `/a/${undef(data.lang, defaultLang) ?? ''}/${data.route}`,
    })),
  })
}

export const getStaticPaths = () => {
  return Object.keys(lang).flatMap((code) => ({
    params: { lang: code },
  }))
}

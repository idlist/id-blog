import { defineCollection, z } from 'astro:content'

const postsCollections = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    lang: z.string().optional(),
    date: z.date(),
    lastUpdate: z.date().optional(),
    tags: z.array(z.string()),
  }),
})

export const collections = {
  'posts': postsCollections,
}
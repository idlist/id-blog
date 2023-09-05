import { defineCollection, z, type CollectionEntry } from 'astro:content'

const postsCollections = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    lang: z.string().optional(),
    date: z.date(),
    lastUpdate: z.date().optional(),
    tags: z.array(z.string()).optional(),
    summary: z.string().optional(),
  }),
})

export type Posts = CollectionEntry<'posts'>[]

export const collections = {
  'posts': postsCollections,
}
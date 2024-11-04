import { defineCollection, z, type CollectionEntry } from 'astro:content'

const postsCollections = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    route: z.string(),
    lang: z.string().optional(),
    date: z.date(),
    update: z.date().optional(),
    tags: z.array(z.string()).optional(),
    license: z.string().optional(),
    summary: z.string(),
  }),
})

export type Posts = CollectionEntry<'posts'>[]

export const collections = {
  'posts': postsCollections,
}

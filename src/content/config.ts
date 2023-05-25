import { z, defineCollection } from 'astro:content'
const contentCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    tags: z.array(z.string()).optional(),
    aliases: z.array(z.string()).optional(),
    alias: z.string().optional(),
  })
})
export const collections = {
  quartz: contentCollection,
}

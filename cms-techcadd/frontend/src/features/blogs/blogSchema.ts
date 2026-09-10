import { z } from 'zod'

import { seoBlockSchema } from '../../components/form/seoSchema'

const mediaRefSchema = z.object({
  id: z.string(),
  url: z.string(),
  alt: z.string(),
  width: z.number().optional(),
  height: z.number().optional(),
})

export const blogSchema = z.object({
  title: z.string().min(1, 'Title is required.').max(140, 'Keep titles under 140 characters.'),
  slug: z
    .string()
    .min(1, 'Slug is required.')
    .regex(/^[a-z0-9-]+$/, 'Use lowercase letters, numbers and hyphens only.'),
  authorId: z.string().optional(),
  categoryId: z.string().optional(),
  tags: z.array(z.string()),
  coverImage: mediaRefSchema.nullish(),
  excerpt: z.string().min(1, 'An excerpt is required.').max(300, 'Keep excerpts under 300 characters.'),
  body: z.string(),
  publishDate: z.string().optional(),
  seo: seoBlockSchema,
  status: z.enum(['published', 'draft', 'review']),
  /**
   * The story the blog index leads with.
   *
   * Only one post can hold it, and the API demotes whoever held it before
   * rather than rejecting the save — promoting a new lead story is what an
   * editor means by it, so there is nothing to un-set first.
   */
  featured: z.boolean(),
  /** Feeds the "Trending" rail and the editor's picks row. Any number may carry it. */
  trending: z.boolean(),
})

export type BlogFormValues = z.infer<typeof blogSchema>

export function emptyBlog(): BlogFormValues {
  return {
    title: '',
    slug: '',
    authorId: undefined,
    categoryId: undefined,
    tags: [],
    coverImage: undefined,
    excerpt: '',
    body: '',
    publishDate: undefined,
    seo: { keywords: [] },
    status: 'draft',
    featured: false,
    trending: false,
  }
}

/** ~200 wpm over the stripped HTML — close enough for a reading-time badge. */
export function readingTimeMinutes(html: string): number {
  const words = html
    .replace(/<[^>]*>/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean).length

  return Math.max(1, Math.round(words / 200))
}

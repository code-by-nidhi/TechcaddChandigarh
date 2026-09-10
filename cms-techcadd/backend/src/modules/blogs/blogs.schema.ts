import { z } from 'zod'

/**
 * An empty string is kept rather than rejected.
 *
 * These are optional ids, and '' is how the form says "cleared" — see the
 * NULLABLE note in the matching repo. Stripping it here would make the clear
 * button unreachable: the field would simply be absent, which means "leave it
 * alone".
 */
const optionalId = z.string().optional()

/**
 * Optional image slots accept null as well as being absent.
 *
 * An image is an object, so '' cannot carry "cleared" the way it does for a
 * scalar id. Absent still means "leave it alone"; null means "remove it".
 * Without this the remove button on the form has no way to reach the server.
 */
const mediaRef = z.object({
  id: z.string().min(1),
  url: z.string().optional(),
  alt: z.string().optional(),
  width: z.number().optional(),
  height: z.number().optional(),
})

const seo = z.object({
  metaTitle: z.string().max(60, 'Keep meta titles under 60 characters.').optional(),
  metaDescription: z.string().max(160, 'Keep meta descriptions under 160 characters.').optional(),
  keywords: z.array(z.string()),
  ogImage: mediaRef.nullish(),
  canonicalUrl: z.string().optional(),
})

/** Mirrors `frontend/src/features/blogs/blogSchema.ts`. */
const base = z.object({
  title: z.string().min(1, 'Title is required.').max(140, 'Keep titles under 140 characters.'),
  slug: z
    .string()
    .min(1, 'Slug is required.')
    .regex(/^[a-z0-9-]+$/, 'Use lowercase letters, numbers and hyphens only.'),
  authorId: optionalId,
  categoryId: optionalId,
  tags: z.array(z.string().min(1).max(60)),
  coverImage: mediaRef.nullish(),
  excerpt: z
    .string()
    .min(1, 'An excerpt is required.')
    .max(300, 'Keep excerpts under 300 characters.'),
  body: z.string(),
  publishDate: z
    .union([z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Enter a valid date.'), z.literal('')])
    .optional(),
  seo,
  status: z.enum(['published', 'draft', 'review']),
  /**
   * The one story that leads the blog index.
   *
   * At most one post may hold it. The repository demotes whoever held it
   * before rather than rejecting the save: an editor promoting a new lead
   * story means to replace the old one, and making them go and unset it first
   * is a rule with no purpose behind it.
   */
  featured: z.boolean(),
  /** Feeds the "Trending" rail. Any number of posts may carry it. */
  trending: z.boolean(),
})

export const blogSchema = base.extend({
  tags: z.array(z.string().min(1).max(60)).default([]),
  body: z.string().default(''),
  seo: seo.default({ keywords: [] }),
  status: z.enum(['published', 'draft', 'review']).default('draft'),
  featured: z.boolean().default(false),
  trending: z.boolean().default(false),
})

/** Defaults stay off the patch schema — see the note in categories.schema.ts. */
export const blogPatchSchema = base.partial()

export type BlogInput = z.infer<typeof blogSchema>
export type BlogPatch = z.infer<typeof blogPatchSchema>

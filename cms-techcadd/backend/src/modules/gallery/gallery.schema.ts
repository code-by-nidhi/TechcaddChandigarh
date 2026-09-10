import { z } from 'zod'

import { mediaRef } from '../shared/mediaRef.js'

/**
 * One tile in an album.
 *
 * `mediaId` rather than a URL: the image is already in the media library, and
 * pointing at it means a photo used in two albums is stored once and deleting
 * it from the library cannot leave a tile behind showing a broken image.
 *
 * `caption` overrides the library's own alt text for this placement — the same
 * photo can caption differently in a Campus album and an Events one.
 */
const galleryImageSchema = z.object({
  id: z.string().max(64).optional(),
  mediaId: z.string().min(1, 'Choose an image.').max(36),
  caption: z.string().max(255).default(''),
})

/**
 * The shape, with no defaults attached.
 *
 * Defaults live only on the create schema below. `.partial()` does NOT strip a
 * `.default()` — so a patch of `{ fee }` would still parse as carrying
 * `agenda: []`, and the repository, seeing a value rather than `undefined`,
 * would wipe the schedule. That is not hypothetical: it happened.
 */
const base = z.object({
  title: z.string().min(1, 'A title is required.').max(160),
  slug: z
    .string()
    .min(1, 'A slug is required.')
    .max(160)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Use lowercase letters, numbers and hyphens.'),
  description: z.string().max(1000).optional(),
  /** The filter pills the gallery page renders: Campus, Classroom, Events… */
  category: z.string().min(1, 'Choose a category.').max(80),
  cover: mediaRef.nullish(),
  images: z.array(galleryImageSchema),
  order: z.number(),
  status: z.enum(['published', 'draft', 'review']),
})

export const albumSchema = base.extend({
  category: z.string().min(1).max(80).default('Campus'),
  images: z.array(galleryImageSchema).default([]),
  order: z.number().default(0),
  status: z.enum(['published', 'draft', 'review']).default('draft'),
})

/** Defaults stay off the patch schema — see the note in categories.schema.ts. */
export const albumPatchSchema = base.partial()

export type AlbumInput = z.infer<typeof albumSchema>
export type AlbumPatch = z.infer<typeof albumPatchSchema>
export type GalleryImage = z.infer<typeof galleryImageSchema>

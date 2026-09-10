import { z } from 'zod'

/**
 * One tile.
 *
 * `mediaId` rather than a URL: the image already lives in the media library,
 * so pointing at it means the same photo in two albums is stored once. `url`
 * and `alt` come back from the API for the preview and are not sent back.
 */
const galleryImageSchema = z.object({
  id: z.string().optional(),
  mediaId: z.string().min(1),
  caption: z.string().max(255),
  url: z.string().optional(),
  alt: z.string().optional(),
  width: z.number().optional(),
  height: z.number().optional(),
})

/** Mirrors `backend/src/modules/gallery/gallery.schema.ts`. */
export const albumSchema = z.object({
  title: z.string().min(1, 'A title is required.').max(160),
  slug: z
    .string()
    .min(1, 'A slug is required.')
    .max(160)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Use lowercase letters, numbers and hyphens.'),
  description: z.string().max(1000).optional(),
  category: z.string().min(1, 'Choose a category.').max(80),
  cover: z
    .object({
      id: z.string().min(1),
      url: z.string(),
      alt: z.string(),
      width: z.number().optional(),
      height: z.number().optional(),
    })
    .nullish(),
  images: z.array(galleryImageSchema),
  order: z.number(),
  status: z.enum(['published', 'draft', 'review']),
})

export type AlbumFormValues = z.infer<typeof albumSchema>
export type GalleryImageValue = z.infer<typeof galleryImageSchema>

export function emptyAlbum(): AlbumFormValues {
  return {
    title: '',
    slug: '',
    description: '',
    category: 'Campus',
    cover: null,
    images: [],
    order: 0,
    status: 'draft',
  }
}

/**
 * The groups the website renders as filter pills.
 *
 * Offered as suggestions rather than enforced — the column is free text, so a
 * new group can be introduced without a migration, and these are simply the
 * ones the gallery page already knows how to lay out.
 */
export const CATEGORY_SUGGESTIONS = ['Campus', 'Classroom', 'Events', 'Students']

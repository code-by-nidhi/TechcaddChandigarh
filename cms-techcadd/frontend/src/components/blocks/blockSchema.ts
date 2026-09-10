import { z } from 'zod'

/**
 * Mirrors `backend/src/modules/pages/blocks.schema.ts`.
 *
 * A discriminated union, so "an image block with no image" cannot be saved.
 * With one permissive shape it would be valid right up until the page renders
 * a gap.
 */

const mediaRefSchema = z.object({
  id: z.string().min(1),
  url: z.string(),
  alt: z.string(),
  width: z.number().optional(),
  height: z.number().optional(),
})

const idField = z.string().min(1).max(64)

export const textBlockSchema = z.object({
  id: idField,
  type: z.literal('text'),
  heading: z.string().max(200).optional(),
  body: z.string(),
})

export const imageBlockSchema = z.object({
  id: idField,
  type: z.literal('image'),
  image: mediaRefSchema,
  caption: z.string().max(300).optional(),
  width: z.enum(['inline', 'wide', 'full']),
})

export const ctaBlockSchema = z.object({
  id: idField,
  type: z.literal('cta'),
  heading: z.string().min(1, 'Give the panel a heading.').max(200),
  body: z.string().max(600).optional(),
  buttonLabel: z.string().min(1, 'Say what the button does.').max(60),
  buttonHref: z.string().min(1, 'Where should the button go?').max(500),
  tone: z.enum(['accent', 'soft']),
})

/**
 * An embedded video.
 *
 * A URL rather than an upload: video is large, and hosting it here would mean
 * paying for the bandwidth and building a player. YouTube and Vimeo did both.
 */
export const videoBlockSchema = z.object({
  id: idField,
  type: z.literal('video'),
  url: z.url('Paste a full YouTube or Vimeo link.'),
  heading: z.string().max(200).optional(),
  caption: z.string().max(300).optional(),
})

export const RECENT_SOURCES = ['blogs', 'events', 'courses', 'reviews'] as const

export const recentBlockSchema = z.object({
  id: idField,
  type: z.literal('recent'),
  source: z.enum(RECENT_SOURCES),
  heading: z.string().max(200).optional(),
  count: z.number().int().min(1).max(12),
})

export const pageBlockSchema = z.discriminatedUnion('type', [
  textBlockSchema,
  imageBlockSchema,
  videoBlockSchema,
  ctaBlockSchema,
  recentBlockSchema,
])

export type PageBlock = z.infer<typeof pageBlockSchema>
export type BlockType = PageBlock['type']

/** What the "Add block" menu offers, and what each one is for. */
export const BLOCK_TYPES: { type: BlockType; label: string; hint: string }[] = [
  { type: 'text', label: 'Text', hint: 'A heading and some writing.' },
  { type: 'image', label: 'Image', hint: 'A picture from the media library, with a caption.' },
  { type: 'video', label: 'Video', hint: 'A YouTube or Vimeo link, embedded in the page.' },
  {
    type: 'cta',
    label: 'Call to action',
    hint: 'A panel with a heading and a button — “Book a free demo”.',
  },
  {
    type: 'recent',
    label: 'Recent items',
    hint: 'A row that stays current on its own — latest posts, upcoming events, courses.',
  },
]

export const RECENT_SOURCE_OPTIONS = [
  { value: 'blogs', label: 'Latest blog posts' },
  { value: 'events', label: 'Upcoming events' },
  { value: 'courses', label: 'Featured courses' },
  { value: 'reviews', label: 'Student reviews' },
]

export const IMAGE_WIDTH_OPTIONS = [
  { value: 'inline', label: 'Inline — same width as the text' },
  { value: 'wide', label: 'Wide — breaks out a little' },
  { value: 'full', label: 'Full width' },
]

export const CTA_TONE_OPTIONS = [
  { value: 'accent', label: 'Dark panel' },
  { value: 'soft', label: 'Tinted panel' },
]

/**
 * A new block of the given type, with its required fields already filled.
 *
 * Every default has to satisfy the schema above, or a freshly added block would
 * be invalid before the editor has typed anything — which reads as the form
 * being broken rather than as "fill this in".
 */
export function emptyBlock(type: BlockType): PageBlock {
  // `crypto.randomUUID` needs a secure context; the fallback keeps the editor
  // working on a plain-HTTP staging host.
  const id =
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : `block-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

  switch (type) {
    case 'text':
      return { id, type: 'text', heading: '', body: '' }
    case 'image':
      return { id, type: 'image', image: { id: '', url: '', alt: '' }, caption: '', width: 'inline' }
    case 'video':
      return { id, type: 'video', url: '', heading: '', caption: '' }
    case 'cta':
      return {
        id,
        type: 'cta',
        heading: '',
        body: '',
        buttonLabel: 'Book a free demo',
        buttonHref: '/contact#enquire',
        tone: 'accent',
      }
    case 'recent':
      return { id, type: 'recent', source: 'blogs', heading: '', count: 3 }
  }
}

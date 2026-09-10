import { z } from 'zod'

import { mediaRef } from './mediaRef.js'

/**
 * The content blocks a page or a blog post is built from.
 *
 * Shared by both because they are the same editorial problem — a document with
 * a picture, a video and a call to action in the middle of it — and two copies
 * would drift the first time one gained a block type.
 *
 * A discriminated union rather than one shape with every field optional: the
 * types genuinely differ, and a union is what makes "an image block with no
 * image" impossible to save. With a permissive shape that record is valid right
 * up until the page renders a gap.
 *
 * Adding a type means adding a member here, a case in the website's renderer,
 * and an entry in the CMS block picker. Nothing else branches on the type, so
 * those three are the whole cost.
 */

const blockBase = {
  /**
   * Stable across a save so React keeps its keys and the editor does not lose
   * focus mid-typing. Generated in the browser, which is why it is a plain
   * string rather than a UUID column.
   */
  id: z.string().min(1).max(64),
}

/* ------------------------------- Text -------------------------------- */

const textBlock = z.object({
  ...blockBase,
  type: z.literal('text'),
  /** Optional: a run of prose under a previous heading needs none of its own. */
  heading: z.string().max(200).optional(),
  body: z.string(),
})

/* ------------------------------- Image ------------------------------- */

const imageBlock = z.object({
  ...blockBase,
  type: z.literal('image'),
  image: mediaRef,
  /** Printed under the picture. Also the alt text when the media has none. */
  caption: z.string().max(300).optional(),
  /**
   * How wide it sits.
   *
   * Three named widths rather than a number: a pixel value chosen against one
   * screen is wrong on every other, and "full bleed" is a layout decision the
   * site should implement, not a measurement.
   */
  width: z.enum(['inline', 'wide', 'full']).default('inline'),
})

/* ------------------------------- Video ------------------------------- */

/**
 * An embedded video.
 *
 * A URL rather than an uploaded file: video is large, and hosting it on the
 * CMS means paying for the bandwidth and building a player. YouTube and Vimeo
 * already did both.
 *
 * Stored as the address the author pasted. The id is extracted at render, so a
 * link shape we do not parse today still opens in a new tab instead of being
 * rejected by a regex written before it existed.
 */
const videoBlock = z.object({
  ...blockBase,
  type: z.literal('video'),
  url: z.url('Paste a full YouTube or Vimeo link.'),
  /** Shown above the player. */
  heading: z.string().max(200).optional(),
  caption: z.string().max(300).optional(),
})

/* -------------------------- Call to action --------------------------- */

const ctaBlock = z.object({
  ...blockBase,
  type: z.literal('cta'),
  heading: z.string().min(1, 'Give the panel a heading.').max(200),
  body: z.string().max(600).optional(),
  buttonLabel: z.string().min(1, 'Say what the button does.').max(60),
  /**
   * Relative or absolute. A CTA pointing at the enquiry form is the common
   * case and that is a site path, not a URL.
   */
  buttonHref: z.string().min(1, 'Where should the button go?').max(500),
  /** `accent` is the dark panel; `soft` is the tinted one. */
  tone: z.enum(['accent', 'soft']).default('accent'),
})

/* ----------------------------- Recent -------------------------------- */

export const RECENT_SOURCES = ['blogs', 'events', 'courses', 'reviews'] as const

const recentBlock = z.object({
  ...blockBase,
  type: z.literal('recent'),
  source: z.enum(RECENT_SOURCES),
  heading: z.string().max(200).optional(),
  /**
   * Capped at 12: past that it stops being a taster on a page and becomes a
   * worse version of the index it is pointing at.
   */
  count: z.number().int().min(1).max(12).default(3),
})

/* --------------------------------------------------------------------- */

export const pageBlockSchema = z.discriminatedUnion('type', [
  textBlock,
  imageBlock,
  videoBlock,
  ctaBlock,
  recentBlock,
])

export const pageBlocksSchema = z.array(pageBlockSchema)

export type PageBlock = z.infer<typeof pageBlockSchema>

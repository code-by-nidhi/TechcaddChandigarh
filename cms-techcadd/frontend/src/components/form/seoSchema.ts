import { z } from 'zod'

/**
 * The validation behind `<SeoFields />`.
 *
 * Every form that renders those fields validates them the same way, so the
 * schema sits beside the component rather than inside whichever feature
 * happened to need it first — it previously lived in the Pages module, which
 * meant the Blog form's validation broke the moment Pages was removed.
 *
 * The two length caps match what Google truncates at. They are warnings in the
 * UI and limits here: an editor can see they are over and decide, but a save
 * that would render badly in search results does not go through silently.
 */

const mediaRefSchema = z.object({
  id: z.string(),
  url: z.string(),
  alt: z.string(),
  width: z.number().optional(),
  height: z.number().optional(),
})

export const seoBlockSchema = z.object({
  metaTitle: z.string().max(60, 'Keep meta titles under 60 characters.').optional(),
  metaDescription: z
    .string()
    .max(160, 'Keep meta descriptions under 160 characters.')
    .optional(),
  keywords: z.array(z.string()),
  ogImage: mediaRefSchema.nullish(),
  canonicalUrl: z.string().optional(),
})

export type SeoBlockValues = z.infer<typeof seoBlockSchema>

/** The value a new record starts with — no meta set, no keywords. */
export function emptySeoBlock(): SeoBlockValues {
  return { keywords: [] }
}

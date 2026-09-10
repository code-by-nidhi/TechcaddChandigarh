import { z } from 'zod'

/**
 * An image slot, as the forms send it.
 *
 * The whole object travels rather than a bare id because `ImageField` renders
 * the preview from `url` and `alt` without a second lookup. Only `id` is
 * required — it is the part that gets stored.
 *
 * Typed `.nullish()` at each use site, not here: absent means "leave it alone"
 * on a patch and `null` means "remove it", and `undefined` cannot say the
 * second because `JSON.stringify` drops the key entirely.
 */
export const mediaRef = z.object({
  id: z.string().min(1),
  url: z.string().optional(),
  alt: z.string().optional(),
  width: z.number().optional(),
  height: z.number().optional(),
})

export type MediaRefInput = z.infer<typeof mediaRef>

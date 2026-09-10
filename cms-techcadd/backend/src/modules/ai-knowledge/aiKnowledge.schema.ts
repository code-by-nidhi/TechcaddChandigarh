import { z } from 'zod'

/**
 * One thing the website chatbot knows.
 *
 * Kept apart from the FAQ module because the two are written for different
 * readers. An FAQ is written to be read on a page: grouped, ordered, shown in
 * full. A knowledge entry is written to be *retrieved* — it carries the
 * alternate phrasings a visitor actually types, and never appears anywhere as
 * a list. Merging them would give every FAQ retrieval fields it does not use,
 * and put every knowledge entry on the FAQ page whether it reads well there
 * or not.
 */
const base = z.object({
  question: z.string().min(1, 'A question is required.').max(300),
  answer: z.string().min(1, 'An answer is required.'),
  category: z.string().min(1, 'Choose a category.').max(80),
  /**
   * Alternate phrasings, comma-separated.
   *
   * The field that decides whether an entry is ever found. "What does it cost"
   * is the question; "fees, price, how much, charges" is how people ask it.
   */
  keywords: z.string().max(1000).optional(),
  order: z.number(),
  status: z.enum(['published', 'draft', 'review']),
})

export const aiKnowledgeSchema = base.extend({
  category: z.string().min(1).max(80).default('General'),
  order: z.number().default(0),
  status: z.enum(['published', 'draft', 'review']).default('draft'),
})

/** Defaults stay off the patch schema — see the note in categories.schema.ts. */
export const aiKnowledgePatchSchema = base.partial()

export type AiKnowledgeInput = z.infer<typeof aiKnowledgeSchema>
export type AiKnowledgePatch = z.infer<typeof aiKnowledgePatchSchema>

import { z } from 'zod'

/** Mirrors `backend/src/modules/ai-knowledge/aiKnowledge.schema.ts`. */
export const knowledgeSchema = z.object({
  question: z.string().min(1, 'A question is required.').max(300),
  answer: z.string().min(1, 'An answer is required.'),
  category: z.string().min(1, 'Choose a category.').max(80),
  keywords: z.string().max(1000).optional(),
  order: z.number(),
  status: z.enum(['published', 'draft', 'review']),
})

export type KnowledgeFormValues = z.infer<typeof knowledgeSchema>

export function emptyKnowledge(): KnowledgeFormValues {
  return { question: '', answer: '', category: 'General', keywords: '', order: 0, status: 'draft' }
}

/**
 * Starter groups, offered only until entries exist.
 *
 * The column is free text, so a new group needs no migration — these just stop
 * a fresh install presenting an empty dropdown.
 */
export const KNOWLEDGE_CATEGORY_SUGGESTIONS = [
  'General',
  'Courses',
  'Fees',
  'Admissions',
  'Placement',
  'Timings',
]

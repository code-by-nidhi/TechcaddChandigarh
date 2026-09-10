import type { AiKnowledgeEntry, BaseEntity } from '../../types'
import { request } from '../client'
import { createHttpResource } from '../http/resource'

export type AiKnowledgeCreate = Omit<AiKnowledgeEntry, keyof BaseEntity | 'hits'>
export type AiKnowledgeUpdate = Partial<AiKnowledgeCreate>

export const aiKnowledgeApi = createHttpResource<
  AiKnowledgeEntry,
  AiKnowledgeCreate,
  AiKnowledgeUpdate
>('/ai-knowledge')

export const aiKnowledgeCategories = () => request<{ items: string[] }>('/ai-knowledge/categories')

/**
 * Runs a question against the knowledge base.
 *
 * How an editor checks a new entry is actually reachable before publishing it —
 * the failure this module is most prone to is an answer nobody's phrasing ever
 * matches.
 */
export interface KnowledgeMatch {
  id: string
  question: string
  answer: string
  category: string
  score: number
}

export const tryKnowledge = (q: string) =>
  request<{ items: KnowledgeMatch[] }>('/ai-knowledge/try', { query: { q } })

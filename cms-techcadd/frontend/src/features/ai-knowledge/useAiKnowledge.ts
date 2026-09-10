import { useQuery } from '@tanstack/react-query'

import { aiKnowledgeApi, aiKnowledgeCategories, tryKnowledge } from '../../api'
import { createResourceHooks } from '../shared/createResourceHooks'

export const knowledgeHooks = createResourceHooks('ai-knowledge', aiKnowledgeApi)

export function useKnowledgeCategories() {
  return useQuery({ queryKey: ['ai-knowledge', 'categories'], queryFn: aiKnowledgeCategories })
}

/**
 * Runs a question against the knowledge base.
 *
 * Only fires once there is something to ask, so opening the form does not
 * search for an empty string.
 */
export function useKnowledgeTry(question: string) {
  return useQuery({
    queryKey: ['ai-knowledge', 'try', question],
    queryFn: () => tryKnowledge(question),
    enabled: question.trim().length > 2,
  })
}

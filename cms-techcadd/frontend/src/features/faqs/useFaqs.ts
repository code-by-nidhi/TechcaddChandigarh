import { useQuery } from '@tanstack/react-query'

import { faqsApi } from '../../api'
import { request } from '../../api/client'
import { createResourceHooks } from '../shared/createResourceHooks'

export const faqHooks = createResourceHooks('faqs', faqsApi)

/**
 * The categories FAQs are actually filed under.
 *
 * `faqs.category` is a plain string on the record, not a row in a table, so
 * there is no list of categories to read — the API derives it with a
 * `SELECT DISTINCT` over the questions themselves.
 *
 * That has a useful consequence: a category cannot outlive its last question.
 * Move or delete the final FAQ in "Fees" and the category simply stops
 * existing, with nothing to tidy up.
 */
export function useFaqCategories() {
  return useQuery({
    queryKey: ['faqs', 'categories'],
    queryFn: () => request<{ items: string[] }>('/faqs/categories'),
  })
}

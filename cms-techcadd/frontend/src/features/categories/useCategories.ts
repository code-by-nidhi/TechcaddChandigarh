import { useQuery } from '@tanstack/react-query'

import { blogsApi, categoriesApi } from '../../api'
import { createResourceHooks } from '../shared/createResourceHooks'

export const categoryHooks = createResourceHooks('categories', categoriesApi)

/**
 * How many blog posts sit in each category.
 *
 * Deleting a category that still holds posts would orphan them, and the
 * database refuses it anyway — the foreign key is ON DELETE RESTRICT. Counting
 * here is what lets the list say which category is in use and by how much,
 * rather than letting an editor click delete and receive a constraint error.
 *
 * This counted courses until the Courses module was removed. Blog posts are now
 * the only thing categories classify.
 */
export function useCategoryUsage() {
  return useQuery({
    queryKey: ['categories', 'post-counts'],
    queryFn: async () => {
      const { items } = await blogsApi.list({ page: 1, pageSize: 500 })
      const counts = new Map<string, number>()

      for (const post of items) {
        if (!post.categoryId) continue
        counts.set(post.categoryId, (counts.get(post.categoryId) ?? 0) + 1)
      }

      return counts
    },
  })
}

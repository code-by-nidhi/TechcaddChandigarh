import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { bulkCommentStatus, commentsApi, pendingComments } from '../../api'
import type { Comment } from '../../types'
import { createResourceHooks } from '../shared/createResourceHooks'

export const commentHooks = createResourceHooks('comments', commentsApi)

/** The badge in the sidebar, and the count on the queue heading. */
export function usePendingComments() {
  return useQuery({ queryKey: ['comments', 'pending-count'], queryFn: pendingComments })
}

/**
 * Approve or bin a selection in one request.
 *
 * A queue is worked in batches — approving forty comments one at a time is
 * forty round trips and forty cache invalidations.
 */
export function useBulkCommentStatus() {
  const client = useQueryClient()
  return useMutation({
    mutationFn: ({ ids, status }: { ids: string[]; status: Comment['status'] }) =>
      bulkCommentStatus(ids, status),
    onSuccess: () => client.invalidateQueries({ queryKey: ['comments'] }),
  })
}

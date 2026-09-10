import type { Comment } from '../../types'
import { request } from '../client'
import { createHttpResource } from '../http/resource'

/**
 * Moderation only.
 *
 * `create` is unreachable in practice — comments arrive through the public
 * endpoint — and the update type is narrowed to the status, because that is the
 * only thing staff may change.
 */
export type CommentUpdate = { status: Comment['status'] }

export const commentsApi = createHttpResource<Comment, never, CommentUpdate>('/comments')

/** How many are waiting, for the badge in the sidebar. */
export const pendingComments = () => request<{ count: number }>('/comments/pending-count')

/** Working the queue in batches is the normal case, not the exception. */
export const bulkCommentStatus = (ids: string[], status: Comment['status']) =>
  request<{ updated: number }>('/comments/bulk-status', {
    method: 'POST',
    body: { ids, status },
  })

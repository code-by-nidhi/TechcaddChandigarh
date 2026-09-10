import type { ActivityEntry, Contribution } from '../../types'
import type { ListParams, ListResult } from '../types'
import { request } from '../client'

/**
 * Read-only, and not a `Resource`.
 *
 * The audit trail is append-only: there is no create, update or delete, because
 * a log an administrator can edit is not evidence of anything.
 */
export const listActivity = (params: ListParams) =>
  request<ListResult<ActivityEntry>>('/activity', {
    query: {
      page: params.page,
      pageSize: params.pageSize,
      q: params.search,
      sort: params.sort?.field,
      dir: params.sort?.dir,
      ...(params.filters as Record<string, string | string[] | undefined>),
    },
  })

export const listContributions = (days: number) =>
  request<{ days: number; items: Contribution[] }>('/activity/contributions', { query: { days } })

import { useQuery } from '@tanstack/react-query'

import { listActivity } from '../../api'
import type { ListParams } from '../../api'

/** Read-only: the audit trail is append-only, so there is nothing to mutate. */
export function useActivity(params: ListParams) {
  return useQuery({ queryKey: ['activity', 'list', params], queryFn: () => listActivity(params) })
}

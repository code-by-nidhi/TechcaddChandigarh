import { useQuery } from '@tanstack/react-query'

import { listContributions } from '../../api'

/** Per-person work over a window, derived from the activity log. */
export function useContributions(days: number) {
  return useQuery({
    queryKey: ['activity', 'contributions', days],
    queryFn: () => listContributions(days),
  })
}

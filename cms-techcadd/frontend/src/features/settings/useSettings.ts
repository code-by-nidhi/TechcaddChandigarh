import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { settingsApi } from '../../api'
import type { SiteSettings } from '../../types'

/**
 * Site settings — a singleton, so no list, no id, no `createResourceHooks`.
 *
 * These previously lived in the SEO module because that page happened to be
 * the first thing that read them. They belong here: Settings is the only page
 * that touches them now, and the SEO module was Jalandhar's redirect manager,
 * which this site has no use for.
 */
const SETTINGS_KEY = ['settings'] as const

export function useSettings() {
  return useQuery({
    queryKey: SETTINGS_KEY,
    queryFn: () => settingsApi.get(),
  })
}

export function useUpdateSettings() {
  const client = useQueryClient()

  return useMutation({
    mutationFn: (patch: Partial<SiteSettings>) => settingsApi.update(patch),
    /*
     * The API answers with the merged record, so it is written straight into
     * the cache. Invalidating instead would leave every card on the page
     * showing stale values until the refetch lands.
     */
    onSuccess: (settings) => {
      client.setQueryData(SETTINGS_KEY, settings)
    },
  })
}

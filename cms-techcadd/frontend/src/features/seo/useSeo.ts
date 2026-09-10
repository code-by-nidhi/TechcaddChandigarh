import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { getSeoAudit, getSitemap, redirectsApi, saveSitemap, seoMetaApi } from '../../api'
import type { SitemapSection } from '../../types'
import { createResourceHooks } from '../shared/createResourceHooks'

export const redirectHooks = createResourceHooks('seo-redirects', redirectsApi)
export const seoMetaHooks = createResourceHooks('seo-meta', seoMetaApi)

export function useSitemapSettings() {
  return useQuery({ queryKey: ['seo', 'sitemap'], queryFn: getSitemap })
}

export function useSaveSitemap() {
  const client = useQueryClient()
  return useMutation({
    mutationFn: (sections: SitemapSection[]) => saveSitemap(sections),
    onSuccess: () => client.invalidateQueries({ queryKey: ['seo', 'sitemap'] }),
  })
}

/**
 * The audit.
 *
 * Recomputed on every visit rather than cached for long: it is a snapshot of
 * what is wrong right now, and a stale one would have people fixing things that
 * are already fixed.
 */
export function useSeoAudit() {
  return useQuery({ queryKey: ['seo', 'audit'], queryFn: getSeoAudit, staleTime: 30_000 })
}

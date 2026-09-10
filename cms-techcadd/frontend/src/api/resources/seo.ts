import type {
  BaseEntity,
  Redirect,
  SeoAuditIssue,
  SeoMeta,
  SitemapSection,
} from '../../types'
import { request } from '../client'
import { createHttpResource } from '../http/resource'

/**
 * Four related jobs behind one base path.
 *
 * Redirects and meta are ordinary resources; the sitemap is a single record and
 * the audit is a computed report, so neither fits the five-method shape.
 */
export type RedirectCreate = Omit<Redirect, keyof BaseEntity | 'hits' | 'lastHitAt'>
export type RedirectUpdate = Partial<RedirectCreate>

export const redirectsApi = createHttpResource<Redirect, RedirectCreate, RedirectUpdate>(
  '/seo/redirects',
)

export type SeoMetaCreate = Omit<SeoMeta, keyof BaseEntity>
export type SeoMetaUpdate = Partial<SeoMetaCreate>

export const seoMetaApi = createHttpResource<SeoMeta, SeoMetaCreate, SeoMetaUpdate>('/seo/meta')

export const getSitemap = () => request<{ sections: SitemapSection[] }>('/seo/sitemap')

export const saveSitemap = (sections: SitemapSection[]) =>
  request<{ sections: SitemapSection[] }>('/seo/sitemap', { method: 'PUT', body: { sections } })

export const getSeoAudit = () =>
  request<{ items: SeoAuditIssue[]; errors: number; warnings: number }>('/seo/audit')

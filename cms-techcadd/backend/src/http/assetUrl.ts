import type { Request } from 'express'

import { config } from '../config.js'

/**
 * Turns a stored media path into an address another origin can load.
 *
 * Media is stored as a site-relative path (`/uploads/<name>`) so the database
 * survives a change of domain. That works for the CMS, which is told where the
 * API is — but the public website renders these into `<img src>` on a
 * different origin, where `/uploads/…` resolves against the website and yields
 * a broken image.
 *
 * The origin is taken from the request rather than hard-coded, so the same
 * build serves localhost and production without configuration. Set
 * `PUBLIC_ASSET_BASE_URL` to override it — needed when the API sits behind a
 * proxy that rewrites the host, or when uploads are fronted by a CDN.
 */
export function assetUrl(req: Request, path: unknown): string {
  if (typeof path !== 'string' || !path) return ''
  if (/^(https?:)?\/\//i.test(path) || path.startsWith('data:')) return path

  const base = (config.PUBLIC_ASSET_BASE_URL ?? `${req.protocol}://${req.get('host') ?? ''}`).replace(
    /\/$/,
    '',
  )
  return `${base}${path.startsWith('/') ? '' : '/'}${path}`
}

/**
 * Rewrites every stored media path in a response so another origin can load it.
 *
 * The blog router calls `assetUrl` field by field because it hand-builds its
 * responses. The rest of the public API returns the repositories' own shapes,
 * which carry `/uploads/<name>` verbatim — correct for the CMS, which is told
 * where the API is, and broken for the website, where it resolves against the
 * website's own origin and 404s.
 *
 * Rewriting by value rather than by field name is deliberate: a media path is
 * recognisable on sight, and matching on names would have to be kept in step
 * with every repository that grows a new image slot. Nothing else in these
 * responses can begin `/uploads/`.
 */
export function withAssetUrls<T>(req: Request, value: T): T {
  if (typeof value === 'string') {
    return (value.startsWith('/uploads/') ? assetUrl(req, value) : value) as T
  }

  if (Array.isArray(value)) {
    return value.map((entry) => withAssetUrls(req, entry)) as T
  }

  // Plain objects only. A Date or a Buffer must be handed back untouched.
  if (value !== null && typeof value === 'object' && Object.getPrototypeOf(value) === Object.prototype) {
    const out: Record<string, unknown> = {}
    for (const [key, entry] of Object.entries(value)) out[key] = withAssetUrls(req, entry)
    return out as T
  }

  return value
}

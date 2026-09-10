import { Router } from 'express'
import { z } from 'zod'

import { asyncHandler, badRequest } from '../../http/errors.js'
import { withAssetUrls } from '../../http/assetUrl.js'
import { parseListParams } from '../../http/listParams.js'
import { requireParam } from '../../http/params.js'
import { requireAuth, requireWrite } from '../../middleware/auth.js'
import * as repo from './seo.repo.js'
import {
  redirectPatchSchema,
  redirectSchema,
  seoMetaPatchSchema,
  seoMetaSchema,
  sitemapSettingsSchema,
} from './seo.schema.js'

/**
 * One router for four related jobs — redirects, per-route meta, sitemap
 * settings and the audit — because they are one screen in the CMS with four
 * tabs, and splitting them across four routers would give the frontend four
 * base paths to keep in step for no gain.
 */
export const seoRouter = Router()

seoRouter.use(requireAuth)

const deleteSchema = z.object({ ids: z.array(z.string().min(1)).min(1) })

/* ------------------------------- Redirects ------------------------------- */

seoRouter.get(
  '/redirects',
  asyncHandler(async (req, res) => {
    res.json(await repo.listRedirects(parseListParams(req)))
  }),
)

seoRouter.post(
  '/redirects',
  requireWrite,
  asyncHandler(async (req, res) => {
    res.status(201).json(await repo.createRedirect(redirectSchema.parse(req.body)))
  }),
)

seoRouter.patch(
  '/redirects/:id',
  requireWrite,
  asyncHandler(async (req, res) => {
    res.json(
      await repo.updateRedirect(requireParam(req, 'id'), redirectPatchSchema.parse(req.body)),
    )
  }),
)

seoRouter.delete(
  '/redirects',
  requireWrite,
  asyncHandler(async (req, res) => {
    const parsed = deleteSchema.safeParse(req.body)
    if (!parsed.success) throw badRequest('Provide the ids to delete.')

    await repo.removeRedirects(parsed.data.ids)
    res.status(204).end()
  }),
)

/* --------------------------------- Meta ---------------------------------- */

seoRouter.get(
  '/meta',
  asyncHandler(async (req, res) => {
    res.json(withAssetUrls(req, await repo.listMeta(parseListParams(req))))
  }),
)

seoRouter.get(
  '/meta/:id',
  asyncHandler(async (req, res) => {
    res.json(withAssetUrls(req, await repo.getMeta(requireParam(req, 'id'))))
  }),
)

/** An upsert: a route has at most one override — see the note in the repo. */
seoRouter.post(
  '/meta',
  requireWrite,
  asyncHandler(async (req, res) => {
    res.status(201).json(withAssetUrls(req, await repo.upsertMeta(seoMetaSchema.parse(req.body))))
  }),
)

seoRouter.patch(
  '/meta/:id',
  requireWrite,
  asyncHandler(async (req, res) => {
    res.json(
      withAssetUrls(
        req,
        await repo.updateMeta(requireParam(req, 'id'), seoMetaPatchSchema.parse(req.body)),
      ),
    )
  }),
)

seoRouter.delete(
  '/meta',
  requireWrite,
  asyncHandler(async (req, res) => {
    const parsed = deleteSchema.safeParse(req.body)
    if (!parsed.success) throw badRequest('Provide the ids to delete.')

    await repo.removeMeta(parsed.data.ids)
    res.status(204).end()
  }),
)

/* -------------------------------- Sitemap -------------------------------- */

seoRouter.get(
  '/sitemap',
  asyncHandler(async (_req, res) => {
    res.json(await repo.getSitemapSettings())
  }),
)

seoRouter.put(
  '/sitemap',
  requireWrite,
  asyncHandler(async (req, res) => {
    res.json(await repo.saveSitemapSettings(sitemapSettingsSchema.parse(req.body)))
  }),
)

/* --------------------------------- Audit --------------------------------- */

seoRouter.get(
  '/audit',
  asyncHandler(async (_req, res) => {
    const issues = await repo.audit()
    res.json({
      items: issues,
      errors: issues.filter((issue) => issue.severity === 'error').length,
      warnings: issues.filter((issue) => issue.severity === 'warning').length,
    })
  }),
)

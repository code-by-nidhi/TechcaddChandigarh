import { Router } from 'express'
import { z } from 'zod'

import { asyncHandler, badRequest } from '../../http/errors.js'
import { withAssetUrls } from '../../http/assetUrl.js'
import { parseListParams } from '../../http/listParams.js'
import { requireParam } from '../../http/params.js'
import { requireAuth, requireRole } from '../../middleware/auth.js'
import * as repo from './pages.repo.js'
import { OVERRIDABLE_ROUTES, pagePatchSchema, pageSchema } from './pages.schema.js'

export const pagesRouter = Router()

pagesRouter.use(requireAuth)

pagesRouter.get(
  '/',
  asyncHandler(async (req, res) => {
    res.json(withAssetUrls(req, await repo.list(parseListParams(req))))
  }),
)

/**
 * The routes an override may target.
 *
 * Served so the form can offer a dropdown rather than asking an editor to type
 * a path and discover on save that it was not one of the allowed ones. Before
 * '/:id', or "overridable-routes" is read as an id.
 */
pagesRouter.get(
  '/overridable-routes',
  asyncHandler(async (_req, res) => {
    res.json({ items: OVERRIDABLE_ROUTES })
  }),
)

pagesRouter.get(
  '/:id',
  asyncHandler(async (req, res) => {
    res.json(withAssetUrls(req, await repo.get(requireParam(req, 'id'))))
  }),
)

pagesRouter.post(
  '/',
  requireRole('admin'),
  asyncHandler(async (req, res) => {
    res.status(201).json(withAssetUrls(req, await repo.create(pageSchema.parse(req.body))))
  }),
)

pagesRouter.patch(
  '/:id',
  requireRole('admin'),
  asyncHandler(async (req, res) => {
    res.json(
      withAssetUrls(
        req,
        await repo.update(requireParam(req, 'id'), pagePatchSchema.parse(req.body)),
      ),
    )
  }),
)

const deleteSchema = z.object({ ids: z.array(z.string().min(1)).min(1) })

pagesRouter.delete(
  '/',
  requireRole('admin'),
  asyncHandler(async (req, res) => {
    const parsed = deleteSchema.safeParse(req.body)
    if (!parsed.success) throw badRequest('Provide the ids to delete.')

    await repo.remove(parsed.data.ids)
    res.status(204).end()
  }),
)

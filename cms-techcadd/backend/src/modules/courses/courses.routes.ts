import { Router } from 'express'
import { z } from 'zod'

import { asyncHandler, badRequest } from '../../http/errors.js'
import { withAssetUrls } from '../../http/assetUrl.js'
import { parseListParams } from '../../http/listParams.js'
import { requireParam } from '../../http/params.js'
import { requireAuth, requireRole } from '../../middleware/auth.js'
import * as repo from './courses.repo.js'
import { coursePatchSchema, courseSchema } from './courses.schema.js'

export const coursesRouter = Router()

coursesRouter.use(requireAuth)

coursesRouter.get(
  '/',
  asyncHandler(async (req, res) => {
    res.json(withAssetUrls(req, await repo.list(parseListParams(req))))
  }),
)

coursesRouter.get(
  '/:id',
  asyncHandler(async (req, res) => {
    res.json(withAssetUrls(req, await repo.get(requireParam(req, 'id'))))
  }),
)

coursesRouter.post(
  '/',
  requireRole('admin'),
  asyncHandler(async (req, res) => {
    res.status(201).json(withAssetUrls(req, await repo.create(courseSchema.parse(req.body))))
  }),
)

coursesRouter.patch(
  '/:id',
  requireRole('admin'),
  asyncHandler(async (req, res) => {
    res.json(
      withAssetUrls(
        req,
        await repo.update(requireParam(req, 'id'), coursePatchSchema.parse(req.body)),
      ),
    )
  }),
)

const deleteSchema = z.object({ ids: z.array(z.string().min(1)).min(1) })

coursesRouter.delete(
  '/',
  requireRole('admin'),
  asyncHandler(async (req, res) => {
    const parsed = deleteSchema.safeParse(req.body)
    if (!parsed.success) throw badRequest('Provide the ids to delete.')

    await repo.remove(parsed.data.ids)
    res.status(204).end()
  }),
)

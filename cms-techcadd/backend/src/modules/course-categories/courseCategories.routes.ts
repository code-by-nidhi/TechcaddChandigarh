import { Router } from 'express'
import { z } from 'zod'

import { asyncHandler, badRequest } from '../../http/errors.js'
import { parseListParams } from '../../http/listParams.js'
import { requireParam } from '../../http/params.js'
import { requireAuth, requireRole } from '../../middleware/auth.js'
import * as repo from './courseCategories.repo.js'
import {
  CATEGORY_ICONS,
  courseCategoryPatchSchema,
  courseCategorySchema,
} from './courseCategories.schema.js'

export const courseCategoriesRouter = Router()

courseCategoriesRouter.use(requireAuth)

courseCategoriesRouter.get(
  '/',
  asyncHandler(async (req, res) => {
    res.json(await repo.list(parseListParams(req)))
  }),
)

/**
 * The icons the website can actually draw.
 *
 * Served so the form offers a picker rather than asking an editor to type a
 * name and discover on the live page that it renders an empty square. Before
 * '/:id', or "icons" is read as an id.
 */
courseCategoriesRouter.get(
  '/icons',
  asyncHandler(async (_req, res) => {
    res.json({ items: CATEGORY_ICONS })
  }),
)

courseCategoriesRouter.get(
  '/:id',
  asyncHandler(async (req, res) => {
    res.json(await repo.get(requireParam(req, 'id')))
  }),
)

courseCategoriesRouter.post(
  '/',
  requireRole('admin'),
  asyncHandler(async (req, res) => {
    res.status(201).json(await repo.create(courseCategorySchema.parse(req.body)))
  }),
)

courseCategoriesRouter.patch(
  '/:id',
  requireRole('admin'),
  asyncHandler(async (req, res) => {
    res.json(await repo.update(requireParam(req, 'id'), courseCategoryPatchSchema.parse(req.body)))
  }),
)

const deleteSchema = z.object({ ids: z.array(z.string().min(1)).min(1) })

courseCategoriesRouter.delete(
  '/',
  requireRole('admin'),
  asyncHandler(async (req, res) => {
    const parsed = deleteSchema.safeParse(req.body)
    if (!parsed.success) throw badRequest('Provide the ids to delete.')

    await repo.remove(parsed.data.ids)
    res.status(204).end()
  }),
)

import { Router } from 'express'
import { z } from 'zod'

import { asyncHandler, badRequest } from '../../http/errors.js'
import { parseListParams } from '../../http/listParams.js'
import { requireParam } from '../../http/params.js'
import { requireAuth, requireRole } from '../../middleware/auth.js'
import * as repo from './newsletter.repo.js'
import { subscriberPatchSchema } from './newsletter.schema.js'

/**
 * The administrator's view of the mailing list.
 *
 * There is no create route: a subscriber is someone who chose to subscribe,
 * and an address added here would be one nobody consented to being mailed.
 * The public form at `/api/public/newsletter/subscribe` is the only way in.
 */
export const newsletterRouter = Router()

newsletterRouter.use(requireAuth)

newsletterRouter.get(
  '/',
  asyncHandler(async (req, res) => {
    res.json(await repo.list(parseListParams(req)))
  }),
)

newsletterRouter.get(
  '/:id',
  asyncHandler(async (req, res) => {
    res.json(await repo.get(requireParam(req, 'id')))
  }),
)

newsletterRouter.patch(
  '/:id',
  requireRole('admin'),
  asyncHandler(async (req, res) => {
    res.json(await repo.update(requireParam(req, 'id'), subscriberPatchSchema.parse(req.body)))
  }),
)

const deleteSchema = z.object({ ids: z.array(z.string().min(1)).min(1) })

newsletterRouter.delete(
  '/',
  requireRole('admin'),
  asyncHandler(async (req, res) => {
    const parsed = deleteSchema.safeParse(req.body)
    if (!parsed.success) throw badRequest('Provide the ids to delete.')

    await repo.remove(parsed.data.ids)
    res.status(204).end()
  }),
)

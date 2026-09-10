import { Router } from 'express'
import { z } from 'zod'

import { asyncHandler, badRequest } from '../../http/errors.js'
import { parseListParams } from '../../http/listParams.js'
import { requireParam } from '../../http/params.js'
import { requireAuth, requireWrite } from '../../middleware/auth.js'
import * as repo from './comments.repo.js'
import { commentPatchSchema } from './comments.schema.js'

export const commentsRouter = Router()

commentsRouter.use(requireAuth)

commentsRouter.get(
  '/',
  asyncHandler(async (req, res) => {
    res.json(await repo.list(parseListParams(req)))
  }),
)

// Before '/:id', or "pending-count" is read as an id.
commentsRouter.get(
  '/pending-count',
  asyncHandler(async (_req, res) => {
    res.json({ count: await repo.pendingCount() })
  }),
)

commentsRouter.get(
  '/:id',
  asyncHandler(async (req, res) => {
    res.json(await repo.get(requireParam(req, 'id')))
  }),
)

/**
 * The moderation decision.
 *
 * There is no create and no full update: a comment is written by a visitor, and
 * the only thing staff change about it is whether it is published.
 */
commentsRouter.patch(
  '/:id',
  requireWrite,
  asyncHandler(async (req, res) => {
    res.json(await repo.update(requireParam(req, 'id'), commentPatchSchema.parse(req.body)))
  }),
)

/** Approving or binning a batch is the normal way this queue gets worked. */
const bulkSchema = z.object({
  ids: z.array(z.string().min(1)).min(1),
  status: z.enum(['pending', 'approved', 'spam']),
})

commentsRouter.post(
  '/bulk-status',
  requireWrite,
  asyncHandler(async (req, res) => {
    const parsed = bulkSchema.safeParse(req.body)
    if (!parsed.success) throw badRequest('Provide the ids and a status.')

    for (const id of parsed.data.ids) {
      await repo.update(id, { status: parsed.data.status })
    }
    res.json({ updated: parsed.data.ids.length })
  }),
)

const deleteSchema = z.object({ ids: z.array(z.string().min(1)).min(1) })

commentsRouter.delete(
  '/',
  requireWrite,
  asyncHandler(async (req, res) => {
    const parsed = deleteSchema.safeParse(req.body)
    if (!parsed.success) throw badRequest('Provide the ids to delete.')

    await repo.remove(parsed.data.ids)
    res.status(204).end()
  }),
)

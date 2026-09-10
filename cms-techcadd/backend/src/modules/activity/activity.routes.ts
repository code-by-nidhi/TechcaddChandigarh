import { Router } from 'express'
import { z } from 'zod'

import { asyncHandler } from '../../http/errors.js'
import { parseListParams } from '../../http/listParams.js'
import { requireAuth, requireWrite } from '../../middleware/auth.js'
import * as repo from './activity.repo.js'

export const activityRouter = Router()

activityRouter.use(requireAuth)

activityRouter.get(
  '/',
  asyncHandler(async (req, res) => {
    res.json(await repo.list(parseListParams(req)))
  }),
)

/**
 * Per-person work, for the contributions report.
 *
 * Before '/:id' would matter if this module had one — it does not, because a
 * single log entry is never looked at on its own.
 */
const windowSchema = z.coerce.number().int().min(1).max(365).default(30)

activityRouter.get(
  '/contributions',
  asyncHandler(async (req, res) => {
    const days = windowSchema.parse(req.query.days ?? 30)
    res.json({ days, items: await repo.contributions(days) })
  }),
)

/**
 * Retention.
 *
 * Admin-only and deliberately blunt: it takes an age, not a list of ids, so it
 * cannot be used to remove one inconvenient entry. The minimum is 30 days so a
 * careless call cannot empty the log.
 */
const pruneSchema = z.object({ olderThanDays: z.number().int().min(30).max(3650) })

activityRouter.post(
  '/prune',
  requireWrite,
  asyncHandler(async (req, res) => {
    const { olderThanDays } = pruneSchema.parse(req.body)
    res.json({ removed: await repo.prune(olderThanDays) })
  }),
)

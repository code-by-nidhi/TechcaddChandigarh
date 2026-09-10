import { Router } from 'express'
import { z } from 'zod'

import { asyncHandler, badRequest } from '../../http/errors.js'
import { parseListParams } from '../../http/listParams.js'
import { requireParam } from '../../http/params.js'
import { requireAuth, requireWrite } from '../../middleware/auth.js'
import * as repo from './aiKnowledge.repo.js'
import { aiKnowledgePatchSchema, aiKnowledgeSchema } from './aiKnowledge.schema.js'

export const aiKnowledgeRouter = Router()

aiKnowledgeRouter.use(requireAuth)

aiKnowledgeRouter.get(
  '/',
  asyncHandler(async (req, res) => {
    res.json(await repo.list(parseListParams(req)))
  }),
)

// Both before '/:id', or they are read as ids.
aiKnowledgeRouter.get(
  '/categories',
  asyncHandler(async (_req, res) => {
    res.json({ items: await repo.categories() })
  }),
)

/**
 * Try a question against the knowledge base.
 *
 * Behind the session because it is a staff tool: it is how an editor checks
 * that a new entry is actually reachable before publishing it, which is the
 * failure this module is most prone to. The visitor-facing search lives on the
 * public router.
 */
aiKnowledgeRouter.get(
  '/try',
  asyncHandler(async (req, res) => {
    const question = typeof req.query.q === 'string' ? req.query.q : ''
    res.json({ items: await repo.search(question, 5) })
  }),
)

aiKnowledgeRouter.get(
  '/:id',
  asyncHandler(async (req, res) => {
    res.json(await repo.get(requireParam(req, 'id')))
  }),
)

aiKnowledgeRouter.post(
  '/',
  requireWrite,
  asyncHandler(async (req, res) => {
    res.status(201).json(await repo.create(aiKnowledgeSchema.parse(req.body)))
  }),
)

aiKnowledgeRouter.patch(
  '/:id',
  requireWrite,
  asyncHandler(async (req, res) => {
    res.json(await repo.update(requireParam(req, 'id'), aiKnowledgePatchSchema.parse(req.body)))
  }),
)

const deleteSchema = z.object({ ids: z.array(z.string().min(1)).min(1) })

aiKnowledgeRouter.delete(
  '/',
  requireWrite,
  asyncHandler(async (req, res) => {
    const parsed = deleteSchema.safeParse(req.body)
    if (!parsed.success) throw badRequest('Provide the ids to delete.')

    await repo.remove(parsed.data.ids)
    res.status(204).end()
  }),
)

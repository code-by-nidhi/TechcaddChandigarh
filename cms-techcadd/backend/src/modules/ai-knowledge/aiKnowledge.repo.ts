import { randomUUID } from 'node:crypto'

import { execute, query, queryOne, type Row } from '../../db/pool.js'
import { notFound } from '../../http/errors.js'
import {
  buildFilters,
  resolveSort,
  type ListParams,
  type ListResult,
} from '../../http/listParams.js'
import type { AiKnowledgeInput, AiKnowledgePatch } from './aiKnowledge.schema.js'

const SORTABLE: Record<string, string> = {
  question: 'k.question',
  category: 'k.category',
  order: 'k.sort_order',
  hits: 'k.hits',
  status: 'k.status',
  updatedAt: 'k.updated_at',
}

const FILTERABLE: Record<string, string> = {
  status: 'k.status',
  category: 'k.category',
  updatedAt: 'k.updated_at',
}

function toEntry(row: Row): unknown {
  return {
    id: row.id,
    question: row.question,
    answer: row.answer,
    category: row.category,
    keywords: row.keywords ?? '',
    hits: Number(row.hits),
    order: Number(row.sort_order),
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

export async function list(params: ListParams): Promise<ListResult<unknown>> {
  const { sql: filterSql, params: filterParams } = buildFilters(params.filters, FILTERABLE)
  const { column, dir } = resolveSort(params.sort, SORTABLE, { column: 'k.sort_order', dir: 'asc' })

  const searchSql = params.search
    ? ' AND (k.question LIKE ? OR k.answer LIKE ? OR k.keywords LIKE ?)'
    : ''
  const like = `%${params.search ?? ''}%`
  const searchParams = params.search ? [like, like, like] : []

  const where = `WHERE 1=1${filterSql}${searchSql}`
  const whereParams = [...filterParams, ...searchParams]

  const totalRow = await queryOne<{ total: number }>(
    `SELECT COUNT(*) AS total FROM ai_knowledge k ${where}`,
    whereParams,
  )

  const offset = (params.page - 1) * params.pageSize
  const rows = await query<Row>(
    `SELECT k.* FROM ai_knowledge k ${where} ORDER BY k.category ASC, ${column} ${dir} LIMIT ? OFFSET ?`,
    [...whereParams, params.pageSize, offset],
  )

  return {
    items: rows.map(toEntry),
    total: Number(totalRow?.total ?? 0),
    page: params.page,
    pageSize: params.pageSize,
  }
}

export async function get(id: string): Promise<unknown> {
  const row = await queryOne<Row>('SELECT k.* FROM ai_knowledge k WHERE k.id = ? LIMIT 1', [id])
  if (!row) throw notFound('Knowledge entry')
  return toEntry(row)
}

export async function create(input: AiKnowledgeInput): Promise<unknown> {
  const id = randomUUID()
  await execute(
    `INSERT INTO ai_knowledge
       (id, question, answer, category, keywords, sort_order, status, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, NOW(3), NOW(3))`,
    [id, input.question, input.answer, input.category, input.keywords || null, input.order, input.status],
  )
  return get(id)
}

export async function update(id: string, patch: AiKnowledgePatch): Promise<unknown> {
  const existing = await queryOne<Row>('SELECT id FROM ai_knowledge WHERE id = ? LIMIT 1', [id])
  if (!existing) throw notFound('Knowledge entry')

  const mapping: Record<string, string> = {
    question: 'question',
    answer: 'answer',
    category: 'category',
    order: 'sort_order',
    status: 'status',
  }

  const assignments: string[] = []
  const params: unknown[] = []

  for (const [key, column] of Object.entries(mapping)) {
    const value = patch[key as keyof AiKnowledgePatch]
    if (value === undefined) continue
    assignments.push(`${column} = ?`)
    params.push(value)
  }

  // Empty clears it rather than storing a blank string the matcher would then
  // have to skip over.
  if (patch.keywords !== undefined) {
    assignments.push('keywords = ?')
    params.push(patch.keywords || null)
  }

  if (assignments.length > 0) {
    await execute(
      `UPDATE ai_knowledge SET ${assignments.join(', ')}, updated_at = NOW(3) WHERE id = ?`,
      [...params, id],
    )
  }

  return get(id)
}

export async function remove(ids: string[]): Promise<void> {
  if (ids.length === 0) return
  await execute(`DELETE FROM ai_knowledge WHERE id IN (${ids.map(() => '?').join(',')})`, ids)
}

/** The distinct categories in use, so the form can offer them. */
export async function categories(): Promise<string[]> {
  const rows = await query<{ category: string }>(
    'SELECT DISTINCT category FROM ai_knowledge ORDER BY category',
  )
  return rows.map((row) => row.category)
}

/* ------------------------------------------------------------------ */
/* Retrieval                                                           */
/* ------------------------------------------------------------------ */

export interface Match {
  id: string
  question: string
  answer: string
  category: string
  score: number
}

/**
 * The entries that best answer a visitor's question.
 *
 * MySQL's full-text index does the ranking, in natural-language mode over the
 * question, its alternate phrasings and the answer. A `LIKE` scan was the
 * alternative and is wrong for this: it cannot rank, so "fees" and a passing
 * mention of the word in an unrelated answer come back indistinguishable.
 *
 * The `LIKE` fallback below is not a second implementation of the same thing —
 * it covers the case full-text cannot: a query made entirely of words shorter
 * than the index's minimum token length, or of stopwords, where the match set
 * is empty rather than merely badly ranked.
 */
export async function search(question: string, limit = 3): Promise<Match[]> {
  const trimmed = question.trim()
  if (!trimmed) return []

  const rows = await query<Row>(
    `SELECT id, question, answer, category,
            MATCH(question, keywords, answer) AGAINST (? IN NATURAL LANGUAGE MODE) AS score
       FROM ai_knowledge
      WHERE status = 'published'
        AND MATCH(question, keywords, answer) AGAINST (? IN NATURAL LANGUAGE MODE)
      ORDER BY score DESC
      LIMIT ?`,
    [trimmed, trimmed, limit],
  )

  if (rows.length > 0) {
    return rows.map((row) => ({
      id: row.id as string,
      question: row.question as string,
      answer: row.answer as string,
      category: row.category as string,
      score: Number(row.score),
    }))
  }

  const like = `%${trimmed}%`
  const fallback = await query<Row>(
    `SELECT id, question, answer, category
       FROM ai_knowledge
      WHERE status = 'published'
        AND (question LIKE ? OR keywords LIKE ?)
      ORDER BY sort_order ASC
      LIMIT ?`,
    [like, like, limit],
  )

  return fallback.map((row) => ({
    id: row.id as string,
    question: row.question as string,
    answer: row.answer as string,
    category: row.category as string,
    // No relevance score to report — these matched on substring, not ranking,
    // and inventing a number would imply a confidence that was never computed.
    score: 0,
  }))
}

/**
 * Counts an answer as served.
 *
 * Not awaited by the caller: a visitor should never wait on a counter, and an
 * answer must not be lost to one. `updated_at` is left alone so a hit does not
 * show up as an edit in the CMS listing.
 */
export async function countHit(id: string): Promise<void> {
  try {
    await execute('UPDATE ai_knowledge SET hits = hits + 1 WHERE id = ?', [id])
  } catch (error) {
    console.warn('[ai-knowledge] could not record a hit:', error)
  }
}

import { randomUUID } from 'node:crypto'

import { execute, query, queryOne, type Row } from '../../db/pool.js'
import { notFound } from '../../http/errors.js'
import {
  buildFilters,
  resolveSort,
  type ListParams,
  type ListResult,
} from '../../http/listParams.js'
import type { SubscribeInput, SubscriberPatch } from './newsletter.schema.js'

const SORTABLE: Record<string, string> = {
  email: 'n.email',
  status: 'n.status',
  source: 'n.source',
  subscribedAt: 'n.subscribed_at',
  createdAt: 'n.created_at',
  updatedAt: 'n.updated_at',
}

const FILTERABLE: Record<string, string> = {
  status: 'n.status',
  source: 'n.source',
  createdAt: 'n.created_at',
  subscribedAt: 'n.subscribed_at',
}

function toSubscriber(row: Row): unknown {
  return {
    id: row.id,
    email: row.email,
    status: row.status,
    source: row.source,
    subscribedAt: row.subscribed_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

export async function list(params: ListParams): Promise<ListResult<unknown>> {
  const { sql: filterSql, params: filterParams } = buildFilters(params.filters, FILTERABLE)
  const { column, dir } = resolveSort(params.sort, SORTABLE, {
    column: 'n.subscribed_at',
    dir: 'desc',
  })

  const searchSql = params.search ? ' AND n.email LIKE ?' : ''
  const searchParams = params.search ? [`%${params.search}%`] : []

  const where = `WHERE 1=1${filterSql}${searchSql}`
  const whereParams = [...filterParams, ...searchParams]

  const totalRow = await queryOne<{ total: number }>(
    `SELECT COUNT(*) AS total FROM newsletter_subscribers n ${where}`,
    whereParams,
  )

  const offset = (params.page - 1) * params.pageSize
  const rows = await query<Row>(
    `SELECT n.* FROM newsletter_subscribers n ${where} ORDER BY ${column} ${dir} LIMIT ? OFFSET ?`,
    [...whereParams, params.pageSize, offset],
  )

  return {
    items: rows.map(toSubscriber),
    total: Number(totalRow?.total ?? 0),
    page: params.page,
    pageSize: params.pageSize,
  }
}

export async function get(id: string): Promise<unknown> {
  const row = await queryOne<Row>('SELECT * FROM newsletter_subscribers WHERE id = ? LIMIT 1', [id])
  if (!row) throw notFound('Subscriber')
  return toSubscriber(row)
}

export type SubscribeOutcome = 'subscribed' | 'already-subscribed' | 'resubscribed'

/**
 * Records a subscription, whatever state the address was already in.
 *
 * The address is the identity, so a second submission is never a second row.
 * The outcome is returned rather than thrown as a conflict because none of the
 * three cases is an error — the person wanted to be on the list, and now is.
 *
 * The form shows the same reassuring message for all three: telling a stranger
 * "you are already subscribed" confirms that address is on the list, which is
 * not ours to disclose.
 */
export async function subscribe(input: SubscribeInput): Promise<SubscribeOutcome> {
  const email = input.email.toLowerCase()

  const existing = await queryOne<Row>(
    'SELECT id, status FROM newsletter_subscribers WHERE email = ? LIMIT 1',
    [email],
  )

  if (!existing) {
    await execute(
      `INSERT INTO newsletter_subscribers
         (id, email, status, source, subscribed_at, created_at, updated_at)
       VALUES (?, ?, 'active', ?, NOW(3), NOW(3), NOW(3))`,
      [randomUUID(), email, input.source],
    )
    return 'subscribed'
  }

  if (existing.status === 'active') return 'already-subscribed'

  await execute(
    `UPDATE newsletter_subscribers
        SET status = 'active', source = ?, subscribed_at = NOW(3), updated_at = NOW(3)
      WHERE id = ?`,
    [input.source, existing.id],
  )
  return 'resubscribed'
}

export async function update(id: string, patch: SubscriberPatch): Promise<unknown> {
  const existing = await queryOne<Row>(
    'SELECT id FROM newsletter_subscribers WHERE id = ? LIMIT 1',
    [id],
  )
  if (!existing) throw notFound('Subscriber')

  await execute(
    'UPDATE newsletter_subscribers SET status = ?, updated_at = NOW(3) WHERE id = ?',
    [patch.status, id],
  )
  return get(id)
}

export async function remove(ids: string[]): Promise<void> {
  if (ids.length === 0) return
  await query(
    `DELETE FROM newsletter_subscribers WHERE id IN (${ids.map(() => '?').join(',')})`,
    ids,
  )
}

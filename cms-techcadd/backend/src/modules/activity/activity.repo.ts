import { randomUUID } from 'node:crypto'

import { execute, query, queryOne, type Row } from '../../db/pool.js'
import {
  buildFilters,
  resolveSort,
  type ListParams,
  type ListResult,
} from '../../http/listParams.js'

/**
 * The audit trail.
 *
 * Append-only by design: there is no update and no delete, because a log an
 * administrator can edit is not evidence of anything. Old rows are pruned by
 * age (see `prune`), which is a retention policy rather than a way to remove a
 * particular entry.
 */

export type ActivityAction =
  | 'create'
  | 'update'
  | 'delete'
  | 'publish'
  | 'unpublish'
  | 'login'
  | 'logout'

export interface ActivityInput {
  userId?: string
  userName: string
  action: ActivityAction
  entityType: string
  entityId?: string
  entityLabel?: string
  ip?: string
}

const SORTABLE: Record<string, string> = {
  createdAt: 'a.created_at',
  action: 'a.action',
  entityType: 'a.entity_type',
  userName: 'a.user_name',
}

const FILTERABLE: Record<string, string> = {
  action: 'a.action',
  entityType: 'a.entity_type',
  userId: 'a.user_id',
  createdAt: 'a.created_at',
}

function toEntry(row: Row): unknown {
  return {
    id: row.id,
    userId: row.user_id ?? undefined,
    userName: row.user_name,
    action: row.action,
    entityType: row.entity_type,
    entityId: row.entity_id ?? undefined,
    entityLabel: row.entity_label ?? undefined,
    ip: row.ip ?? undefined,
    createdAt: row.created_at,
  }
}

/**
 * Records one action.
 *
 * Never throws. It is called from a response hook after the work it describes
 * has already succeeded, so a failure here must not turn a saved record into
 * an error the editor sees — a missing log line is the lesser loss.
 */
export async function record(input: ActivityInput): Promise<void> {
  try {
    await execute(
      `INSERT INTO activity_log
         (id, user_id, user_name, action, entity_type, entity_id, entity_label, ip, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(3))`,
      [
        randomUUID(),
        input.userId ?? null,
        input.userName,
        input.action,
        input.entityType,
        input.entityId ?? null,
        input.entityLabel?.slice(0, 255) ?? null,
        input.ip?.slice(0, 45) ?? null,
      ],
    )
  } catch (error) {
    console.warn('[activity] could not record an entry:', error)
  }
}

export async function list(params: ListParams): Promise<ListResult<unknown>> {
  const { sql: filterSql, params: filterParams } = buildFilters(params.filters, FILTERABLE)
  // Newest first: a log is read from the top, and the question is nearly always
  // "what just happened".
  const { column, dir } = resolveSort(params.sort, SORTABLE, {
    column: 'a.created_at',
    dir: 'desc',
  })

  const searchSql = params.search
    ? ' AND (a.user_name LIKE ? OR a.entity_label LIKE ? OR a.entity_type LIKE ?)'
    : ''
  const like = `%${params.search ?? ''}%`
  const searchParams = params.search ? [like, like, like] : []

  const where = `WHERE 1=1${filterSql}${searchSql}`
  const whereParams = [...filterParams, ...searchParams]

  const totalRow = await queryOne<{ total: number }>(
    `SELECT COUNT(*) AS total FROM activity_log a ${where}`,
    whereParams,
  )

  const offset = (params.page - 1) * params.pageSize
  const rows = await query<Row>(
    `SELECT a.* FROM activity_log a ${where} ORDER BY ${column} ${dir} LIMIT ? OFFSET ?`,
    [...whereParams, params.pageSize, offset],
  )

  return {
    items: rows.map(toEntry),
    total: Number(totalRow?.total ?? 0),
    page: params.page,
    pageSize: params.pageSize,
  }
}

/**
 * Per-person work, for the contributions report.
 *
 * Grouped on the snapshot name rather than `user_id` so someone whose account
 * was later removed still appears with the work they did — losing an account
 * should not rewrite the record of who wrote the site.
 */
export interface Contribution {
  userId?: string
  userName: string
  created: number
  updated: number
  deleted: number
  published: number
  total: number
  lastActive: string | null
  byModule: { entityType: string; count: number }[]
}

export async function contributions(days: number): Promise<Contribution[]> {
  const rows = await query<Row>(
    `SELECT user_id, user_name,
            SUM(action = 'create')                        AS created,
            SUM(action = 'update')                        AS updated,
            SUM(action = 'delete')                        AS deleted,
            SUM(action IN ('publish','unpublish'))        AS published,
            -- Sign-ins are activity, not contribution. Counting them would put
            -- whoever opens the CMS most often at the top of the table.
            SUM(action NOT IN ('login','logout'))         AS total,
            MAX(created_at)                               AS last_active
       FROM activity_log
      WHERE created_at > NOW() - INTERVAL ? DAY
      GROUP BY user_id, user_name
      ORDER BY total DESC`,
    [days],
  )

  const perModule = await query<Row>(
    `SELECT user_name, entity_type, COUNT(*) AS n
       FROM activity_log
      WHERE created_at > NOW() - INTERVAL ? DAY
        AND action NOT IN ('login','logout')
      GROUP BY user_name, entity_type
      ORDER BY n DESC`,
    [days],
  )

  const modules = new Map<string, { entityType: string; count: number }[]>()
  for (const row of perModule) {
    const key = row.user_name as string
    const entry = { entityType: row.entity_type as string, count: Number(row.n) }
    modules.set(key, [...(modules.get(key) ?? []), entry])
  }

  return rows.map((row) => ({
    userId: (row.user_id as string) ?? undefined,
    userName: row.user_name as string,
    created: Number(row.created),
    updated: Number(row.updated),
    deleted: Number(row.deleted),
    published: Number(row.published),
    total: Number(row.total),
    lastActive: (row.last_active as string) ?? null,
    byModule: modules.get(row.user_name as string) ?? [],
  }))
}

/** Retention. Called by nothing on a timer yet — exposed for an admin to run. */
export async function prune(olderThanDays: number): Promise<number> {
  const result = await execute(
    'DELETE FROM activity_log WHERE created_at < NOW() - INTERVAL ? DAY',
    [olderThanDays],
  )
  return result.affectedRows
}

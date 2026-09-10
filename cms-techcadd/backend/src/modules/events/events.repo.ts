import { randomUUID } from 'node:crypto'
import type { ExecuteValues, PoolConnection, ResultSetHeader } from 'mysql2/promise'

import { execute, query, queryOne, transaction, type Row } from '../../db/pool.js'
import { toStorableId } from '../../db/ids.js'
import { notFound, unprocessable } from '../../http/errors.js'
import {
  buildFilters,
  resolveSort,
  type ListParams,
  type ListResult,
} from '../../http/listParams.js'
import type { AgendaItem, EventInput, EventPatch } from './events.schema.js'

const SORTABLE: Record<string, string> = {
  title: 'e.title',
  date: 'e.event_date',
  type: 'e.event_type',
  status: 'e.status',
  createdAt: 'e.created_at',
  updatedAt: 'e.updated_at',
}

const FILTERABLE: Record<string, string> = {
  status: 'e.status',
  type: 'e.event_type',
  featured: 'e.featured',
  date: 'e.event_date',
  createdAt: 'e.created_at',
  updatedAt: 'e.updated_at',
}

const SELECT_EVENT = `
  SELECT e.*, m.url AS cover_url, m.alt AS cover_alt
    FROM events e
    LEFT JOIN media m ON m.id = e.cover_id
`

/**
 * A DATE column comes back as a JS Date because the pool is configured with
 * `dateStrings: false`. The site and the form both want `YYYY-MM-DD`, and
 * `toISOString` would shift a date near midnight into the previous day for any
 * timezone behind UTC — so the local parts are read directly.
 */
function toDateString(value: unknown): string | null {
  if (!value) return null
  if (typeof value === 'string') return value.slice(0, 10)
  if (value instanceof Date) {
    const month = String(value.getMonth() + 1).padStart(2, '0')
    const day = String(value.getDate()).padStart(2, '0')
    return `${value.getFullYear()}-${month}-${day}`
  }
  return null
}

/**
 * The stored photographs, or an empty list.
 *
 * Validated on the way out as well as in: the column is JSON, so a hand-edited
 * row could hold anything, and an event is better off rendering without its
 * gallery than not rendering at all.
 */
function readPhotos(value: unknown): unknown[] {
  if (value === null || value === undefined) return []
  try {
    const parsed = typeof value === 'string' ? JSON.parse(value) : value
    return Array.isArray(parsed) ? parsed.filter((p) => p && typeof p.id === 'string') : []
  } catch {
    return []
  }
}

function toEvent(row: Row, agenda: AgendaItem[] = []): unknown {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    date: toDateString(row.event_date),
    endDate: toDateString(row.end_date) ?? undefined,
    startTime: row.start_time ?? undefined,
    location: row.location ?? '',
    type: row.event_type,
    excerpt: row.excerpt ?? '',
    body: row.body ?? '',
    cover: row.cover_id
      ? { id: row.cover_id, url: row.cover_url, alt: row.cover_alt ?? '' }
      : undefined,
    photos: readPhotos(row.photos),
    agenda,
    featured: Boolean(row.featured),
    status: row.status,
    seo: {
      metaTitle: row.meta_title ?? undefined,
      metaDescription: row.meta_description ?? undefined,
      // Always an array, never absent: the CMS form requires the field, and a
      // record that omits it cannot be loaded for editing at all.
      keywords: (row.meta_keywords as string[] | null) ?? [],
    },
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

/** One query for a whole page of events rather than one per event. */
async function loadAgenda(ids: string[]): Promise<Map<string, AgendaItem[]>> {
  const map = new Map<string, AgendaItem[]>(ids.map((id) => [id, []]))
  if (ids.length === 0) return map

  const rows = await query<Row>(
    `SELECT id, event_id, time_label, item FROM event_agenda
      WHERE event_id IN (${ids.map(() => '?').join(',')}) ORDER BY sort_order`,
    ids,
  )
  for (const row of rows) {
    map.get(row.event_id as string)?.push({
      id: row.id as string,
      time: row.time_label as string,
      item: row.item as string,
    })
  }

  return map
}

export async function list(params: ListParams): Promise<ListResult<unknown>> {
  const { sql: filterSql, params: filterParams } = buildFilters(params.filters, FILTERABLE)
  // Newest first: the calendar is read forwards from the next event, and a
  // list that opened on something from three years ago would be useless.
  const { column, dir } = resolveSort(params.sort, SORTABLE, { column: 'e.event_date', dir: 'desc' })

  const searchSql = params.search
    ? ' AND (e.title LIKE ? OR e.slug LIKE ? OR e.excerpt LIKE ? OR e.location LIKE ?)'
    : ''
  const like = `%${params.search ?? ''}%`
  const searchParams = params.search ? [like, like, like, like] : []

  const where = `WHERE 1=1${filterSql}${searchSql}`
  const whereParams = [...filterParams, ...searchParams]

  const totalRow = await queryOne<{ total: number }>(
    `SELECT COUNT(*) AS total FROM events e ${where}`,
    whereParams,
  )

  const offset = (params.page - 1) * params.pageSize
  const rows = await query<Row>(
    `${SELECT_EVENT} ${where} ORDER BY ${column} ${dir} LIMIT ? OFFSET ?`,
    [...whereParams, params.pageSize, offset],
  )

  const agenda = await loadAgenda(rows.map((row) => row.id as string))

  return {
    items: rows.map((row) => toEvent(row, agenda.get(row.id as string) ?? [])),
    total: Number(totalRow?.total ?? 0),
    page: params.page,
    pageSize: params.pageSize,
  }
}

export async function get(id: string): Promise<unknown> {
  const row = await queryOne<Row>(`${SELECT_EVENT} WHERE e.id = ? LIMIT 1`, [id])
  if (!row) throw notFound('Event')

  const agenda = await loadAgenda([id])
  return toEvent(row, agenda.get(id) ?? [])
}

/**
 * Rejects a slug already in use.
 *
 * The column is UNIQUE, so this only turns a driver error into a message an
 * editor can act on — the database is still the thing that guarantees it.
 */
async function assertSlugFree(slug: string, exceptId?: string): Promise<void> {
  const row = await queryOne<Row>(
    `SELECT id FROM events WHERE slug = ?${exceptId ? ' AND id <> ?' : ''} LIMIT 1`,
    exceptId ? [slug, exceptId] : [slug],
  )
  if (row) throw unprocessable({ slug: 'This slug is already in use.' })
}

async function writeAgenda(
  connection: PoolConnection,
  eventId: string,
  agenda: AgendaItem[],
): Promise<void> {
  await connection.execute<ResultSetHeader>('DELETE FROM event_agenda WHERE event_id = ?', [eventId])

  let position = 0
  for (const entry of agenda) {
    await connection.execute<ResultSetHeader>(
      `INSERT INTO event_agenda (id, event_id, time_label, item, sort_order)
       VALUES (?, ?, ?, ?, ?)`,
      [toStorableId(entry.id), eventId, entry.time, entry.item, position++],
    )
  }
}

const nullable = (value: string | null | undefined) => (value ? value : null)

export async function create(input: EventInput): Promise<unknown> {
  await assertSlugFree(input.slug)

  const id = randomUUID()
  await transaction(async (connection) => {
    await connection.execute<ResultSetHeader>(
      `INSERT INTO events
         (id, title, slug, event_date, end_date, start_time, location, event_type,
          excerpt, body, cover_id, photos, featured, status,
          meta_title, meta_description, meta_keywords, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(3), NOW(3))`,
      [
        id,
        input.title,
        input.slug,
        input.date,
        nullable(input.endDate),
        nullable(input.startTime),
        input.location,
        input.type,
        nullable(input.excerpt),
        nullable(input.body),
        input.cover?.id ?? null,
        // NULL when empty, so "no photos" is one value rather than two.
        input.photos.length > 0 ? JSON.stringify(input.photos) : null,
        input.featured ? 1 : 0,
        input.status,
        nullable(input.seo?.metaTitle),
        nullable(input.seo?.metaDescription),
        JSON.stringify(input.seo?.keywords ?? []),
      ],
    )
    await writeAgenda(connection, id, input.agenda)
  })

  return get(id)
}

export async function update(id: string, patch: EventPatch): Promise<unknown> {
  const existing = await queryOne<Row>('SELECT id FROM events WHERE id = ? LIMIT 1', [id])
  if (!existing) throw notFound('Event')
  if (patch.slug) await assertSlugFree(patch.slug, id)

  /** Columns whose value is written as given. */
  const direct: Record<string, string> = {
    title: 'title',
    slug: 'slug',
    date: 'event_date',
    location: 'location',
    type: 'event_type',
    status: 'status',
  }

  /** Columns where an empty string means "clear it", not "store a blank". */
  const clearable: Record<string, string> = {
    endDate: 'end_date',
    startTime: 'start_time',
    excerpt: 'excerpt',
    body: 'body',
  }

  await transaction(async (connection) => {
    const assignments: string[] = []
    const params: unknown[] = []

    for (const [key, column] of Object.entries(direct)) {
      const value = patch[key as keyof EventPatch]
      if (value === undefined) continue
      assignments.push(`${column} = ?`)
      params.push(value)
    }

    for (const [key, column] of Object.entries(clearable)) {
      const value = patch[key as keyof EventPatch]
      if (value === undefined) continue
      assignments.push(`${column} = ?`)
      params.push(nullable(value as string | null | undefined))
    }

    if (patch.photos !== undefined) {
      assignments.push('photos = ?')
      params.push(patch.photos.length > 0 ? JSON.stringify(patch.photos) : null)
    }

    if (patch.cover !== undefined) {
      assignments.push('cover_id = ?')
      params.push(patch.cover?.id ?? null)
    }

    if (patch.featured !== undefined) {
      assignments.push('featured = ?')
      params.push(patch.featured ? 1 : 0)
    }

    if (patch.seo !== undefined) {
      assignments.push('meta_title = ?', 'meta_description = ?', 'meta_keywords = ?')
      params.push(
        nullable(patch.seo?.metaTitle),
        nullable(patch.seo?.metaDescription),
        JSON.stringify(patch.seo?.keywords ?? []),
      )
    }

    if (assignments.length > 0) {
      await connection.execute<ResultSetHeader>(
        `UPDATE events SET ${assignments.join(', ')}, updated_at = NOW(3) WHERE id = ?`,
        [...params, id] as ExecuteValues,
      )
    }

    // Rewritten only when the form sent one. An absent `agenda` means the
    // caller did not touch it — a reorder patch must not empty the schedule.
    if (patch.agenda !== undefined) await writeAgenda(connection, id, patch.agenda)
  })

  return get(id)
}

export async function remove(ids: string[]): Promise<void> {
  if (ids.length === 0) return
  // `event_agenda` cascades, so the schedule goes with the event.
  await execute(`DELETE FROM events WHERE id IN (${ids.map(() => '?').join(',')})`, ids)
}

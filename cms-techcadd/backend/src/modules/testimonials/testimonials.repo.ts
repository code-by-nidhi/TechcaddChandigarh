import { randomUUID } from 'node:crypto'

import { execute, query, queryOne, type Row } from '../../db/pool.js'
import { notFound } from '../../http/errors.js'
import {
  buildFilters,
  resolveSort,
  type ListParams,
  type ListResult,
} from '../../http/listParams.js'
import type { TestimonialInput, TestimonialPatch } from './testimonials.schema.js'

const SORTABLE: Record<string, string> = {
  authorName: 't.author_name',
  rating: 't.rating',
  order: 't.sort_order',
  status: 't.status',
  createdAt: 't.created_at',
  updatedAt: 't.updated_at',
}

const FILTERABLE: Record<string, string> = {
  status: 't.status',
  featured: 't.featured',
  rating: 't.rating',
  createdAt: 't.created_at',
  updatedAt: 't.updated_at',
}

/**
 * The avatar is joined rather than resolved by a second request, so a list of
 * twenty testimonials is one query and not twenty-one.
 */
const SELECT_TESTIMONIAL = `
  SELECT t.*, m.url AS avatar_url, m.alt AS avatar_alt
    FROM testimonials t
    LEFT JOIN media m ON m.id = t.avatar_id
`

function toTestimonial(row: Row): unknown {
  return {
    id: row.id,
    authorName: row.author_name,
    role: row.role ?? '',
    courseName: row.course_name ?? undefined,
    quote: row.quote,
    rating: Number(row.rating),
    googleUrl: row.google_url ?? undefined,
    youtubeUrl: row.youtube_url ?? undefined,
    avatar: row.avatar_id
      ? { id: row.avatar_id, url: row.avatar_url, alt: row.avatar_alt ?? '' }
      : undefined,
    featured: Boolean(row.featured),
    order: Number(row.sort_order),
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

export async function list(params: ListParams): Promise<ListResult<unknown>> {
  const { sql: filterSql, params: filterParams } = buildFilters(params.filters, FILTERABLE)
  // Featured first, then the hand-set order — the shape the wall renders.
  const { column, dir } = resolveSort(params.sort, SORTABLE, { column: 't.sort_order', dir: 'asc' })

  const searchSql = params.search
    ? ' AND (t.author_name LIKE ? OR t.quote LIKE ? OR t.course_name LIKE ?)'
    : ''
  const like = `%${params.search ?? ''}%`
  const searchParams = params.search ? [like, like, like] : []

  const where = `WHERE 1=1${filterSql}${searchSql}`
  const whereParams = [...filterParams, ...searchParams]

  const totalRow = await queryOne<{ total: number }>(
    `SELECT COUNT(*) AS total FROM testimonials t ${where}`,
    whereParams,
  )

  const offset = (params.page - 1) * params.pageSize
  const rows = await query<Row>(
    `${SELECT_TESTIMONIAL} ${where} ORDER BY t.featured DESC, ${column} ${dir} LIMIT ? OFFSET ?`,
    [...whereParams, params.pageSize, offset],
  )

  return {
    items: rows.map(toTestimonial),
    total: Number(totalRow?.total ?? 0),
    page: params.page,
    pageSize: params.pageSize,
  }
}

export async function get(id: string): Promise<unknown> {
  const row = await queryOne<Row>(`${SELECT_TESTIMONIAL} WHERE t.id = ? LIMIT 1`, [id])
  if (!row) throw notFound('Testimonial')
  return toTestimonial(row)
}

/** Empty string clears an optional link; undefined leaves it alone. */
const nullable = (value: string | null | undefined) => (value ? value : null)

export async function create(input: TestimonialInput): Promise<unknown> {
  const id = randomUUID()
  await execute(
    `INSERT INTO testimonials
       (id, author_name, role, course_name, quote, rating, google_url, youtube_url,
        avatar_id, featured, sort_order, status, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(3), NOW(3))`,
    [
      id,
      input.authorName,
      input.role,
      nullable(input.courseName),
      input.quote,
      input.rating,
      nullable(input.googleUrl),
      nullable(input.youtubeUrl),
      input.avatar?.id ?? null,
      input.featured ? 1 : 0,
      input.order,
      input.status,
    ],
  )
  return get(id)
}

export async function update(id: string, patch: TestimonialPatch): Promise<unknown> {
  const existing = await queryOne<Row>('SELECT id FROM testimonials WHERE id = ? LIMIT 1', [id])
  if (!existing) throw notFound('Testimonial')

  const mapping: Record<string, string> = {
    authorName: 'author_name',
    role: 'role',
    quote: 'quote',
    rating: 'rating',
    order: 'sort_order',
    status: 'status',
  }

  const assignments: string[] = []
  const params: unknown[] = []

  for (const [key, column] of Object.entries(mapping)) {
    const value = patch[key as keyof TestimonialPatch]
    if (value === undefined) continue
    assignments.push(`${column} = ?`)
    params.push(value)
  }

  // The nullable columns go through `nullable`, so clearing a link in the form
  // stores NULL rather than an empty string the site would render as a href.
  const clearable: [keyof TestimonialPatch, string][] = [
    ['courseName', 'course_name'],
    ['googleUrl', 'google_url'],
    ['youtubeUrl', 'youtube_url'],
  ]
  for (const [key, column] of clearable) {
    if (patch[key] === undefined) continue
    assignments.push(`${column} = ?`)
    params.push(nullable(patch[key] as string | null | undefined))
  }

  // `false` is a value, not an absence, so a boolean needs its own branch.
  // Absent means "leave it alone"; null means "remove it".
  if (patch.avatar !== undefined) {
    assignments.push('avatar_id = ?')
    params.push(patch.avatar?.id ?? null)
  }

  if (patch.featured !== undefined) {
    assignments.push('featured = ?')
    params.push(patch.featured ? 1 : 0)
  }

  if (assignments.length > 0) {
    await execute(
      `UPDATE testimonials SET ${assignments.join(', ')}, updated_at = NOW(3) WHERE id = ?`,
      [...params, id],
    )
  }

  return get(id)
}

export async function remove(ids: string[]): Promise<void> {
  if (ids.length === 0) return
  await query(`DELETE FROM testimonials WHERE id IN (${ids.map(() => '?').join(',')})`, ids)
}

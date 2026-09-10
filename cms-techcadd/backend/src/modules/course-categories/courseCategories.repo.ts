import { randomUUID } from 'node:crypto'

import { execute, query, queryOne, type Row } from '../../db/pool.js'
import { notFound, unprocessable } from '../../http/errors.js'
import {
  buildFilters,
  resolveSort,
  type ListParams,
  type ListResult,
} from '../../http/listParams.js'
import type { CourseCategoryInput, CourseCategoryPatch } from './courseCategories.schema.js'

const SORTABLE: Record<string, string> = {
  name: 'c.name',
  slug: 'c.slug',
  order: 'c.sort_order',
  status: 'c.status',
  createdAt: 'c.created_at',
  updatedAt: 'c.updated_at',
}

const FILTERABLE: Record<string, string> = {
  status: 'c.status',
  createdAt: 'c.created_at',
  updatedAt: 'c.updated_at',
}

/**
 * The course count travels with each category.
 *
 * The listing shows it, and the delete confirmation needs it — a category with
 * courses in it is one an editor should be told about before removing.
 */
const SELECT_CATEGORY = `
  SELECT c.*,
         (SELECT COUNT(*) FROM courses co WHERE co.category_id = c.id) AS course_count
    FROM course_categories c
`

function toCategory(row: Row): unknown {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    shortName: row.short_name,
    blurb: row.blurb ?? '',
    icon: row.icon,
    order: Number(row.sort_order),
    status: row.status,
    courseCount: Number(row.course_count ?? 0),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

export async function list(params: ListParams): Promise<ListResult<unknown>> {
  const { sql: filterSql, params: filterParams } = buildFilters(params.filters, FILTERABLE)
  const { column, dir } = resolveSort(params.sort, SORTABLE, { column: 'c.sort_order', dir: 'asc' })

  const searchSql = params.search ? ' AND (c.name LIKE ? OR c.short_name LIKE ? OR c.slug LIKE ?)' : ''
  const like = `%${params.search ?? ''}%`
  const searchParams = params.search ? [like, like, like] : []

  const where = `WHERE 1=1${filterSql}${searchSql}`
  const whereParams = [...filterParams, ...searchParams]

  const totalRow = await queryOne<{ total: number }>(
    `SELECT COUNT(*) AS total FROM course_categories c ${where}`,
    whereParams,
  )

  const offset = (params.page - 1) * params.pageSize
  const rows = await query<Row>(
    `${SELECT_CATEGORY} ${where} ORDER BY ${column} ${dir} LIMIT ? OFFSET ?`,
    [...whereParams, params.pageSize, offset],
  )

  return {
    items: rows.map(toCategory),
    total: Number(totalRow?.total ?? 0),
    page: params.page,
    pageSize: params.pageSize,
  }
}

export async function get(id: string): Promise<unknown> {
  const row = await queryOne<Row>(`${SELECT_CATEGORY} WHERE c.id = ? LIMIT 1`, [id])
  if (!row) throw notFound('Category')
  return toCategory(row)
}

async function assertSlugFree(slug: string, exceptId?: string): Promise<void> {
  const clash = await queryOne<Row>(
    `SELECT id FROM course_categories WHERE slug = ?${exceptId ? ' AND id <> ?' : ''} LIMIT 1`,
    exceptId ? [slug, exceptId] : [slug],
  )
  if (clash) throw unprocessable({ slug: 'Another category already uses that key.' })
}

export async function create(input: CourseCategoryInput): Promise<unknown> {
  await assertSlugFree(input.slug)

  const id = randomUUID()
  await execute(
    `INSERT INTO course_categories
       (id, slug, name, short_name, blurb, icon, sort_order, status, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(3), NOW(3))`,
    [
      id,
      input.slug,
      input.name,
      input.shortName,
      input.blurb || null,
      input.icon,
      input.order,
      input.status,
    ],
  )
  return get(id)
}

export async function update(id: string, patch: CourseCategoryPatch): Promise<unknown> {
  const existing = await queryOne<Row>('SELECT id FROM course_categories WHERE id = ? LIMIT 1', [id])
  if (!existing) throw notFound('Category')
  if (patch.slug) await assertSlugFree(patch.slug, id)

  const mapping: Record<string, string> = {
    slug: 'slug',
    name: 'name',
    shortName: 'short_name',
    icon: 'icon',
    order: 'sort_order',
    status: 'status',
  }

  const assignments: string[] = []
  const params: unknown[] = []

  for (const [key, column] of Object.entries(mapping)) {
    const value = patch[key as keyof CourseCategoryPatch]
    if (value === undefined) continue
    assignments.push(`${column} = ?`)
    params.push(value)
  }

  // Empty clears it rather than storing a blank the site would render as a gap.
  if (patch.blurb !== undefined) {
    assignments.push('blurb = ?')
    params.push(patch.blurb || null)
  }

  if (assignments.length > 0) {
    await execute(
      `UPDATE course_categories SET ${assignments.join(', ')}, updated_at = NOW(3) WHERE id = ?`,
      [...params, id],
    )
  }

  return get(id)
}

/**
 * Deletes categories, leaving their courses uncategorised.
 *
 * The foreign key is ON DELETE SET NULL, so this cannot silently take a course
 * with it. An uncategorised course still has a page and still appears in
 * search; it simply drops out of its filter group until someone refiles it.
 */
export async function remove(ids: string[]): Promise<void> {
  if (ids.length === 0) return
  await execute(
    `DELETE FROM course_categories WHERE id IN (${ids.map(() => '?').join(',')})`,
    ids,
  )
}

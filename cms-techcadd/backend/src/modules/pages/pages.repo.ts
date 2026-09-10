import { randomUUID } from 'node:crypto'

import { execute, query, queryOne, type Row } from '../../db/pool.js'
import { notFound, unprocessable } from '../../http/errors.js'
import {
  buildFilters,
  resolveSort,
  type ListParams,
  type ListResult,
} from '../../http/listParams.js'
import type { PageInput, PagePatch } from './pages.schema.js'

const SORTABLE: Record<string, string> = {
  title: 'p.title',
  slug: 'p.slug',
  kind: 'p.kind',
  order: 'p.sort_order',
  status: 'p.status',
  createdAt: 'p.created_at',
  updatedAt: 'p.updated_at',
}

const FILTERABLE: Record<string, string> = {
  status: 'p.status',
  kind: 'p.kind',
  showInNav: 'p.show_in_nav',
  createdAt: 'p.created_at',
  updatedAt: 'p.updated_at',
}

const SELECT_PAGE = `
  SELECT p.*, m.url AS cover_url, m.alt AS cover_alt
    FROM pages p
    LEFT JOIN media m ON m.id = p.cover_id
`

function toPage(row: Row): unknown {
  const kind = row.kind as string
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    kind,
    // The address this record governs, resolved here so no caller has to
    // reimplement the /pages prefix rule and get it subtly different.
    path: kind === 'override' ? `/${row.slug}` : `/pages/${row.slug}`,
    excerpt: row.excerpt ?? '',
    body: row.body ?? '',
    heroEyebrow: row.hero_eyebrow ?? undefined,
    heroTitle: row.hero_title ?? undefined,
    heroBody: row.hero_body ?? undefined,
    cover: row.cover_id
      ? { id: row.cover_id, url: row.cover_url, alt: row.cover_alt ?? '' }
      : undefined,
    showInNav: Boolean(row.show_in_nav),
    order: Number(row.sort_order),
    status: row.status,
    seo: {
      metaTitle: row.meta_title ?? undefined,
      metaDescription: row.meta_description ?? undefined,
    },
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

export async function list(params: ListParams): Promise<ListResult<unknown>> {
  const { sql: filterSql, params: filterParams } = buildFilters(params.filters, FILTERABLE)
  const { column, dir } = resolveSort(params.sort, SORTABLE, { column: 'p.sort_order', dir: 'asc' })

  const searchSql = params.search ? ' AND (p.title LIKE ? OR p.slug LIKE ? OR p.excerpt LIKE ?)' : ''
  const like = `%${params.search ?? ''}%`
  const searchParams = params.search ? [like, like, like] : []

  const where = `WHERE 1=1${filterSql}${searchSql}`
  const whereParams = [...filterParams, ...searchParams]

  const totalRow = await queryOne<{ total: number }>(
    `SELECT COUNT(*) AS total FROM pages p ${where}`,
    whereParams,
  )

  const offset = (params.page - 1) * params.pageSize
  const rows = await query<Row>(
    `${SELECT_PAGE} ${where} ORDER BY ${column} ${dir} LIMIT ? OFFSET ?`,
    [...whereParams, params.pageSize, offset],
  )

  return {
    items: rows.map(toPage),
    total: Number(totalRow?.total ?? 0),
    page: params.page,
    pageSize: params.pageSize,
  }
}

export async function get(id: string): Promise<unknown> {
  const row = await queryOne<Row>(`${SELECT_PAGE} WHERE p.id = ? LIMIT 1`, [id])
  if (!row) throw notFound('Page')
  return toPage(row)
}

/**
 * The unique key is `(kind, slug)`, so uniqueness is checked against both.
 *
 * /pages/about and an override of the real /about are different records that
 * would otherwise be told they collide.
 */
async function assertSlugFree(kind: string, slug: string, exceptId?: string): Promise<void> {
  const clash = await queryOne<Row>(
    `SELECT id FROM pages WHERE kind = ? AND slug = ?${exceptId ? ' AND id <> ?' : ''} LIMIT 1`,
    exceptId ? [kind, slug, exceptId] : [kind, slug],
  )
  if (clash) {
    throw unprocessable({
      slug:
        kind === 'override'
          ? 'That route already has an override.'
          : 'This slug is already in use.',
    })
  }
}

const nullable = (value: string | null | undefined) => (value ? value : null)

export async function create(input: PageInput): Promise<unknown> {
  await assertSlugFree(input.kind, input.slug)

  const id = randomUUID()
  await execute(
    `INSERT INTO pages
       (id, title, slug, kind, excerpt, body, hero_eyebrow, hero_title, hero_body,
        cover_id, show_in_nav, sort_order, status, meta_title, meta_description,
        created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(3), NOW(3))`,
    [
      id,
      input.title,
      input.slug,
      input.kind,
      nullable(input.excerpt),
      nullable(input.body),
      nullable(input.heroEyebrow),
      nullable(input.heroTitle),
      nullable(input.heroBody),
      input.cover?.id ?? null,
      input.showInNav ? 1 : 0,
      input.order,
      input.status,
      nullable(input.seo?.metaTitle),
      nullable(input.seo?.metaDescription),
    ],
  )

  return get(id)
}

export async function update(id: string, patch: PagePatch): Promise<unknown> {
  const existing = await queryOne<Row>('SELECT id, kind, slug FROM pages WHERE id = ? LIMIT 1', [id])
  if (!existing) throw notFound('Page')

  // Either half of the key can move, so the check uses the values that will be
  // stored rather than only the ones the patch happened to include.
  const nextKind = (patch.kind ?? existing.kind) as string
  const nextSlug = (patch.slug ?? existing.slug) as string
  if (patch.kind !== undefined || patch.slug !== undefined) {
    await assertSlugFree(nextKind, nextSlug, id)
  }

  const direct: Record<string, string> = {
    title: 'title',
    slug: 'slug',
    kind: 'kind',
    order: 'sort_order',
    status: 'status',
  }

  const clearable: Record<string, string> = {
    excerpt: 'excerpt',
    body: 'body',
    heroEyebrow: 'hero_eyebrow',
    heroTitle: 'hero_title',
    heroBody: 'hero_body',
  }

  const assignments: string[] = []
  const params: unknown[] = []

  for (const [key, column] of Object.entries(direct)) {
    const value = patch[key as keyof PagePatch]
    if (value === undefined) continue
    assignments.push(`${column} = ?`)
    params.push(value)
  }

  for (const [key, column] of Object.entries(clearable)) {
    const value = patch[key as keyof PagePatch]
    if (value === undefined) continue
    assignments.push(`${column} = ?`)
    params.push(nullable(value as string | null | undefined))
  }

  if (patch.cover !== undefined) {
    assignments.push('cover_id = ?')
    params.push(patch.cover?.id ?? null)
  }

  if (patch.showInNav !== undefined) {
    assignments.push('show_in_nav = ?')
    params.push(patch.showInNav ? 1 : 0)
  }

  if (patch.seo !== undefined) {
    assignments.push('meta_title = ?', 'meta_description = ?')
    params.push(nullable(patch.seo?.metaTitle), nullable(patch.seo?.metaDescription))
  }

  if (assignments.length > 0) {
    await execute(
      `UPDATE pages SET ${assignments.join(', ')}, updated_at = NOW(3) WHERE id = ?`,
      [...params, id],
    )
  }

  return get(id)
}

export async function remove(ids: string[]): Promise<void> {
  if (ids.length === 0) return
  await execute(`DELETE FROM pages WHERE id IN (${ids.map(() => '?').join(',')})`, ids)
}

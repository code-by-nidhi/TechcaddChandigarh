import { randomUUID } from 'node:crypto'

import { execute, query, queryOne, type Row } from '../../db/pool.js'
import { notFound, unprocessable } from '../../http/errors.js'
import {
  buildFilters,
  resolveSort,
  type ListParams,
  type ListResult,
} from '../../http/listParams.js'
import {
  DEFAULT_SITEMAP_SECTIONS,
  sitemapSettingsSchema,
  type RedirectInput,
  type RedirectPatch,
  type SeoMetaInput,
  type SeoMetaPatch,
  type SitemapSettings,
} from './seo.schema.js'

/* ------------------------------------------------------------------ */
/* Redirects                                                           */
/* ------------------------------------------------------------------ */

const REDIRECT_SORTABLE: Record<string, string> = {
  from: 'r.from_path',
  to: 'r.to_path',
  hits: 'r.hits',
  createdAt: 'r.created_at',
  lastHitAt: 'r.last_hit_at',
}

const REDIRECT_FILTERABLE: Record<string, string> = {
  active: 'r.active',
  statusCode: 'r.status_code',
}

function toRedirect(row: Row): unknown {
  return {
    id: row.id,
    from: row.from_path,
    to: row.to_path,
    statusCode: Number(row.status_code),
    active: Boolean(row.active),
    hits: Number(row.hits),
    lastHitAt: row.last_hit_at ?? undefined,
    note: row.note ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

export async function listRedirects(params: ListParams): Promise<ListResult<unknown>> {
  const { sql: filterSql, params: filterParams } = buildFilters(params.filters, REDIRECT_FILTERABLE)
  const { column, dir } = resolveSort(params.sort, REDIRECT_SORTABLE, {
    column: 'r.created_at',
    dir: 'desc',
  })

  const searchSql = params.search ? ' AND (r.from_path LIKE ? OR r.to_path LIKE ?)' : ''
  const like = `%${params.search ?? ''}%`
  const searchParams = params.search ? [like, like] : []

  const where = `WHERE 1=1${filterSql}${searchSql}`
  const whereParams = [...filterParams, ...searchParams]

  const totalRow = await queryOne<{ total: number }>(
    `SELECT COUNT(*) AS total FROM redirects r ${where}`,
    whereParams,
  )

  const offset = (params.page - 1) * params.pageSize
  const rows = await query<Row>(
    `SELECT r.* FROM redirects r ${where} ORDER BY ${column} ${dir} LIMIT ? OFFSET ?`,
    [...whereParams, params.pageSize, offset],
  )

  return {
    items: rows.map(toRedirect),
    total: Number(totalRow?.total ?? 0),
    page: params.page,
    pageSize: params.pageSize,
  }
}

export async function getRedirect(id: string): Promise<unknown> {
  const row = await queryOne<Row>('SELECT r.* FROM redirects r WHERE r.id = ? LIMIT 1', [id])
  if (!row) throw notFound('Redirect')
  return toRedirect(row)
}

/**
 * Refuses a rule whose destination is itself the source of another rule.
 *
 * A → B where B → C makes the browser take two hops, and search engines stop
 * following after a few. Caught here because the person writing the second rule
 * has no reason to remember the first.
 */
async function assertNoChain(from: string, to: string, exceptId?: string): Promise<void> {
  const clash = await queryOne<Row>(
    `SELECT id, to_path FROM redirects
      WHERE active = 1 AND from_path = ?${exceptId ? ' AND id <> ?' : ''} LIMIT 1`,
    exceptId ? [to, exceptId] : [to],
  )
  if (clash) {
    throw unprocessable({
      to: `That destination already redirects on to ${String(clash.to_path)}. Point this at the final address instead.`,
    })
  }

  const duplicate = await queryOne<Row>(
    `SELECT id FROM redirects WHERE from_path = ?${exceptId ? ' AND id <> ?' : ''} LIMIT 1`,
    exceptId ? [from, exceptId] : [from],
  )
  if (duplicate) throw unprocessable({ from: 'There is already a redirect from that path.' })
}

export async function createRedirect(input: RedirectInput): Promise<unknown> {
  await assertNoChain(input.from, input.to)

  const id = randomUUID()
  await execute(
    `INSERT INTO redirects (id, from_path, to_path, status_code, active, note, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, NOW(3), NOW(3))`,
    [id, input.from, input.to, input.statusCode, input.active ? 1 : 0, input.note || null],
  )
  return getRedirect(id)
}

export async function updateRedirect(id: string, patch: RedirectPatch): Promise<unknown> {
  const existing = await queryOne<Row>(
    'SELECT id, from_path, to_path FROM redirects WHERE id = ? LIMIT 1',
    [id],
  )
  if (!existing) throw notFound('Redirect')

  const nextFrom = patch.from ?? (existing.from_path as string)
  const nextTo = patch.to ?? (existing.to_path as string)
  if (patch.from !== undefined || patch.to !== undefined) {
    await assertNoChain(nextFrom, nextTo, id)
  }

  const assignments: string[] = []
  const params: unknown[] = []

  const direct: Record<string, string> = {
    from: 'from_path',
    to: 'to_path',
    statusCode: 'status_code',
  }
  for (const [key, column] of Object.entries(direct)) {
    const value = patch[key as keyof RedirectPatch]
    if (value === undefined) continue
    assignments.push(`${column} = ?`)
    params.push(value)
  }

  if (patch.active !== undefined) {
    assignments.push('active = ?')
    params.push(patch.active ? 1 : 0)
  }
  if (patch.note !== undefined) {
    assignments.push('note = ?')
    params.push(patch.note || null)
  }

  if (assignments.length > 0) {
    await execute(
      `UPDATE redirects SET ${assignments.join(', ')}, updated_at = NOW(3) WHERE id = ?`,
      [...params, id],
    )
  }

  return getRedirect(id)
}

export async function removeRedirects(ids: string[]): Promise<void> {
  if (ids.length === 0) return
  await execute(`DELETE FROM redirects WHERE id IN (${ids.map(() => '?').join(',')})`, ids)
}

/** The active rules, for the website's middleware. Small enough to send whole. */
export async function activeRedirects(): Promise<{ from: string; to: string; statusCode: number }[]> {
  const rows = await query<Row>(
    'SELECT from_path, to_path, status_code FROM redirects WHERE active = 1',
  )
  return rows.map((row) => ({
    from: row.from_path as string,
    to: row.to_path as string,
    statusCode: Number(row.status_code),
  }))
}

/** Counted when the site follows a rule, so dead ones can be found later. */
export async function countRedirectHit(from: string): Promise<void> {
  try {
    await execute(
      'UPDATE redirects SET hits = hits + 1, last_hit_at = NOW(3) WHERE from_path = ?',
      [from],
    )
  } catch (error) {
    console.warn('[seo] could not record a redirect hit:', error)
  }
}

/* ------------------------------------------------------------------ */
/* Per-route meta                                                      */
/* ------------------------------------------------------------------ */

const META_SORTABLE: Record<string, string> = {
  route: 'm.route',
  updatedAt: 'm.updated_at',
}

const SELECT_META = `
  SELECT m.*, img.url AS og_url, img.alt AS og_alt
    FROM seo_meta m
    LEFT JOIN media img ON img.id = m.og_image_id
`

function toMeta(row: Row): unknown {
  return {
    id: row.id,
    route: row.route,
    metaTitle: row.meta_title ?? '',
    metaDescription: row.meta_description ?? '',
    ogImage: row.og_image_id
      ? { id: row.og_image_id, url: row.og_url, alt: row.og_alt ?? '' }
      : undefined,
    canonicalUrl: row.canonical_url ?? '',
    noindex: Boolean(row.noindex),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

export async function listMeta(params: ListParams): Promise<ListResult<unknown>> {
  const { column, dir } = resolveSort(params.sort, META_SORTABLE, {
    column: 'm.route',
    dir: 'asc',
  })

  const searchSql = params.search ? ' AND (m.route LIKE ? OR m.meta_title LIKE ?)' : ''
  const like = `%${params.search ?? ''}%`
  const whereParams = params.search ? [like, like] : []
  const where = `WHERE 1=1${searchSql}`

  const totalRow = await queryOne<{ total: number }>(
    `SELECT COUNT(*) AS total FROM seo_meta m ${where}`,
    whereParams,
  )

  const offset = (params.page - 1) * params.pageSize
  const rows = await query<Row>(
    `${SELECT_META} ${where} ORDER BY ${column} ${dir} LIMIT ? OFFSET ?`,
    [...whereParams, params.pageSize, offset],
  )

  return {
    items: rows.map(toMeta),
    total: Number(totalRow?.total ?? 0),
    page: params.page,
    pageSize: params.pageSize,
  }
}

export async function getMeta(id: string): Promise<unknown> {
  const row = await queryOne<Row>(`${SELECT_META} WHERE m.id = ? LIMIT 1`, [id])
  if (!row) throw notFound('Meta override')
  return toMeta(row)
}

/**
 * Creates or replaces the override for a route.
 *
 * An upsert rather than separate create and update: a route has at most one
 * override, and asking an editor whether they are adding or editing one is a
 * distinction the data does not have.
 */
export async function upsertMeta(input: SeoMetaInput): Promise<unknown> {
  const existing = await queryOne<Row>('SELECT id FROM seo_meta WHERE route = ? LIMIT 1', [
    input.route,
  ])

  const id = (existing?.id as string) ?? randomUUID()
  const values = [
    input.metaTitle || null,
    input.metaDescription || null,
    input.ogImage?.id ?? null,
    input.canonicalUrl || null,
    input.noindex ? 1 : 0,
  ]

  if (existing) {
    await execute(
      `UPDATE seo_meta
          SET meta_title = ?, meta_description = ?, og_image_id = ?, canonical_url = ?,
              noindex = ?, updated_at = NOW(3)
        WHERE id = ?`,
      [...values, id],
    )
  } else {
    await execute(
      `INSERT INTO seo_meta
         (id, route, meta_title, meta_description, og_image_id, canonical_url, noindex,
          created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, NOW(3), NOW(3))`,
      [id, input.route, ...values],
    )
  }

  return getMeta(id)
}

export async function updateMeta(id: string, patch: SeoMetaPatch): Promise<unknown> {
  const existing = await queryOne<Row>('SELECT id, route FROM seo_meta WHERE id = ? LIMIT 1', [id])
  if (!existing) throw notFound('Meta override')

  const assignments: string[] = []
  const params: unknown[] = []

  const clearable: Record<string, string> = {
    route: 'route',
    metaTitle: 'meta_title',
    metaDescription: 'meta_description',
    canonicalUrl: 'canonical_url',
  }
  for (const [key, column] of Object.entries(clearable)) {
    const value = patch[key as keyof SeoMetaPatch]
    if (value === undefined) continue
    assignments.push(`${column} = ?`)
    params.push(value || null)
  }

  if (patch.ogImage !== undefined) {
    assignments.push('og_image_id = ?')
    params.push(patch.ogImage?.id ?? null)
  }
  if (patch.noindex !== undefined) {
    assignments.push('noindex = ?')
    params.push(patch.noindex ? 1 : 0)
  }

  if (assignments.length > 0) {
    await execute(
      `UPDATE seo_meta SET ${assignments.join(', ')}, updated_at = NOW(3) WHERE id = ?`,
      [...params, id],
    )
  }

  return getMeta(id)
}

export async function removeMeta(ids: string[]): Promise<void> {
  if (ids.length === 0) return
  await execute(`DELETE FROM seo_meta WHERE id IN (${ids.map(() => '?').join(',')})`, ids)
}

/** Every override, keyed by route — what the website reads on each render. */
export async function metaByRoute(): Promise<Record<string, unknown>> {
  const rows = await query<Row>(SELECT_META)
  const map: Record<string, unknown> = {}
  for (const row of rows) map[row.route as string] = toMeta(row)
  return map
}

/* ------------------------------------------------------------------ */
/* Sitemap settings                                                    */
/* ------------------------------------------------------------------ */

export async function getSitemapSettings(): Promise<SitemapSettings> {
  const row = await queryOne<Row>('SELECT sitemap FROM settings WHERE id = 1 LIMIT 1')
  const raw = row?.sitemap

  const parsed = sitemapSettingsSchema.safeParse(
    typeof raw === 'string' ? JSON.parse(raw) : raw,
  )
  if (parsed.success) {
    // Sections added to the site since this was last saved are filled in from
    // the defaults, so a new section is included rather than silently missing.
    const known = new Set(parsed.data.sections.map((section) => section.key))
    return {
      sections: [
        ...parsed.data.sections,
        ...DEFAULT_SITEMAP_SECTIONS.filter((section) => !known.has(section.key)),
      ],
    }
  }

  return { sections: DEFAULT_SITEMAP_SECTIONS }
}

export async function saveSitemapSettings(input: SitemapSettings): Promise<SitemapSettings> {
  await execute('UPDATE settings SET sitemap = ?, updated_at = NOW(3) WHERE id = 1', [
    JSON.stringify(input),
  ])
  return getSitemapSettings()
}

/* ------------------------------------------------------------------ */
/* Audit                                                               */
/* ------------------------------------------------------------------ */

export interface AuditIssue {
  severity: 'error' | 'warning'
  module: string
  id: string
  label: string
  problem: string
}

/**
 * What is wrong with the site's metadata, as a list somebody can work through.
 *
 * Only checks things that are true faults rather than matters of taste: a
 * missing description, a title that will be truncated, two records fighting
 * over one URL. A report full of debatable advice gets ignored, and then so do
 * the real problems in it.
 */
export async function audit(): Promise<AuditIssue[]> {
  const issues: AuditIssue[] = []

  const add = (
    severity: AuditIssue['severity'],
    module: string,
    rows: Row[],
    problem: string,
  ) => {
    for (const row of rows) {
      issues.push({
        severity,
        module,
        id: row.id as string,
        label: (row.label as string) ?? '(untitled)',
        problem,
      })
    }
  }

  add(
    'warning',
    'blogs',
    await query<Row>(
      `SELECT id, title AS label FROM blogs
        WHERE status = 'published' AND (meta_description IS NULL OR meta_description = '')
          AND (excerpt IS NULL OR excerpt = '')`,
    ),
    'No meta description and no excerpt to fall back on.',
  )

  add(
    'warning',
    'blogs',
    await query<Row>(
      `SELECT id, title AS label FROM blogs
        WHERE status = 'published' AND CHAR_LENGTH(COALESCE(meta_title, title)) > 60`,
    ),
    'Title is over 60 characters and will be truncated in search results.',
  )

  add(
    'warning',
    'pages',
    await query<Row>(
      `SELECT id, title AS label FROM pages
        WHERE status = 'published' AND kind = 'custom'
          AND (meta_description IS NULL OR meta_description = '')`,
    ),
    'No meta description.',
  )

  add(
    'warning',
    'events',
    await query<Row>(
      `SELECT id, title AS label FROM events
        WHERE status = 'published' AND (meta_description IS NULL OR meta_description = '')
          AND (excerpt IS NULL OR excerpt = '')`,
    ),
    'No meta description and no excerpt to fall back on.',
  )

  /*
   * A published post with no cover has no image for a social card, so a link to
   * it shares as a bare text block. Not fatal, but it is the difference between
   * a shared link being clicked and being scrolled past.
   */
  add(
    'warning',
    'blogs',
    await query<Row>(
      `SELECT id, title AS label FROM blogs
        WHERE status = 'published' AND cover_image_id IS NULL AND og_image_id IS NULL`,
    ),
    'No cover or social image — links to this post share without a picture.',
  )

  // A redirect whose source is a page that still exists shadows the real page:
  // the page is unreachable and nobody sees an error to explain why.
  add(
    'error',
    'redirects',
    await query<Row>(
      `SELECT r.id, r.from_path AS label
         FROM redirects r
         JOIN pages p ON CONCAT('/pages/', p.slug) = r.from_path AND p.status = 'published'
        WHERE r.active = 1`,
    ),
    'Redirects away from a page that is still published, making it unreachable.',
  )

  return issues
}

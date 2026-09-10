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
import type { CourseInput, CourseModuleInput, CoursePatch } from './courses.schema.js'

const SORTABLE: Record<string, string> = {
  name: 'c.name',
  courseKey: 'c.course_key',
  level: 'c.level',
  order: 'c.sort_order',
  status: 'c.status',
  createdAt: 'c.created_at',
  updatedAt: 'c.updated_at',
}

const FILTERABLE: Record<string, string> = {
  status: 'c.status',
  featured: 'c.featured',
  hasTraining: 'c.has_training',
  level: 'c.level',
  categoryId: 'c.category_id',
  createdAt: 'c.created_at',
  updatedAt: 'c.updated_at',
}

const SELECT_COURSE = `
  SELECT c.*,
         cat.slug AS category_slug, cat.name AS category_name, cat.short_name AS category_short,
         m.url AS hero_url, m.alt AS hero_alt
    FROM courses c
    LEFT JOIN course_categories cat ON cat.id = c.category_id
    LEFT JOIN media m ON m.id = c.hero_image_id
`

interface CourseChildren {
  tools: string[]
  modules: { id: string; title: string; topics: string[] }[]
  outcomes: string[]
  careers: string[]
}

const emptyChildren = (): CourseChildren => ({
  tools: [],
  modules: [],
  outcomes: [],
  careers: [],
})

function toCourse(row: Row, children: CourseChildren): unknown {
  return {
    id: row.id,
    courseKey: row.course_key,
    name: row.name,
    categoryId: row.category_id ?? undefined,
    // Denormalised for the listing, which shows the group name beside each
    // course and would otherwise need a second request per row.
    category: row.category_id
      ? { id: row.category_id, slug: row.category_slug, name: row.category_name, shortName: row.category_short }
      : undefined,
    duration: row.duration ?? '',
    level: row.level,
    summary: row.summary ?? '',
    badge: row.badge ?? undefined,
    featured: Boolean(row.featured),
    hasTraining: Boolean(row.has_training),
    heroImage: row.hero_image_id
      ? { id: row.hero_image_id, url: row.hero_url, alt: row.hero_alt ?? '' }
      : undefined,
    // Both columns or neither — see the note on the schema.
    fee:
      row.fee_original !== null && row.fee_original !== undefined
        ? { original: Number(row.fee_original), offer: Number(row.fee_offer ?? row.fee_original) }
        : undefined,
    tools: children.tools,
    modules: children.modules,
    outcomes: children.outcomes,
    careers: children.careers,
    order: Number(row.sort_order),
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

/**
 * Loads every child list for a page of courses in four queries, not four per
 * course.
 *
 * The catalogue is 44 courses with a syllabus each; done naively this listing
 * would be a couple of hundred round trips.
 */
async function loadChildren(courseIds: string[]): Promise<Map<string, CourseChildren>> {
  const map = new Map<string, CourseChildren>(courseIds.map((id) => [id, emptyChildren()]))
  if (courseIds.length === 0) return map

  const placeholders = courseIds.map(() => '?').join(',')

  const toolRows = await query<Row>(
    `SELECT course_id, tool FROM course_tools
      WHERE course_id IN (${placeholders}) ORDER BY sort_order`,
    courseIds,
  )
  for (const row of toolRows) map.get(row.course_id as string)?.tools.push(row.tool as string)

  const pointRows = await query<Row>(
    `SELECT course_id, kind, text FROM course_points
      WHERE course_id IN (${placeholders}) ORDER BY sort_order`,
    courseIds,
  )
  for (const row of pointRows) {
    const bucket = map.get(row.course_id as string)
    if (!bucket) continue
    if (row.kind === 'outcome') bucket.outcomes.push(row.text as string)
    else bucket.careers.push(row.text as string)
  }

  const moduleRows = await query<Row>(
    `SELECT id, course_id, title FROM course_modules
      WHERE course_id IN (${placeholders}) ORDER BY sort_order`,
    courseIds,
  )
  // Indexed by module id so the topics below can be attached without scanning.
  const moduleIndex = new Map<string, { id: string; title: string; topics: string[] }>()
  for (const row of moduleRows) {
    const entry = { id: row.id as string, title: row.title as string, topics: [] as string[] }
    moduleIndex.set(entry.id, entry)
    map.get(row.course_id as string)?.modules.push(entry)
  }

  if (moduleIndex.size > 0) {
    const moduleIds = [...moduleIndex.keys()]
    const topicRows = await query<Row>(
      `SELECT module_id, topic FROM course_module_topics
        WHERE module_id IN (${moduleIds.map(() => '?').join(',')}) ORDER BY sort_order`,
      moduleIds,
    )
    for (const row of topicRows) {
      moduleIndex.get(row.module_id as string)?.topics.push(row.topic as string)
    }
  }

  return map
}

export async function list(params: ListParams): Promise<ListResult<unknown>> {
  const { sql: filterSql, params: filterParams } = buildFilters(params.filters, FILTERABLE)
  const { column, dir } = resolveSort(params.sort, SORTABLE, { column: 'c.sort_order', dir: 'asc' })

  const searchSql = params.search
    ? ' AND (c.name LIKE ? OR c.course_key LIKE ? OR c.summary LIKE ?)'
    : ''
  const like = `%${params.search ?? ''}%`
  const searchParams = params.search ? [like, like, like] : []

  const where = `WHERE 1=1${filterSql}${searchSql}`
  const whereParams = [...filterParams, ...searchParams]

  const totalRow = await queryOne<{ total: number }>(
    `SELECT COUNT(*) AS total FROM courses c ${where}`,
    whereParams,
  )

  const offset = (params.page - 1) * params.pageSize
  const rows = await query<Row>(
    `${SELECT_COURSE} ${where} ORDER BY ${column} ${dir} LIMIT ? OFFSET ?`,
    [...whereParams, params.pageSize, offset],
  )

  const children = await loadChildren(rows.map((row) => row.id as string))

  return {
    items: rows.map((row) => toCourse(row, children.get(row.id as string) ?? emptyChildren())),
    total: Number(totalRow?.total ?? 0),
    page: params.page,
    pageSize: params.pageSize,
  }
}

export async function get(id: string): Promise<unknown> {
  const row = await queryOne<Row>(`${SELECT_COURSE} WHERE c.id = ? LIMIT 1`, [id])
  if (!row) throw notFound('Course')

  const children = await loadChildren([id])
  return toCourse(row, children.get(id) ?? emptyChildren())
}

/**
 * Rejects a course key already in use.
 *
 * Worth a clear message rather than a driver error: the key is the identity of
 * every URL this course publishes, so a collision is not a small mistake.
 */
async function assertKeyFree(courseKey: string, exceptId?: string): Promise<void> {
  const clash = await queryOne<Row>(
    `SELECT id FROM courses WHERE course_key = ?${exceptId ? ' AND id <> ?' : ''} LIMIT 1`,
    exceptId ? [courseKey, exceptId] : [courseKey],
  )
  if (clash) throw unprocessable({ courseKey: 'Another course already uses that key.' })
}

/* ------------------------------------------------------------------ */
/* Child writes                                                         */
/* ------------------------------------------------------------------ */

/**
 * Every child list is deleted and reinserted rather than diffed.
 *
 * The lists are short, order is a column, and a diff would have to reconcile
 * reordering with insertion and deletion for no practical gain on a form that
 * saves a few dozen rows at most.
 */

async function writeSimpleList(
  connection: PoolConnection,
  table: 'course_tools',
  courseId: string,
  values: string[],
): Promise<void> {
  await connection.execute<ResultSetHeader>(`DELETE FROM ${table} WHERE course_id = ?`, [courseId])

  let position = 0
  for (const value of values) {
    await connection.execute<ResultSetHeader>(
      `INSERT INTO ${table} (id, course_id, tool, sort_order) VALUES (?, ?, ?, ?)`,
      [randomUUID(), courseId, value, position++],
    )
  }
}

async function writePoints(
  connection: PoolConnection,
  courseId: string,
  kind: 'outcome' | 'career',
  values: string[],
): Promise<void> {
  await connection.execute<ResultSetHeader>(
    'DELETE FROM course_points WHERE course_id = ? AND kind = ?',
    [courseId, kind],
  )

  let position = 0
  for (const value of values) {
    await connection.execute<ResultSetHeader>(
      `INSERT INTO course_points (id, course_id, kind, text, sort_order) VALUES (?, ?, ?, ?, ?)`,
      [randomUUID(), courseId, kind, value, position++],
    )
  }
}

async function writeModules(
  connection: PoolConnection,
  courseId: string,
  modules: CourseModuleInput[],
): Promise<void> {
  // Topics cascade from modules, so deleting the modules clears both.
  await connection.execute<ResultSetHeader>('DELETE FROM course_modules WHERE course_id = ?', [
    courseId,
  ])

  let modulePosition = 0
  for (const entry of modules) {
    const moduleId = toStorableId(entry.id)
    await connection.execute<ResultSetHeader>(
      `INSERT INTO course_modules (id, course_id, title, sort_order) VALUES (?, ?, ?, ?)`,
      [moduleId, courseId, entry.title, modulePosition++],
    )

    let topicPosition = 0
    for (const topic of entry.topics) {
      await connection.execute<ResultSetHeader>(
        `INSERT INTO course_module_topics (id, module_id, topic, sort_order) VALUES (?, ?, ?, ?)`,
        [randomUUID(), moduleId, topic, topicPosition++],
      )
    }
  }
}

const nullable = (value: string | null | undefined) => (value ? value : null)

/* ------------------------------------------------------------------ */
/* Writes                                                              */
/* ------------------------------------------------------------------ */

export async function create(input: CourseInput): Promise<unknown> {
  await assertKeyFree(input.courseKey)

  const id = randomUUID()
  await transaction(async (connection) => {
    await connection.execute<ResultSetHeader>(
      `INSERT INTO courses
         (id, course_key, name, category_id, duration, level, summary, badge,
          featured, has_training, hero_image_id, fee_original, fee_offer,
          sort_order, status, meta_title, meta_description, meta_keywords, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(3), NOW(3))`,
      [
        id,
        input.courseKey,
        input.name,
        nullable(input.categoryId),
        input.duration,
        input.level,
        nullable(input.summary),
        nullable(input.badge),
        input.featured ? 1 : 0,
        input.hasTraining ? 1 : 0,
        input.heroImage?.id ?? null,
        input.fee?.original ?? null,
        input.fee?.offer ?? null,
        input.order,
        input.status,
        nullable(input.seo?.metaTitle),
        nullable(input.seo?.metaDescription),
        JSON.stringify(input.seo?.keywords ?? []),
      ] as ExecuteValues,
    )

    await writeSimpleList(connection, 'course_tools', id, input.tools)
    await writeModules(connection, id, input.modules)
    await writePoints(connection, id, 'outcome', input.outcomes)
    await writePoints(connection, id, 'career', input.careers)
  })

  return get(id)
}

export async function update(id: string, patch: CoursePatch): Promise<unknown> {
  const existing = await queryOne<Row>('SELECT id FROM courses WHERE id = ? LIMIT 1', [id])
  if (!existing) throw notFound('Course')
  if (patch.courseKey) await assertKeyFree(patch.courseKey, id)

  const direct: Record<string, string> = {
    courseKey: 'course_key',
    name: 'name',
    duration: 'duration',
    level: 'level',
    order: 'sort_order',
    status: 'status',
  }

  const clearable: Record<string, string> = {
    categoryId: 'category_id',
    summary: 'summary',
    badge: 'badge',
  }

  await transaction(async (connection) => {
    const assignments: string[] = []
    const params: unknown[] = []

    for (const [key, column] of Object.entries(direct)) {
      const value = patch[key as keyof CoursePatch]
      if (value === undefined) continue
      assignments.push(`${column} = ?`)
      params.push(value)
    }

    for (const [key, column] of Object.entries(clearable)) {
      const value = patch[key as keyof CoursePatch]
      if (value === undefined) continue
      assignments.push(`${column} = ?`)
      params.push(nullable(value as string | null | undefined))
    }

    for (const [key, column] of [
      ['featured', 'featured'],
      ['hasTraining', 'has_training'],
    ] as const) {
      const value = patch[key]
      if (value === undefined) continue
      assignments.push(`${column} = ?`)
      params.push(value ? 1 : 0)
    }

    if (patch.heroImage !== undefined) {
      assignments.push('hero_image_id = ?')
      params.push(patch.heroImage?.id ?? null)
    }

    // Written as a pair. Clearing the fee has to clear both columns, or the
    // course would keep an offer price with nothing to compare it against.
    if (patch.fee !== undefined) {
      assignments.push('fee_original = ?', 'fee_offer = ?')
      params.push(patch.fee?.original ?? null, patch.fee?.offer ?? null)
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
        `UPDATE courses SET ${assignments.join(', ')}, updated_at = NOW(3) WHERE id = ?`,
        [...params, id] as ExecuteValues,
      )
    }

    // Each child list is rewritten only when the form sent one. An absent key
    // means the caller did not touch it — a reorder patch must not empty the
    // syllabus.
    if (patch.tools !== undefined) await writeSimpleList(connection, 'course_tools', id, patch.tools)
    if (patch.modules !== undefined) await writeModules(connection, id, patch.modules)
    if (patch.outcomes !== undefined) await writePoints(connection, id, 'outcome', patch.outcomes)
    if (patch.careers !== undefined) await writePoints(connection, id, 'career', patch.careers)
  })

  return get(id)
}

export async function remove(ids: string[]): Promise<void> {
  if (ids.length === 0) return
  // Every child table cascades, so the syllabus goes with the course.
  await execute(`DELETE FROM courses WHERE id IN (${ids.map(() => '?').join(',')})`, ids)
}

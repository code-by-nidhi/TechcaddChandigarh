import { randomUUID } from 'node:crypto'

import { execute, query, queryOne, type Row } from '../../db/pool.js'
import { notFound } from '../../http/errors.js'
import {
  buildFilters,
  resolveSort,
  type ListParams,
  type ListResult,
} from '../../http/listParams.js'
import type { CommentPatch, PublicCommentInput } from './comments.schema.js'

const SORTABLE: Record<string, string> = {
  createdAt: 'c.created_at',
  authorName: 'c.author_name',
  status: 'c.status',
}

const FILTERABLE: Record<string, string> = {
  status: 'c.status',
  blogId: 'c.blog_id',
  createdAt: 'c.created_at',
}

/**
 * The post's title travels with the comment.
 *
 * The moderation queue is read across every post at once, so "approve this"
 * needs the context of what it is a comment on — without the join the moderator
 * is reading disembodied paragraphs.
 */
const SELECT_COMMENT = `
  SELECT c.*, b.title AS blog_title, b.slug AS blog_slug
    FROM comments c
    JOIN blogs b ON b.id = c.blog_id
`

function toComment(row: Row): unknown {
  return {
    id: row.id,
    blogId: row.blog_id,
    blogTitle: row.blog_title,
    blogSlug: row.blog_slug,
    parentId: row.parent_id ?? undefined,
    authorName: row.author_name,
    // Held for the moderator to reply to; never sent to the public endpoint.
    email: row.author_email ?? undefined,
    body: row.body,
    status: row.status,
    ip: row.ip ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

export async function list(params: ListParams): Promise<ListResult<unknown>> {
  const { sql: filterSql, params: filterParams } = buildFilters(params.filters, FILTERABLE)
  // Newest first — moderation is a queue, and the queue is worked from the top.
  const { column, dir } = resolveSort(params.sort, SORTABLE, {
    column: 'c.created_at',
    dir: 'desc',
  })

  const searchSql = params.search
    ? ' AND (c.author_name LIKE ? OR c.body LIKE ? OR b.title LIKE ?)'
    : ''
  const like = `%${params.search ?? ''}%`
  const searchParams = params.search ? [like, like, like] : []

  const where = `WHERE 1=1${filterSql}${searchSql}`
  const whereParams = [...filterParams, ...searchParams]

  const totalRow = await queryOne<{ total: number }>(
    `SELECT COUNT(*) AS total FROM comments c JOIN blogs b ON b.id = c.blog_id ${where}`,
    whereParams,
  )

  const offset = (params.page - 1) * params.pageSize
  const rows = await query<Row>(
    `${SELECT_COMMENT} ${where} ORDER BY ${column} ${dir} LIMIT ? OFFSET ?`,
    [...whereParams, params.pageSize, offset],
  )

  return {
    items: rows.map(toComment),
    total: Number(totalRow?.total ?? 0),
    page: params.page,
    pageSize: params.pageSize,
  }
}

export async function get(id: string): Promise<unknown> {
  const row = await queryOne<Row>(`${SELECT_COMMENT} WHERE c.id = ? LIMIT 1`, [id])
  if (!row) throw notFound('Comment')
  return toComment(row)
}

/** How many are waiting, for the badge on the sidebar. */
export async function pendingCount(): Promise<number> {
  const row = await queryOne<{ n: number }>(
    "SELECT COUNT(*) AS n FROM comments WHERE status = 'pending'",
  )
  return Number(row?.n ?? 0)
}

export async function update(id: string, patch: CommentPatch): Promise<unknown> {
  const existing = await queryOne<Row>('SELECT id FROM comments WHERE id = ? LIMIT 1', [id])
  if (!existing) throw notFound('Comment')

  await execute('UPDATE comments SET status = ?, updated_at = NOW(3) WHERE id = ?', [
    patch.status,
    id,
  ])
  return get(id)
}

export async function remove(ids: string[]): Promise<void> {
  if (ids.length === 0) return
  // Replies cascade — see the note on the foreign key in migration 020.
  await execute(`DELETE FROM comments WHERE id IN (${ids.map(() => '?').join(',')})`, ids)
}

/* ------------------------------------------------------------------ */
/* Public                                                              */
/* ------------------------------------------------------------------ */

/**
 * Records a comment from the website.
 *
 * Always 'pending'. Nothing a stranger writes reaches the site until somebody
 * has read it, which is the only workable default for an open comment form.
 */
export async function submit(
  input: PublicCommentInput,
  context: { blogId: string; ip?: string; userAgent?: string },
): Promise<string> {
  const id = randomUUID()

  await execute(
    `INSERT INTO comments
       (id, blog_id, parent_id, author_name, author_email, body, status, ip, user_agent,
        created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, 'pending', ?, ?, NOW(3), NOW(3))`,
    [
      id,
      context.blogId,
      input.parentId ?? null,
      input.authorName,
      input.email || null,
      input.body,
      context.ip?.slice(0, 45) ?? null,
      context.userAgent?.slice(0, 255) ?? null,
    ],
  )

  return id
}

export interface PublicComment {
  id: string
  parentId?: string
  authorName: string
  body: string
  createdAt: unknown
  replies: PublicComment[]
}

/**
 * The approved comments on one post, threaded.
 *
 * Fetched flat and assembled here rather than with a recursive query: the site
 * renders one level of replies, the volume per post is small, and a self-join
 * per level is a lot of SQL for a shape this shallow.
 *
 * The email and IP columns are deliberately not selected. Nothing that reaches
 * this function can leak them, rather than relying on every caller to strip
 * them.
 */
export async function publicThread(blogId: string): Promise<PublicComment[]> {
  const rows = await query<Row>(
    `SELECT id, parent_id, author_name, body, created_at
       FROM comments
      WHERE blog_id = ? AND status = 'approved'
      ORDER BY created_at ASC`,
    [blogId],
  )

  const byId = new Map<string, PublicComment>()
  for (const row of rows) {
    byId.set(row.id as string, {
      id: row.id as string,
      parentId: (row.parent_id as string) ?? undefined,
      authorName: row.author_name as string,
      body: row.body as string,
      createdAt: row.created_at,
      replies: [],
    })
  }

  const roots: PublicComment[] = []
  for (const comment of byId.values()) {
    // A reply whose parent is not approved is promoted to the top level rather
    // than dropped: the visitor wrote it, a moderator approved it, and hiding
    // it because of a decision about a different comment would be silent.
    const parent = comment.parentId ? byId.get(comment.parentId) : undefined
    if (parent) parent.replies.push(comment)
    else roots.push(comment)
  }

  return roots
}

/**
 * Refuses a repeat submission.
 *
 * The same body from the same address within the hour is a double-click or a
 * script, not a second thought.
 */
export async function isDuplicate(blogId: string, body: string, ip?: string): Promise<boolean> {
  const row = await queryOne<{ n: number }>(
    `SELECT COUNT(*) AS n FROM comments
      WHERE blog_id = ? AND body = ? AND (? IS NULL OR ip = ?)
        AND created_at > NOW() - INTERVAL 1 HOUR`,
    [blogId, body, ip ?? null, ip ?? null],
  )
  return Number(row?.n ?? 0) > 0
}

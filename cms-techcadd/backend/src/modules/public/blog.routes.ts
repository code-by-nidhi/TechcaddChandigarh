import { Router, type Request } from 'express'

import { execute, query, queryOne, type Row } from '../../db/pool.js'
import { assetUrl, withAssetUrls } from '../../http/assetUrl.js'
import { asyncHandler, notFound } from '../../http/errors.js'

/**
 * The blog, in the shape the website already reads.
 *
 * The Hoshiarpur site's blog section was built against a standalone service
 * that this API replaces. Its pages, components and types are unchanged and
 * working, so this router answers on the same paths, with the same field
 * names, rather than asking the site to be rewritten around a CMS-shaped
 * response. The website's only change is which host it points at.
 *
 * Everything here is public and read-only. Two rules hold throughout:
 *   - `status = 'published'` is forced, never read from the query string.
 *   - A publish date in the future is not yet published, so scheduling works
 *     without anything having to run on a timer.
 */
export const publicBlogRouter = Router()

const MAX_LIMIT = 50
const DEFAULT_LIMIT = 9

/**
 * Only what a visitor may see.
 *
 * `publish_date` is a DATE, so a post dated today is live from midnight rather
 * than from the moment it was saved. That matches how an editor thinks about a
 * publication date.
 */
const LIVE = `b.status = 'published' AND (b.publish_date IS NULL OR b.publish_date <= CURDATE())`

/**
 * The author page's address.
 *
 * Falls back to the name when nobody has set one, so a byline always resolves
 * to a page. The same expression is used wherever an author slug is read or
 * matched, so the fallback cannot disagree with itself.
 */
const AUTHOR_SLUG = `COALESCE(NULLIF(u.author_slug, ''), LOWER(REPLACE(u.name, ' ', '-')))`

const SELECT_ARTICLE = `
  SELECT b.id, b.title, b.slug, b.excerpt, b.body, b.blocks, b.publish_date, b.updated_at,
         b.reading_time, b.views, b.featured, b.trending,
         b.meta_title, b.meta_description, b.meta_keywords,
         cov.url  AS cover_url,
         cat.id   AS category_id,    cat.name AS category_name,
         cat.slug AS category_slug,  cat.description AS category_description,
         u.id     AS author_id,      u.name AS author_name,
         ${AUTHOR_SLUG} AS author_slug,
         u.author_title AS author_title,
         av.url   AS author_avatar
    FROM blogs b
    LEFT JOIN media      cov ON cov.id = b.cover_image_id
    LEFT JOIN categories cat ON cat.id = b.category_id
    LEFT JOIN users      u   ON u.id   = b.author_id
    LEFT JOIN media      av  ON av.id  = u.avatar_id
`

const toInt = (value: unknown, fallback: number, max: number): number => {
  const parsed = Number(value)
  if (!Number.isFinite(parsed) || parsed < 1) return fallback
  return Math.min(Math.floor(parsed), max)
}

/** One query for a whole page of posts rather than one per post. */
async function loadTags(ids: string[]): Promise<Map<string, string[]>> {
  const map = new Map<string, string[]>(ids.map((id) => [id, []]))
  if (ids.length === 0) return map

  const rows = await query<Row>(
    `SELECT blog_id, tag FROM blog_tags
      WHERE blog_id IN (${ids.map(() => '?').join(',')}) ORDER BY position`,
    ids,
  )
  for (const row of rows) map.get(row.blog_id as string)?.push(row.tag as string)

  return map
}

/**
 * Tags are free text here and objects on the website.
 *
 * The site's type asks for an id and a slug, which a bare string has neither
 * of. Both are derived from the tag itself, so they are stable across requests
 * without a table that would make adding a tag a two-step job for an editor.
 */
const tagSlug = (tag: string) =>
  tag
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

const toTag = (tag: string) => ({ id: tagSlug(tag), name: tag, slug: tagSlug(tag) })

/**
 * A category is optional on a post but not on the website's card, which prints
 * `category.name` unconditionally. An uncategorised post gets this rather than
 * breaking a page that is otherwise fine.
 */
const UNCATEGORISED = {
  id: 'uncategorised',
  name: 'Uncategorised',
  slug: 'uncategorised',
  description: '',
}

/** Likewise for the byline: a post whose author account was deleted still reads. */
const UNATTRIBUTED = {
  id: 'techcadd',
  name: 'TechCADD',
  slug: 'techcadd',
  avatar: '',
  role: 'TechCADD Chandigarh',
}

function toArticle(req: Request, row: Row, tags: string[]) {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    excerpt: row.excerpt,
    featuredImage: assetUrl(req, row.cover_url),
    readingTime: Number(row.reading_time ?? 1),
    views: Number(row.views ?? 0),
    featured: Boolean(row.featured),
    trending: Boolean(row.trending),
    publishedAt: (row.publish_date as string | null) ?? null,
    category: row.category_id
      ? {
          id: row.category_id,
          name: row.category_name,
          slug: row.category_slug,
          description: row.category_description ?? '',
        }
      : UNCATEGORISED,
    author: row.author_id
      ? {
          id: row.author_id,
          name: row.author_name,
          slug: row.author_slug,
          avatar: assetUrl(req, row.author_avatar),
          role: row.author_title ?? '',
        }
      : UNATTRIBUTED,
    tags: tags.map(toTag),
  }
}

/**
 * The blocks a post is built from, if it has any.
 *
 * Parsed rather than passed through: the column is JSON and mysql2 may hand it
 * back as a string or as an object depending on the driver's mode, and the
 * website should not have to cope with both.
 */
function readBlocks(value: unknown): unknown[] {
  if (value === null || value === undefined) return []
  try {
    const parsed = typeof value === 'string' ? JSON.parse(value) : value
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function toArticleDetail(req: Request, row: Row, tags: string[]) {
  return {
    ...toArticle(req, row, tags),
    content: row.body,
    /*
     * The site renders these when present and falls back to `content` when not.
     *
     * Run through `withAssetUrls` because an image block stores the media path
     * as `/uploads/<name>` — correct for the CMS, and a broken image on the
     * website, which is a different origin. The rest of this router calls
     * `assetUrl` field by field; blocks are a nested shape, so they need the
     * recursive version.
     */
    blocks: withAssetUrls(req, readBlocks(row.blocks)),
    updatedAt: row.updated_at,
    seo: {
      // The article's own title is a perfectly good meta title; an editor only
      // fills these in when they want a different one.
      title: (row.meta_title as string | null) || (row.title as string),
      description: (row.meta_description as string | null) || (row.excerpt as string),
      keywords: (row.meta_keywords as string[] | null) ?? [],
    },
  }
}

/** Attaches tags to a page of rows in one round trip. */
async function withTags(req: Request, rows: Row[]) {
  const tags = await loadTags(rows.map((row) => row.id as string))
  return rows.map((row) => toArticle(req, row, tags.get(row.id as string) ?? []))
}

/* ------------------------------------------------------------------ */
/* Listing                                                             */
/* ------------------------------------------------------------------ */

const SORTS: Record<string, string> = {
  latest: 'b.publish_date DESC, b.created_at DESC',
  oldest: 'b.publish_date ASC, b.created_at ASC',
  popular: 'b.views DESC, b.publish_date DESC',
  trending: 'b.trending DESC, b.publish_date DESC',
}

/**
 * Builds the WHERE clause for a listing request.
 *
 * Every value arrives as a bound parameter — the only thing interpolated into
 * the SQL is the sort clause, and that comes from the map above rather than
 * from the caller.
 */
function listWhere(req: Request): { sql: string; params: unknown[] } {
  const clauses: string[] = [LIVE]
  const params: unknown[] = []
  const { category, tag, author, search, exclude } = req.query

  if (typeof category === 'string' && category && category !== 'all') {
    clauses.push('cat.slug = ?')
    params.push(category)
  }
  if (typeof author === 'string' && author) {
    clauses.push(`${AUTHOR_SLUG} = ?`)
    params.push(author)
  }
  if (typeof tag === 'string' && tag) {
    clauses.push('EXISTS (SELECT 1 FROM blog_tags bt WHERE bt.blog_id = b.id AND bt.tag = ?)')
    params.push(tag)
  }
  if (typeof search === 'string' && search.trim()) {
    const like = `%${search.trim()}%`
    clauses.push('(b.title LIKE ? OR b.excerpt LIKE ?)')
    params.push(like, like)
  }
  if (typeof exclude === 'string' && exclude) {
    clauses.push('b.slug <> ?')
    params.push(exclude)
  }

  return { sql: `WHERE ${clauses.join(' AND ')}`, params }
}

publicBlogRouter.get(
  '/posts',
  asyncHandler(async (req, res) => {
    const limit = toInt(req.query.limit, DEFAULT_LIMIT, MAX_LIMIT)
    const page = toInt(req.query.page, 1, 10_000)
    const order = SORTS[String(req.query.sort ?? 'latest')] ?? SORTS.latest

    const { sql: where, params } = listWhere(req)

    const totalRow = await queryOne<{ total: number }>(
      `SELECT COUNT(*) AS total
         FROM blogs b
         LEFT JOIN categories cat ON cat.id = b.category_id
         LEFT JOIN users      u   ON u.id   = b.author_id
        ${where}`,
      params,
    )
    const total = Number(totalRow?.total ?? 0)

    const rows = await query<Row>(
      `${SELECT_ARTICLE} ${where} ORDER BY ${order} LIMIT ? OFFSET ?`,
      [...params, limit, (page - 1) * limit],
    )

    res.json({
      data: await withTags(req, rows),
      meta: {
        page,
        limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / limit)),
        hasMore: page * limit < total,
      },
    })
  }),
)

/* ------------------------------------------------------------------ */
/* Rails                                                               */
/* ------------------------------------------------------------------ */

/**
 * The story that leads the index.
 *
 * Falls back to the newest post when nobody has chosen one, so the slot is
 * never empty on a blog that has articles in it. `null` only when there are
 * none at all — the website then renders nothing rather than a gap.
 */
publicBlogRouter.get(
  '/featured',
  asyncHandler(async (req, res) => {
    const row = await queryOne<Row>(
      `${SELECT_ARTICLE} WHERE ${LIVE} ORDER BY b.featured DESC, b.publish_date DESC LIMIT 1`,
    )
    if (!row) {
      res.json(null)
      return
    }

    const tags = await loadTags([row.id as string])
    res.json(toArticle(req, row, tags.get(row.id as string) ?? []))
  }),
)

publicBlogRouter.get(
  '/trending',
  asyncHandler(async (req, res) => {
    const limit = toInt(req.query.limit, 5, 10)
    const rows = await query<Row>(
      `${SELECT_ARTICLE} WHERE ${LIVE}
        ORDER BY b.trending DESC, b.views DESC, b.publish_date DESC LIMIT ?`,
      [limit],
    )
    res.json(await withTags(req, rows))
  }),
)

/**
 * Editor's picks.
 *
 * The posts an editor marked trending, minus whatever is already on screen.
 * There is no separate "pick" flag: a second hand-curated list is one more
 * thing to keep current, and in practice the same posts fill both.
 */
publicBlogRouter.get(
  '/editors-picks',
  asyncHandler(async (req, res) => {
    const limit = toInt(req.query.limit, 3, 6)
    const exclude = typeof req.query.exclude === 'string' ? req.query.exclude : null

    const rows = await query<Row>(
      `${SELECT_ARTICLE} WHERE ${LIVE} ${exclude ? 'AND b.slug <> ?' : ''}
        ORDER BY b.trending DESC, b.views DESC, b.publish_date DESC LIMIT ?`,
      exclude ? [exclude, limit] : [limit],
    )
    res.json(await withTags(req, rows))
  }),
)

/**
 * More from the same category, then anything else recent.
 *
 * Topped up rather than left short: a category with one article in it would
 * otherwise render an empty rail at the foot of that article.
 */
publicBlogRouter.get(
  '/posts/:slug/related',
  asyncHandler(async (req, res) => {
    const limit = toInt(req.query.limit, 3, 6)
    const slug = req.params.slug as string

    const rows = await query<Row>(
      `${SELECT_ARTICLE}
        WHERE ${LIVE} AND b.slug <> ?
        ORDER BY (b.category_id IS NOT NULL AND b.category_id =
                   (SELECT category_id FROM blogs WHERE slug = ?)) DESC,
                 b.publish_date DESC
        LIMIT ?`,
      [slug, slug, limit],
    )
    res.json(await withTags(req, rows))
  }),
)

/* ------------------------------------------------------------------ */
/* Categories and authors                                              */
/* ------------------------------------------------------------------ */

/**
 * Only categories that have something published in them.
 *
 * The website renders these as a filter row, and a pill that leads to an empty
 * page is worse than no pill.
 */
publicBlogRouter.get(
  '/categories',
  asyncHandler(async (_req, res) => {
    const rows = await query<Row>(
      `SELECT cat.id, cat.name, cat.slug, cat.description, cat.sort_order,
              COUNT(b.id) AS article_count
         FROM categories cat
         JOIN blogs b ON b.category_id = cat.id AND ${LIVE}
        GROUP BY cat.id, cat.name, cat.slug, cat.description, cat.sort_order
        ORDER BY cat.sort_order ASC, cat.name ASC`,
    )

    res.json(
      rows.map((row) => ({
        id: row.id,
        name: row.name,
        slug: row.slug,
        description: row.description ?? '',
        articleCount: Number(row.article_count),
      })),
    )
  }),
)

publicBlogRouter.get(
  '/authors/:slug',
  asyncHandler(async (req, res) => {
    const row = await queryOne<Row>(
      `SELECT u.id, u.name, u.author_title, u.author_bio, u.author_social,
              ${AUTHOR_SLUG} AS author_slug,
              av.url AS avatar_url,
              (SELECT COUNT(*) FROM blogs b WHERE b.author_id = u.id AND ${LIVE}) AS article_count
         FROM users u
         LEFT JOIN media av ON av.id = u.avatar_id
        WHERE ${AUTHOR_SLUG} = ? LIMIT 1`,
      [req.params.slug],
    )
    if (!row) throw notFound('Author')

    res.json({
      id: row.id,
      name: row.name,
      slug: row.author_slug,
      avatar: assetUrl(req, row.avatar_url),
      role: row.author_title ?? '',
      bio: row.author_bio ?? '',
      socialLinks: (row.author_social as Record<string, string> | null) ?? {},
      articleCount: Number(row.article_count),
    })
  }),
)

/* ------------------------------------------------------------------ */
/* One article                                                         */
/* ------------------------------------------------------------------ */

/**
 * Registered after `/posts/:slug/related`, so Express matches the longer route
 * first rather than reading "related" as part of a slug.
 */
publicBlogRouter.get(
  '/posts/:slug',
  asyncHandler(async (req, res) => {
    const row = await queryOne<Row>(`${SELECT_ARTICLE} WHERE ${LIVE} AND b.slug = ? LIMIT 1`, [
      req.params.slug,
    ])
    if (!row) throw notFound('Article')

    const tags = await loadTags([row.id as string])
    res.json(toArticleDetail(req, row, tags.get(row.id as string) ?? []))

    /*
     * Counted after the response, and deliberately not awaited: a view is a
     * rough popularity signal, and a reader should never wait on — or lose an
     * article to — a counter. `updated_at` is left alone, so a view does not
     * show up as an edit in the CMS listing.
     */
    void execute('UPDATE blogs SET views = views + 1 WHERE id = ?', [row.id]).catch(
      (error: unknown) => {
        console.warn('[blog] could not record a view:', error)
      },
    )
  }),
)

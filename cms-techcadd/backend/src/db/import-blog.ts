import { randomBytes, randomUUID } from 'node:crypto'
import { copyFile, readFile, stat } from 'node:fs/promises'
import { basename, extname, join, resolve } from 'node:path'
import { DatabaseSync } from 'node:sqlite'

import { hashPassword } from '../modules/auth/auth.service.js'
import { readDimensions } from '../modules/media/dimensions.js'
import {
  ensureUploadRoot,
  publicUrl,
  storedName,
  uploadRoot,
} from '../modules/media/storage.js'
import { execute, pool, queryOne, type Row } from './pool.js'

/**
 * Brings the blog across from the standalone NestJS API.
 *
 * That service kept its articles in a SQLite file and had no admin interface;
 * this CMS replaces it. The articles, their authors, categories, tags,
 * artwork and the newsletter list are real published content, so they move
 * rather than being abandoned in a file nobody can edit.
 *
 * Read-only against SQLite — the source database is never written to, so it
 * remains a usable fallback until someone is satisfied the move worked.
 *
 *   npm run db:import:blog                 (default paths)
 *   npm run db:import:blog -- <db> <site>  (explicit paths)
 *
 * Idempotent: every row is matched by slug or email first, so running it twice
 * imports nothing the second time and never overwrites an edit made since.
 */

/** Defaults assume the three projects sit side by side in one repository. */
const sqlitePath = resolve(
  process.argv[2] ?? join(process.cwd(), '..', '..', 'server', 'prisma', 'dev.db'),
)

/**
 * Where the article artwork lives.
 *
 * The old API stored a site-relative path (`/images/ai.webp`) because the
 * website served the file itself. The CMS owns its media instead, so the files
 * are copied into the library and referenced by id — which is what lets an
 * editor replace a cover without touching the filesystem.
 */
const sitePublicDir = resolve(
  process.argv[3] ?? join(process.cwd(), '..', '..', 'techcadd-hero', 'public'),
)

const MIME_BY_EXTENSION: Record<string, string> = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
}

interface Counts {
  authors: number
  categories: number
  media: number
  articles: number
  /** Articles already here that were missing their publication date. */
  dated: number
  subscribers: number
  skipped: string[]
}

const counts: Counts = {
  authors: 0,
  categories: 0,
  media: 0,
  articles: 0,
  dated: 0,
  subscribers: 0,
  skipped: [],
}

/**
 * Copies one image into the media library and returns its id.
 *
 * A file that is not there is not a reason to lose the article — the cover is
 * left empty, the site falls back to its house image, and the omission is
 * reported at the end rather than passing silently.
 */
const mediaCache = new Map<string, string | null>()

async function importImage(path: string, alt: string): Promise<string | null> {
  if (!path) return null

  const cached = mediaCache.get(path)
  if (cached !== undefined) return cached

  // The stored path is site-relative and attacker-irrelevant here, but it is
  // still resolved against the public directory and checked, so a `../` in the
  // source database cannot reach outside it.
  const source = resolve(sitePublicDir, `.${path.startsWith('/') ? path : `/${path}`}`)
  if (!source.startsWith(sitePublicDir)) {
    counts.skipped.push(`image outside the public directory: ${path}`)
    mediaCache.set(path, null)
    return null
  }

  const extension = extname(source).toLowerCase()
  const mimeType = MIME_BY_EXTENSION[extension]
  if (!mimeType) {
    counts.skipped.push(`unsupported image type: ${path}`)
    mediaCache.set(path, null)
    return null
  }

  let bytes: Buffer
  try {
    bytes = await readFile(source)
  } catch {
    counts.skipped.push(`image not found on disk: ${path}`)
    mediaCache.set(path, null)
    return null
  }

  // Reuse a file already in the library, so a second run does not fill the
  // uploads directory with copies of the same picture.
  const existing = await queryOne<Row>('SELECT id FROM media WHERE filename = ? LIMIT 1', [
    basename(source),
  ])
  if (existing) {
    mediaCache.set(path, existing.id as string)
    return existing.id as string
  }

  const name = storedName(mimeType, basename(source))
  await copyFile(source, join(uploadRoot, name))

  const id = randomUUID()
  const { width, height } = readDimensions(bytes)
  const { size } = await stat(source)

  await execute(
    `INSERT INTO media (id, filename, url, mime_type, size, width, height, alt, folder,
                        created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'blog', NOW(3), NOW(3))`,
    [id, basename(source), publicUrl(name), mimeType, size, width ?? null, height ?? null, alt],
  )

  counts.media += 1
  mediaCache.set(path, id)
  return id
}

/**
 * An author becomes an inactive account.
 *
 * A byline has to point at a `users` row — that is what the blog's foreign key
 * says. `active = 0` is what keeps it a byline and not a way in: the account
 * carries a random password nobody has and cannot sign in, and it is excluded
 * from the "is this the last administrator" guard for the same reason.
 */
async function importAuthor(author: Row): Promise<string> {
  const slug = String(author.slug)

  const existing = await queryOne<Row>('SELECT id FROM users WHERE author_slug = ? LIMIT 1', [slug])
  if (existing) return existing.id as string

  // Placeholder addresses on a domain that cannot receive mail, so a stray
  // notification bounces rather than reaching a real inbox.
  const email = `${slug}@authors.invalid`
  const byEmail = await queryOne<Row>('SELECT id FROM users WHERE email = ? LIMIT 1', [email])
  if (byEmail) return byEmail.id as string

  const id = randomUUID()
  await execute(
    `INSERT INTO users (id, name, email, password_hash, role, active,
                        author_slug, author_title, author_bio, author_social,
                        created_at, updated_at)
     VALUES (?, ?, ?, ?, 'admin', 0, ?, ?, ?, ?, NOW(3), NOW(3))`,
    [
      id,
      String(author.name),
      email,
      await hashPassword(randomBytes(24).toString('base64url')),
      slug,
      author.role ? String(author.role) : null,
      author.bio ? String(author.bio) : null,
      // Stored as a JSON string by the old schema, because SQLite has no JSON
      // column. Parsed here so it lands in a real one.
      JSON.stringify(safeJson(author.socialLinks)),
    ],
  )

  counts.authors += 1
  return id
}

function safeJson(value: unknown): Record<string, string> {
  if (typeof value !== 'string' || !value) return {}
  try {
    const parsed: unknown = JSON.parse(value)
    return parsed && typeof parsed === 'object' ? (parsed as Record<string, string>) : {}
  } catch {
    return {}
  }
}

async function importCategory(category: Row): Promise<string> {
  const slug = String(category.slug)

  const existing = await queryOne<Row>('SELECT id FROM categories WHERE slug = ? LIMIT 1', [slug])
  if (existing) return existing.id as string

  const id = randomUUID()
  await execute(
    `INSERT INTO categories (id, name, slug, description, sort_order, status, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, 'published', NOW(3), NOW(3))`,
    [
      id,
      String(category.name),
      slug,
      category.description ? String(category.description) : null,
      Number(category.position ?? 0),
    ],
  )

  counts.categories += 1
  return id
}

/** The old schema stored keywords as a comma-separated string. */
function keywords(value: unknown): string[] {
  if (typeof value !== 'string' || !value.trim()) return []
  return value
    .split(',')
    .map((word) => word.trim())
    .filter(Boolean)
}

/**
 * A timestamp out of SQLite, whichever way it was written.
 *
 * Prisma stores DateTime in SQLite as milliseconds since the epoch, but a row
 * inserted by hand may hold an ISO string. Both are accepted; anything else is
 * treated as absent rather than crashing the import over one bad field.
 */
function toDate(value: unknown): Date | null {
  if (value === null || value === undefined || value === '') return null

  const date = typeof value === 'number' || typeof value === 'bigint'
    ? new Date(Number(value))
    : new Date(String(value))

  return Number.isNaN(date.getTime()) ? null : date
}

/** The DATE column the CMS publishes on. */
function publishDate(value: unknown): string | null {
  return toDate(value)?.toISOString().slice(0, 10) ?? null
}

/** The DATETIME(3) format MySQL accepts without a driver conversion. */
function dateTime(value: unknown): string {
  return (toDate(value) ?? new Date()).toISOString().slice(0, 19).replace('T', ' ')
}

async function main(): Promise<void> {
  await ensureUploadRoot()

  const db = new DatabaseSync(sqlitePath, { readOnly: true })

  const articles = db
    .prepare(
      `SELECT a.*, c.slug AS category_slug, au.slug AS author_slug
         FROM Article a
         LEFT JOIN Category c ON c.id = a.categoryId
         LEFT JOIN Author  au ON au.id = a.authorId
        ORDER BY a.publishedAt`,
    )
    .all() as Row[]

  const authors = db.prepare('SELECT * FROM Author').all() as Row[]
  const categories = db.prepare('SELECT * FROM Category').all() as Row[]
  const subscribers = db.prepare('SELECT * FROM NewsletterSubscriber').all() as Row[]
  /*
   * Prisma's implicit many-to-many table is named after the relation, with the
   * two sides in alphabetical order of their models: A is the Article, B is
   * the Tag. Getting that pair the wrong way round returns no rows rather than
   * failing, which is why it is written out here.
   */
  const tagStatement = db.prepare(
    `SELECT t.name FROM Tag t
       JOIN _ArticleTags at ON at.B = t.id
      WHERE at.A = ?
      ORDER BY t.name`,
  )

  // Built up front so an article never has to look one up mid-insert.
  const authorIds = new Map<string, string>()
  for (const author of authors) authorIds.set(String(author.slug), await importAuthor(author))

  const categoryIds = new Map<string, string>()
  for (const category of categories) {
    categoryIds.set(String(category.slug), await importCategory(category))
  }

  for (const article of articles) {
    const slug = String(article.slug)

    const existing = await queryOne<Row>(
      'SELECT id, publish_date FROM blogs WHERE slug = ? LIMIT 1',
      [slug],
    )

    /*
     * An article already here keeps whatever an editor has done to it — only
     * its tags and a missing publication date are reconciled below. That is
     * what makes a second run safe after a first one stopped part way through.
     */
    const id = (existing?.id as string | undefined) ?? randomUUID()

    /*
     * A date only where there is none.
     *
     * The blog orders by publication date, so an article without one sinks to
     * the bottom of every listing and its cards print no date at all. An
     * article an editor has since dated is left alone — this fills a gap, it
     * does not overwrite a decision.
     */
    if (existing && !existing.publish_date) {
      const date = publishDate(article.publishedAt)
      if (date) {
        await execute('UPDATE blogs SET publish_date = ? WHERE id = ?', [date, id])
        counts.dated += 1
      }
    }

    if (!existing) {
      const coverId = await importImage(String(article.featuredImage ?? ''), String(article.title))

      await execute(
        `INSERT INTO blogs (id, title, slug, author_id, category_id, cover_image_id, excerpt, body,
                            publish_date, status, featured, trending, reading_time, views,
                            meta_title, meta_description, meta_keywords, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(3), NOW(3))`,
        [
          id,
          String(article.title),
          slug,
          authorIds.get(String(article.author_slug)) ?? null,
          categoryIds.get(String(article.category_slug)) ?? null,
          coverId,
          String(article.excerpt ?? ''),
          String(article.content ?? ''),
          publishDate(article.publishedAt),
          // 'archived' has no equivalent here; the nearest honest state is a
          // draft, which is off the website but still editable.
          article.status === 'published' ? 'published' : 'draft',
          article.featured ? 1 : 0,
          article.trending ? 1 : 0,
          Number(article.readingTime ?? 1),
          Number(article.views ?? 0),
          article.seoTitle ? String(article.seoTitle) : null,
          article.seoDescription ? String(article.seoDescription) : null,
          JSON.stringify(keywords(article.seoKeywords)),
        ],
      )

      counts.articles += 1
    }

    // The join table stores the article id as text; the driver needs it typed.
    const tags = tagStatement.all(String(article.id)) as Row[]
    let position = 0
    for (const tag of tags) {
      // The primary key is (blog_id, tag), so IGNORE makes this a no-op on a
      // tag that is already recorded rather than aborting the run.
      await execute('INSERT IGNORE INTO blog_tags (blog_id, tag, position) VALUES (?, ?, ?)', [
        id,
        String(tag.name),
        position,
      ])
      position += 1
    }
  }

  for (const subscriber of subscribers) {
    const email = String(subscriber.email).toLowerCase()
    const existing = await queryOne<Row>(
      'SELECT id FROM newsletter_subscribers WHERE email = ? LIMIT 1',
      [email],
    )
    if (existing) continue

    await execute(
      `INSERT INTO newsletter_subscribers (id, email, status, source, subscribed_at,
                                           created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, NOW(3), NOW(3))`,
      [
        randomUUID(),
        email,
        subscriber.status === 'unsubscribed' ? 'unsubscribed' : 'active',
        String(subscriber.source ?? 'blog'),
        dateTime(subscriber.subscribedAt),
      ],
    )
    counts.subscribers += 1
  }

  db.close()

  /*
   * At most one article may lead the blog. The old schema allowed several, so
   * the newest keeps the slot and the rest are demoted — the same rule the API
   * applies on every save.
   */
  const lead = await queryOne<Row>(
    "SELECT id FROM blogs WHERE featured = 1 AND status = 'published' ORDER BY publish_date DESC LIMIT 1",
  )
  if (lead) {
    await execute('UPDATE blogs SET featured = 0 WHERE featured = 1 AND id <> ?', [lead.id])
  }

  console.log(`\nImported from ${sqlitePath}:`)
  console.log(`  authors      ${counts.authors} added as inactive byline accounts`)
  console.log(`  categories   ${counts.categories} added`)
  console.log(`  images       ${counts.media} copied into the media library`)
  console.log(`  articles     ${counts.articles} added`)
  console.log(`  subscribers  ${counts.subscribers} added`)
  if (counts.dated > 0) {
    console.log(`  dates        ${counts.dated} existing article(s) given their publication date`)
  }

  if (counts.skipped.length > 0) {
    console.log('\nNot imported:')
    for (const note of [...new Set(counts.skipped)]) console.log(`  - ${note}`)
  }

  console.log('\nThe source database was not modified. Safe to run again.')
}

main()
  .catch((error: unknown) => {
    console.error('Import failed:', error instanceof Error ? error.message : error)
    process.exitCode = 1
  })
  .finally(() => pool.end())

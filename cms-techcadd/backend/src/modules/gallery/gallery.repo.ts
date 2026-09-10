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
import type { AlbumInput, AlbumPatch, GalleryImage } from './gallery.schema.js'

const SORTABLE: Record<string, string> = {
  title: 'a.title',
  category: 'a.category',
  order: 'a.sort_order',
  status: 'a.status',
  createdAt: 'a.created_at',
  updatedAt: 'a.updated_at',
}

const FILTERABLE: Record<string, string> = {
  status: 'a.status',
  category: 'a.category',
  createdAt: 'a.created_at',
  updatedAt: 'a.updated_at',
}

const SELECT_ALBUM = `
  SELECT a.*, m.url AS cover_url, m.alt AS cover_alt
    FROM gallery_albums a
    LEFT JOIN media m ON m.id = a.cover_id
`

interface ResolvedImage {
  id: string
  mediaId: string
  caption: string
  url: string
  alt: string
  width?: number
  height?: number
}

function toAlbum(row: Row, images: ResolvedImage[] = []): unknown {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    description: row.description ?? '',
    category: row.category,
    cover: row.cover_id
      ? { id: row.cover_id, url: row.cover_url, alt: row.cover_alt ?? '' }
      : undefined,
    // Falls back to the first image so an album always has something to show
    // in a grid — an editor who never picked a cover still gets a tile.
    thumbnail: row.cover_url
      ? { url: row.cover_url, alt: row.cover_alt ?? '' }
      : images[0]
        ? { url: images[0].url, alt: images[0].caption || images[0].alt }
        : undefined,
    images,
    imageCount: images.length,
    order: Number(row.sort_order),
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

/** One query for a whole page of albums rather than one per album. */
async function loadImages(albumIds: string[]): Promise<Map<string, ResolvedImage[]>> {
  const map = new Map<string, ResolvedImage[]>(albumIds.map((id) => [id, []]))
  if (albumIds.length === 0) return map

  const rows = await query<Row>(
    `SELECT gi.id, gi.album_id, gi.media_id, gi.caption,
            m.url, m.alt, m.width, m.height
       FROM gallery_images gi
       JOIN media m ON m.id = gi.media_id
      WHERE gi.album_id IN (${albumIds.map(() => '?').join(',')})
      ORDER BY gi.sort_order`,
    albumIds,
  )

  for (const row of rows) {
    map.get(row.album_id as string)?.push({
      id: row.id as string,
      mediaId: row.media_id as string,
      caption: (row.caption as string) ?? '',
      url: row.url as string,
      alt: (row.alt as string) ?? '',
      width: row.width ? Number(row.width) : undefined,
      height: row.height ? Number(row.height) : undefined,
    })
  }

  return map
}

export async function list(params: ListParams): Promise<ListResult<unknown>> {
  const { sql: filterSql, params: filterParams } = buildFilters(params.filters, FILTERABLE)
  const { column, dir } = resolveSort(params.sort, SORTABLE, { column: 'a.sort_order', dir: 'asc' })

  const searchSql = params.search ? ' AND (a.title LIKE ? OR a.description LIKE ?)' : ''
  const like = `%${params.search ?? ''}%`
  const searchParams = params.search ? [like, like] : []

  const where = `WHERE 1=1${filterSql}${searchSql}`
  const whereParams = [...filterParams, ...searchParams]

  const totalRow = await queryOne<{ total: number }>(
    `SELECT COUNT(*) AS total FROM gallery_albums a ${where}`,
    whereParams,
  )

  const offset = (params.page - 1) * params.pageSize
  const rows = await query<Row>(
    `${SELECT_ALBUM} ${where} ORDER BY ${column} ${dir} LIMIT ? OFFSET ?`,
    [...whereParams, params.pageSize, offset],
  )

  const images = await loadImages(rows.map((row) => row.id as string))

  return {
    items: rows.map((row) => toAlbum(row, images.get(row.id as string) ?? [])),
    total: Number(totalRow?.total ?? 0),
    page: params.page,
    pageSize: params.pageSize,
  }
}

export async function get(id: string): Promise<unknown> {
  const row = await queryOne<Row>(`${SELECT_ALBUM} WHERE a.id = ? LIMIT 1`, [id])
  if (!row) throw notFound('Album')

  const images = await loadImages([id])
  return toAlbum(row, images.get(id) ?? [])
}

async function assertSlugFree(slug: string, exceptId?: string): Promise<void> {
  const clash = await queryOne<Row>(
    `SELECT id FROM gallery_albums WHERE slug = ?${exceptId ? ' AND id <> ?' : ''} LIMIT 1`,
    exceptId ? [slug, exceptId] : [slug],
  )
  if (clash) throw unprocessable({ slug: 'This slug is already in use.' })
}

/**
 * Replaces an album's tiles.
 *
 * Deleted and reinserted rather than diffed: the list is short, order is a
 * column, and a diff would have to reconcile reordering with insertion for no
 * practical gain on a form that saves a dozen rows at most.
 */
async function writeImages(
  connection: PoolConnection,
  albumId: string,
  images: GalleryImage[],
): Promise<void> {
  await connection.execute<ResultSetHeader>('DELETE FROM gallery_images WHERE album_id = ?', [
    albumId,
  ])

  let position = 0
  for (const image of images) {
    await connection.execute<ResultSetHeader>(
      `INSERT INTO gallery_images (id, album_id, media_id, caption, sort_order, created_at)
       VALUES (?, ?, ?, ?, ?, NOW(3))`,
      [toStorableId(image.id), albumId, image.mediaId, image.caption ?? '', position++],
    )
  }
}

const nullable = (value: string | null | undefined) => (value ? value : null)

export async function create(input: AlbumInput): Promise<unknown> {
  await assertSlugFree(input.slug)

  const id = randomUUID()
  await transaction(async (connection) => {
    await connection.execute<ResultSetHeader>(
      `INSERT INTO gallery_albums
         (id, title, slug, description, category, cover_id, sort_order, status, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(3), NOW(3))`,
      [
        id,
        input.title,
        input.slug,
        nullable(input.description),
        input.category,
        input.cover?.id ?? null,
        input.order,
        input.status,
      ],
    )
    await writeImages(connection, id, input.images)
  })

  return get(id)
}

export async function update(id: string, patch: AlbumPatch): Promise<unknown> {
  const existing = await queryOne<Row>('SELECT id FROM gallery_albums WHERE id = ? LIMIT 1', [id])
  if (!existing) throw notFound('Album')
  if (patch.slug) await assertSlugFree(patch.slug, id)

  const direct: Record<string, string> = {
    title: 'title',
    slug: 'slug',
    category: 'category',
    order: 'sort_order',
    status: 'status',
  }

  const clearable: Record<string, string> = {
    description: 'description',
  }

  await transaction(async (connection) => {
    const assignments: string[] = []
    const params: unknown[] = []

    for (const [key, column] of Object.entries(direct)) {
      const value = patch[key as keyof AlbumPatch]
      if (value === undefined) continue
      assignments.push(`${column} = ?`)
      params.push(value)
    }

    for (const [key, column] of Object.entries(clearable)) {
      const value = patch[key as keyof AlbumPatch]
      if (value === undefined) continue
      assignments.push(`${column} = ?`)
      params.push(nullable(value as string | null | undefined))
    }

    if (patch.cover !== undefined) {
      assignments.push('cover_id = ?')
      params.push(patch.cover?.id ?? null)
    }

    if (assignments.length > 0) {
      await connection.execute<ResultSetHeader>(
        `UPDATE gallery_albums SET ${assignments.join(', ')}, updated_at = NOW(3) WHERE id = ?`,
        [...params, id] as ExecuteValues,
      )
    }

    // Only when the form sent one: an absent `images` means the caller did not
    // touch them, and a reorder patch must not empty the album.
    if (patch.images !== undefined) await writeImages(connection, id, patch.images)
  })

  return get(id)
}

export async function remove(ids: string[]): Promise<void> {
  if (ids.length === 0) return
  // `gallery_images` cascades; the media itself is left in the library.
  await execute(`DELETE FROM gallery_albums WHERE id IN (${ids.map(() => '?').join(',')})`, ids)
}

/** The distinct categories in use, so the form can offer them. */
export async function categories(): Promise<string[]> {
  const rows = await query<{ category: string }>(
    'SELECT DISTINCT category FROM gallery_albums ORDER BY category',
  )
  return rows.map((row) => row.category)
}

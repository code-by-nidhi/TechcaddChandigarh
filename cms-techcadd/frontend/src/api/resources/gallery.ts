import type { BaseEntity, GalleryAlbum } from '../../types'
import { createHttpResource } from '../http/resource'

export type AlbumCreate = Omit<GalleryAlbum, keyof BaseEntity | 'cover' | 'imageCount'>
export type AlbumUpdate = Partial<AlbumCreate>

/** Live against the Express API. */
export const galleryApi = createHttpResource<GalleryAlbum, AlbumCreate, AlbumUpdate>('/gallery')

import type { BaseEntity, Blog } from '../../types'
import { createHttpResource } from '../http/resource'

/**
 * `readingTime` and `views` are omitted: the API derives one from the body on
 * save and counts the other when the website serves an article. Sending either
 * would be the CMS asserting a value it is not the source of.
 */
export type BlogCreate = Omit<Blog, keyof BaseEntity | 'readingTime' | 'views'>
export type BlogUpdate = Partial<BlogCreate>

/** Live against the Express API. */
export const blogsApi = createHttpResource<Blog, BlogCreate, BlogUpdate>('/blogs')

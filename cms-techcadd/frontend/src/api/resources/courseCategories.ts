import type { BaseEntity, CourseCategory } from '../../types'
import { createHttpResource } from '../http/resource'

export type CourseCategoryCreate = Omit<CourseCategory, keyof BaseEntity | 'courseCount'>
export type CourseCategoryUpdate = Partial<CourseCategoryCreate>

/** Live against the Express API. */
export const courseCategoriesApi = createHttpResource<
  CourseCategory,
  CourseCategoryCreate,
  CourseCategoryUpdate
>('/course-categories')

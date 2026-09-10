import type { BaseEntity, Course } from '../../types'
import { createHttpResource } from '../http/resource'

export type CourseCreate = Omit<Course, keyof BaseEntity | 'category'>
export type CourseUpdate = Partial<CourseCreate>

/** Live against the Express API. */
export const coursesApi = createHttpResource<Course, CourseCreate, CourseUpdate>('/courses')

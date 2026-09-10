import { courseCategoriesApi } from '../../api'
import { createResourceHooks } from '../shared/createResourceHooks'

export const courseCategoryHooks = createResourceHooks('course-categories', courseCategoriesApi)

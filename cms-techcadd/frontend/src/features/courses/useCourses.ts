import { coursesApi } from '../../api'
import { createResourceHooks } from '../shared/createResourceHooks'

export const courseHooks = createResourceHooks('courses', coursesApi)

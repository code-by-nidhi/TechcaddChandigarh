import { enquiriesApi, usersApi } from '../../api'
import { createResourceHooks } from '../shared/createResourceHooks'

export const enquiryHooks = createResourceHooks('enquiries', enquiriesApi)
export const userRefHooks = createResourceHooks('users', usersApi)

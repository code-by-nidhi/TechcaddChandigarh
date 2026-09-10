import { usersApi } from '../../api'
import { createResourceHooks } from '../shared/createResourceHooks'

/**
 * The people who can sign in.
 *
 * "Team" in the sidebar, `users` in the API — the API name is the record, the
 * sidebar name is what the people using it call each other.
 */
export const teamHooks = createResourceHooks('users', usersApi)

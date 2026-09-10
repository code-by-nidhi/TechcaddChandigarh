import { newsletterApi } from '../../api'
import { createResourceHooks } from '../shared/createResourceHooks'

export const newsletterHooks = createResourceHooks('newsletter', newsletterApi)

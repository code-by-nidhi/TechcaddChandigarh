import { eventsApi } from '../../api'
import { createResourceHooks } from '../shared/createResourceHooks'

export const eventHooks = createResourceHooks('events', eventsApi)

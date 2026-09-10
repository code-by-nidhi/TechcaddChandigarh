import type { BaseEntity, CampusEvent } from '../../types'
import { createHttpResource } from '../http/resource'

export type EventCreate = Omit<CampusEvent, keyof BaseEntity | 'cover'>
export type EventUpdate = Partial<EventCreate>

/** Live against the Express API. */
export const eventsApi = createHttpResource<CampusEvent, EventCreate, EventUpdate>('/events')

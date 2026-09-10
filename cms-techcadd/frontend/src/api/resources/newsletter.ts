import type { BaseEntity, Subscriber } from '../../types'
import { createHttpResource } from '../http/resource'

/**
 * Read, filter and delete only.
 *
 * `create` is inherited from the shared resource and never called: a
 * subscriber is someone who chose to subscribe, so the only way onto this list
 * is the public form. The API has no create route to back it either.
 */
export type SubscriberUpdate = Partial<Pick<Subscriber, 'status'>>

export const newsletterApi = createHttpResource<
  Subscriber,
  Omit<Subscriber, keyof BaseEntity>,
  SubscriberUpdate
>('/newsletter')

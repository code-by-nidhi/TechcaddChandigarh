import { z } from 'zod'

export const SUBSCRIBER_STATUSES = ['active', 'unsubscribed'] as const

/**
 * What the public form may send.
 *
 * Deliberately narrow: `status` belongs to the subscriber, who sets it by
 * subscribing or unsubscribing, and a form that could post it would let anyone
 * mark an address unsubscribed on its owner's behalf.
 */
export const subscribeSchema = z.object({
  email: z.email('Enter a valid email address.').max(190),
  /** Attribution only — which form on the site it came from. */
  source: z.string().max(32).default('blog'),
})

/** What an administrator may change: the status, and nothing else. */
export const subscriberPatchSchema = z.object({
  status: z.enum(SUBSCRIBER_STATUSES),
})

export type SubscribeInput = z.infer<typeof subscribeSchema>
export type SubscriberPatch = z.infer<typeof subscriberPatchSchema>

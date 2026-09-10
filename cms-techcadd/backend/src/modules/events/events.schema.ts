import { z } from 'zod'

import { mediaRef } from '../shared/mediaRef.js'

export const EVENT_TYPES = ['Summit', 'Workshop', 'Seminar', 'Drive', 'Webinar', 'Other'] as const

/**
 * One line of the agenda.
 *
 * `time` is free text rather than a time input: the site's agendas read "09:30"
 * for a one-day summit and "Day 1" for a four-day workshop, and both are what
 * the editor means. A time picker would make the second one unsayable.
 */
const agendaItemSchema = z.object({
  id: z.string().max(64).optional(),
  time: z.string().min(1, 'Give the slot a time or a day.').max(60),
  item: z.string().min(1, 'Say what happens in this slot.').max(300),
})

/** `YYYY-MM-DD`, the shape a date input submits and the column stores. */
const dateString = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Choose a date.')

/**
 * The shape, with no defaults attached.
 *
 * Defaults live only on the create schema below. `.partial()` does NOT strip a
 * `.default()` — so a patch of `{ fee }` would still parse as carrying
 * `agenda: []`, and the repository, seeing a value rather than `undefined`,
 * would wipe the schedule. That is not hypothetical: it happened.
 */
const base = z.object({
  title: z.string().min(1, 'A title is required.').max(200),
  slug: z
    .string()
    .min(1, 'A slug is required.')
    .max(200)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Use lowercase letters, numbers and hyphens.'),
  date: dateString,
  /** Set only on a multi-day event; the listing prints a range when present. */
  endDate: z.union([dateString, z.literal('')]).optional(),
  startTime: z.string().max(40).optional(),
  location: z.string().max(200),
  type: z.enum(EVENT_TYPES),
  excerpt: z.string().max(600).optional(),
  body: z.string().optional(),
  cover: mediaRef.nullish(),
  /**
   * The event's photographs, in display order.
   *
   * The gallery is what an event page is for once the event has happened —
   * copy describing a summit convinces nobody it took place.
   */
  photos: z.array(
    mediaRef.extend({ caption: z.string().max(255).optional() }),
  ),
  agenda: z.array(agendaItemSchema),
  featured: z.boolean(),
  status: z.enum(['published', 'draft', 'review']),
  seo: z
    .object({
      metaTitle: z.string().max(200).optional(),
      metaDescription: z.string().max(300, 'Keep meta descriptions under 300 characters.').optional(),
      /* Optional on the wire so an older client that sends no keywords still
         saves; stored as an empty array either way. */
      keywords: z.array(z.string().max(80)).max(50).optional(),
    })
    .optional(),
})

export const eventSchema = base.extend({
  location: z.string().max(200).default(''),
  type: z.enum(EVENT_TYPES).default('Workshop'),
  agenda: z.array(agendaItemSchema).default([]),
  photos: z.array(mediaRef.extend({ caption: z.string().max(255).optional() })).default([]),
  featured: z.boolean().default(false),
  status: z.enum(['published', 'draft', 'review']).default('draft'),
})

/** Defaults stay off the patch schema — see the note in categories.schema.ts. */
export const eventPatchSchema = base.partial()

export type EventInput = z.infer<typeof eventSchema>
export type EventPatch = z.infer<typeof eventPatchSchema>
export type AgendaItem = z.infer<typeof agendaItemSchema>

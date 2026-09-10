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

const optionalUrl = z.union([z.url('Enter a full link, starting with https://'), z.literal('')]).optional()

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
  location: z.string().max(200).default(''),
  type: z.enum(EVENT_TYPES),
  excerpt: z.string().max(600).optional(),
  body: z.string().optional(),
  cover: mediaRef.nullish(),
  registerUrl: optionalUrl,
  seats: z.string().max(60).optional(),
  fee: z.string().max(60).optional(),
  agenda: z.array(agendaItemSchema).default([]),
  featured: z.boolean(),
  status: z.enum(['published', 'draft', 'review']),
  seo: z
    .object({
      metaTitle: z.string().max(200).optional(),
      metaDescription: z.string().max(300, 'Keep meta descriptions under 300 characters.').optional(),
    })
    .optional(),
})

export const eventSchema = base.extend({
  location: z.string().max(200).default(''),
  type: z.enum(EVENT_TYPES).default('Workshop'),
  agenda: z.array(agendaItemSchema).default([]),
  featured: z.boolean().default(false),
  status: z.enum(['published', 'draft', 'review']).default('draft'),
})

/** Defaults stay off the patch schema — see the note in categories.schema.ts. */
export const eventPatchSchema = base.partial()

export type EventInput = z.infer<typeof eventSchema>
export type EventPatch = z.infer<typeof eventPatchSchema>
export type AgendaItem = z.infer<typeof agendaItemSchema>

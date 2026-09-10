import { z } from 'zod'

import { seoBlockSchema } from '../../components/form/seoSchema'

export const EVENT_TYPES = ['Summit', 'Workshop', 'Seminar', 'Drive', 'Webinar', 'Other'] as const

export const EVENT_TYPE_OPTIONS = EVENT_TYPES.map((value) => ({ value, label: value }))

/**
 * One line of the schedule.
 *
 * `time` is a plain text input rather than a time picker: a one-day summit
 * reads "09:30" and a four-day workshop reads "Day 1", and a picker would make
 * the second one unsayable.
 */
const agendaItemSchema = z.object({
  id: z.string().optional(),
  time: z.string().min(1, 'Give the slot a time or a day.').max(60),
  item: z.string().min(1, 'Say what happens in this slot.').max(300),
})

const dateString = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Choose a date.')

/** Mirrors `backend/src/modules/events/events.schema.ts`. */
export const eventSchema = z.object({
  title: z.string().min(1, 'A title is required.').max(200),
  slug: z
    .string()
    .min(1, 'A slug is required.')
    .max(200)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Use lowercase letters, numbers and hyphens.'),
  date: dateString,
  endDate: z.union([dateString, z.literal('')]).optional(),
  startTime: z.string().max(40).optional(),
  location: z.string().max(200),
  type: z.enum(EVENT_TYPES),
  excerpt: z.string().max(600).optional(),
  body: z.string().optional(),
  cover:  z
    .object({
      id: z.string().min(1),
      url: z.string(),
      alt: z.string(),
      width: z.number().optional(),
      height: z.number().optional(),
    })
    .nullish(),
  registerUrl: z
    .union([z.url('Enter a full link, starting with https://'), z.literal('')])
    .optional(),
  seats: z.string().max(60).optional(),
  fee: z.string().max(60).optional(),
  agenda: z.array(agendaItemSchema),
  featured: z.boolean(),
  status: z.enum(['published', 'draft', 'review']),
  seo: seoBlockSchema,
})

export type EventFormValues = z.infer<typeof eventSchema>

export function emptyEvent(): EventFormValues {
  return {
    title: '',
    slug: '',
    date: '',
    endDate: '',
    startTime: '',
    location: '',
    type: 'Workshop',
    excerpt: '',
    body: '',
    cover: null,
    registerUrl: '',
    seats: '',
    fee: '',
    agenda: [],
    featured: false,
    status: 'draft',
    seo: { keywords: [] },
  }
}

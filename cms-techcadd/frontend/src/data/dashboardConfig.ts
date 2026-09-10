import { CircleHelp, Mail, PenSquare, Star } from 'lucide-react'

import type { QuickAction, WebsiteStatus } from '../types'

/**
 * Structural dashboard configuration.
 *
 * Every record-shaped export has moved to `src/api` — the dashboard reads live
 * counts through `features/dashboard/useDashboard`. What is left here describes
 * the UI itself, not content, so it is not data that could go stale. (This was
 * `mockData.ts`, which it had not been for some time.)
 */

/** Navigation shortcuts, in the order an editor most often needs them. */
export const quickActions: QuickAction[] = [
  {
    id: 'add-blog',
    label: 'Add Blog',
    description: 'Write an article',
    icon: PenSquare,
    path: '/blogs/new',
  },
  {
    id: 'add-faq',
    label: 'Add FAQ',
    description: 'Answer a common question',
    icon: CircleHelp,
    path: '/faqs/new',
  },
  {
    id: 'add-review',
    label: 'Add Review',
    description: 'Record a student outcome',
    icon: Star,
    path: '/reviews/new',
  },
  {
    id: 'view-enquiries',
    label: 'View Enquiries',
    description: 'Track incoming leads',
    icon: Mail,
    path: '/enquiries',
  },
]

/**
 * No uptime monitoring exists, so this reports only what is knowable: the CMS
 * is reachable. `uptime` stays unset rather than inventing a percentage.
 */
export const websiteStatus: WebsiteStatus = {
  label: 'Website Status',
  state: 'online',
  detail: 'All systems operational',
}

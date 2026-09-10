import { request } from '../client'
import type { EnquiryRecord } from '../../types'

export interface DashboardTotals {
  blogs: number
  enquiries: number
  reviews: number
  faqs: number
  /** Active subscribers only — unsubscribed rows are kept but not counted. */
  subscribers: number
}

export interface DashboardTrendPoint {
  /** ISO date, oldest first. */
  date: string
  value: number
}

export interface DashboardActivity {
  id: string
  title: string
  kind: 'blog'
  updatedAt: string
}

export interface DashboardSummary {
  totals: DashboardTotals
  today: { newEnquiries: number; pendingReview: number; livePosts: number }
  enquiryTrend: DashboardTrendPoint[]
  contentOverview: { published: number; draft: number; review: number; total: number }
  recentActivity: DashboardActivity[]
  /** The same shape /api/enquiries returns. */
  recentEnquiries: EnquiryRecord[]
}

/** Everything the dashboard renders, in one request. */
export function fetchDashboardSummary(): Promise<DashboardSummary> {
  return request<DashboardSummary>('/dashboard/summary')
}

export interface SearchHit {
  id: string
  label: string
  detail?: string
}

export interface SearchGroup {
  key: 'blogs' | 'faqs' | 'reviews' | 'enquiries'
  hits: SearchHit[]
}

/** Global search. Terms shorter than two characters come back empty. */
export function fetchSearch(term: string): Promise<{ groups: SearchGroup[] }> {
  return request<{ groups: SearchGroup[] }>('/search', { query: { q: term } })
}

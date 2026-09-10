import { useMemo, useState } from 'react'
import { Activity } from 'lucide-react'

import type { ListParams } from '../../api'
import { Badge } from '../../components/common/Badge'
import { Card } from '../../components/common/Card'
import { DataTable, type Column } from '../../components/data/DataTable'
import { Pagination } from '../../components/data/Pagination'
import { Input } from '../../components/form/Input'
import { Select } from '../../components/form/Select'
import { ViewOnSiteButton } from '../../components/common/ViewOnSite'
import { PageHeader } from '../../components/layout/PageHeader'
import type { ActivityEntry, BadgeTone } from '../../types'
import { useActivity } from './useActivity'

/**
 * The audit trail.
 *
 * Read-only, with no row actions and no delete: a log an administrator can edit
 * is not evidence of anything. Retention is handled by age on the server.
 */

/** Fixed page size — see the note on the pagination below. */
const PAGE_SIZE = 50

const ACTION_TONE: Record<string, BadgeTone> = {
  create: 'success',
  update: 'primary',
  delete: 'danger',
  publish: 'success',
  unpublish: 'warning',
  login: 'neutral',
  logout: 'neutral',
}

const ACTION_OPTIONS = [
  { value: '', label: 'Every action' },
  { value: 'create', label: 'Created' },
  { value: 'update', label: 'Updated' },
  { value: 'delete', label: 'Deleted' },
  { value: 'publish', label: 'Published' },
  { value: 'unpublish', label: 'Unpublished' },
]

/** "2 minutes ago". Absolute dates make a log harder to scan, not easier. */
function timeAgo(iso: string): string {
  const then = new Date(iso).getTime()
  if (Number.isNaN(then)) return ''

  const seconds = Math.round((Date.now() - then) / 1000)
  if (seconds < 60) return 'just now'

  const units: [number, Intl.RelativeTimeFormatUnit][] = [
    [60, 'minute'],
    [24, 'hour'],
    [7, 'day'],
    [4.35, 'week'],
    [12, 'month'],
  ]

  let value = seconds / 60
  let unit: Intl.RelativeTimeFormatUnit = 'minute'
  for (const [step, next] of units) {
    if (Math.abs(value) < step) break
    value /= step
    unit = next
  }

  return new Intl.RelativeTimeFormat('en', { numeric: 'auto' }).format(-Math.round(value), unit)
}

export default function ActivityLogPage() {
  const [page, setPage] = useState(1)
  const [action, setAction] = useState('')
  const [search, setSearch] = useState('')

  const params: ListParams = useMemo(
    () => ({
      page,
      pageSize: PAGE_SIZE,
      search: search.trim() || undefined,
      filters: action ? { action } : {},
    }),
    [page, action, search],
  )

  const query = useActivity(params)
  const entries = query.data?.items ?? []

  const columns: Column<ActivityEntry>[] = [
    {
      id: 'who',
      header: 'Who',
      cell: (entry) => <span className="font-medium text-slate-900">{entry.userName}</span>,
    },
    {
      id: 'what',
      header: 'What',
      cell: (entry) => (
        <span className="flex flex-wrap items-center gap-2">
          <Badge tone={ACTION_TONE[entry.action] ?? 'neutral'}>{entry.action}</Badge>
          <span className="text-sm text-slate-500">{entry.entityType}</span>
          {entry.entityLabel && (
            <span className="max-w-[20rem] truncate text-sm text-slate-900">
              {entry.entityLabel}
            </span>
          )}
        </span>
      ),
    },
    {
      id: 'when',
      header: 'When',
      cell: (entry) => (
        // The exact timestamp on hover — "3 days ago" is right for scanning and
        // useless when you need to correlate with something else.
        <span
          className="whitespace-nowrap text-sm text-slate-500"
          title={new Date(entry.createdAt).toLocaleString()}
        >
          {timeAgo(entry.createdAt)}
        </span>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Activity Log"
        description="Every change made in the CMS, and by whom"
        actions={<ViewOnSiteButton module="activity" />}
      />

      <Card className="flex flex-wrap gap-3 p-4">
        <div className="min-w-[16rem] flex-1">
          <Input
            value={search}
            onChange={(event) => {
              setSearch(event.target.value)
              setPage(1)
            }}
            placeholder="Search by person, module or record"
            aria-label="Search the activity log"
          />
        </div>
        <div className="w-48">
          <Select
            value={action}
            onChange={(event) => {
              setAction(event.target.value)
              setPage(1)
            }}
            options={ACTION_OPTIONS}
            aria-label="Filter by action"
          />
        </div>
      </Card>

      <Card flush>
        <DataTable
          rows={entries}
          columns={columns}
          getRowId={(entry) => entry.id}
          caption="Changes made in the CMS, newest first"
          loading={query.isLoading}
          error={query.error as Error | null}
          onRetry={() => query.refetch()}
          emptyIcon={Activity}
          emptyTitle="Nothing recorded yet"
          emptyDescription="Changes made in the CMS are logged here as they happen."
        />

        {(query.data?.total ?? 0) > PAGE_SIZE && (
          <Pagination
            page={page}
            pageSize={PAGE_SIZE}
            total={query.data?.total ?? 0}
            onPageChange={setPage}
            // Fixed: a log is scrolled, not resized, and offering a choice here
            // would be a control that changes nothing anyone cares about.
            onPageSizeChange={() => {}}
          />
        )}
      </Card>
    </div>
  )
}

import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CalendarDays, EyeOff, MoreHorizontal, Pencil, Plus, Send, Trash2 } from 'lucide-react'

import { ApiError, type ListParams } from '../../api'
import { Badge, ContentStatusBadge } from '../../components/common/Badge'
import { Button } from '../../components/common/Button'
import { Card } from '../../components/common/Card'
import { DropdownItem, DropdownMenu, DropdownSeparator } from '../../components/common/DropdownMenu'
import { DataTable, type Column } from '../../components/data/DataTable'
import { PageHeader } from '../../components/layout/PageHeader'
import { useConfirm } from '../../hooks/useConfirm'
import { useToast } from '../../hooks/useToast'
import type { CampusEvent, ContentStatus } from '../../types'
import { usePublishToggle } from '../shared/usePublishToggle'
import { eventHooks } from './useEvents'

/** Newest first — the calendar is read forwards from the next event. */
const ALL: ListParams = { page: 1, pageSize: 500, sort: { field: 'date', dir: 'desc' } }

/** "11 Oct 2026", or a range when the event runs over several days. */
function formatWhen(event: CampusEvent): string {
  const format = (iso: string) =>
    new Date(`${iso}T00:00:00`).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })

  if (!event.date) return '—'
  return event.endDate ? `${format(event.date)} – ${format(event.endDate)}` : format(event.date)
}

export default function EventsListPage() {
  const navigate = useNavigate()
  const toast = useToast()
  const confirm = useConfirm()

  const query = eventHooks.useList(ALL)
  const remove = eventHooks.useRemove()
  const update = eventHooks.useUpdate()

  const togglePublished = usePublishToggle<CampusEvent>(
    (id, status: ContentStatus) => update.mutateAsync({ id, input: { status } }),
    'event',
  )

  const [selectedIds, setSelectedIds] = useState<string[]>([])

  const events = useMemo(() => query.data?.items ?? [], [query.data])

  /** Midnight today, so an event happening now still counts as upcoming. */
  const today = useMemo(() => new Date().toISOString().slice(0, 10), [])

  async function deleteEvent(event: CampusEvent) {
    const confirmed = await confirm({
      title: `Delete “${event.title}”?`,
      description: 'The schedule goes with it. This cannot be undone.',
      confirmLabel: 'Delete',
    })
    if (!confirmed) return

    try {
      await remove.mutateAsync([event.id])
      toast.success('Event deleted.')
    } catch (error) {
      toast.error('Could not delete', {
        description: error instanceof ApiError ? error.message : 'Please try again.',
      })
    }
  }

  const columns: Column<CampusEvent>[] = [
    {
      id: 'title',
      header: 'Event',
      cell: (event) => (
        <div className="min-w-0">
          <p className="flex items-center gap-2 truncate font-medium text-slate-900">
            {event.title}
            {event.featured && <Badge tone="success">Featured</Badge>}
          </p>
          <p className="truncate text-xs text-slate-500">
            {event.location || 'Location not set'}
            {event.agenda?.length ? ` · ${event.agenda.length} agenda items` : ''}
          </p>
        </div>
      ),
    },
    {
      id: 'when',
      header: 'When',
      cell: (event) => (
        <div className="whitespace-nowrap">
          <p className="text-sm text-slate-900">{formatWhen(event)}</p>
          {/*
            * Past events stay published on purpose — the site keeps them as an
            * archive — so the list says which is which rather than leaving an
            * editor to compare dates by eye.
            */}
          <p className="text-xs text-slate-400">
            {event.date ? (event.date >= today ? 'Upcoming' : 'Past') : ''}
            {event.startTime ? ` · ${event.startTime}` : ''}
          </p>
        </div>
      ),
    },
    {
      id: 'type',
      header: 'Type',
      cell: (event) => <Badge tone="neutral">{event.type}</Badge>,
    },
    {
      id: 'status',
      header: 'Status',
      cell: (event) => <ContentStatusBadge status={event.status} />,
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Events"
        description="Summits, workshops, seminars and placement drives"
        actions={
          <Link to="/events/new">
            <Button icon={Plus}>Add event</Button>
          </Link>
        }
      />

      <Card flush>
        <DataTable
          rows={events}
          columns={columns}
          getRowId={(event) => event.id}
          caption="Campus events with their date, type and status"
          loading={query.isLoading}
          error={query.error as Error | null}
          onRetry={() => query.refetch()}
          selectedIds={selectedIds}
          onSelectionChange={setSelectedIds}
          onRowClick={(event) => navigate(`/events/${event.id}/edit`)}
          emptyIcon={CalendarDays}
          emptyTitle="No events yet"
          emptyDescription="Add an event and it appears on the calendar, with a page of its own."
          rowActions={(event) => (
            <DropdownMenu
              trigger={
                <Button variant="ghost" size="sm" aria-label={`Actions for ${event.title}`}>
                  <MoreHorizontal size={16} />
                </Button>
              }
            >
              <DropdownItem icon={Pencil} onSelect={() => navigate(`/events/${event.id}/edit`)}>
                Edit
              </DropdownItem>
              <DropdownItem
                icon={event.status === 'published' ? EyeOff : Send}
                onSelect={() => void togglePublished(event)}
              >
                {event.status === 'published' ? 'Unpublish' : 'Publish'}
              </DropdownItem>
              <DropdownSeparator />
              <DropdownItem icon={Trash2} tone="danger" onSelect={() => deleteEvent(event)}>
                Delete
              </DropdownItem>
            </DropdownMenu>
          )}
        />
      </Card>
    </div>
  )
}

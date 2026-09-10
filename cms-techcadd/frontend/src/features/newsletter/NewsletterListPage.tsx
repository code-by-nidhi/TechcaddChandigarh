import { useMemo, useState } from 'react'
import { Download, Mail, MailX, MoreHorizontal, Send, Trash2 } from 'lucide-react'

import { ApiError } from '../../api'
import { Badge } from '../../components/common/Badge'
import { Button } from '../../components/common/Button'
import { Card } from '../../components/common/Card'
import { DropdownItem, DropdownMenu, DropdownSeparator } from '../../components/common/DropdownMenu'
import { DataTable, type Column } from '../../components/data/DataTable'
import { FilterBar } from '../../components/data/FilterBar'
import { Pagination } from '../../components/data/Pagination'
import { Tabs } from '../../components/data/Tabs'
import { PageHeader } from '../../components/layout/PageHeader'
import { useConfirm } from '../../hooks/useConfirm'
import { useListParams } from '../../hooks/useListParams'
import { useToast } from '../../hooks/useToast'
import { downloadCsv, toCsv } from '../../lib/csv'
import { formatShortDate } from '../../lib/format'
import type { Subscriber } from '../../types'
import { newsletterHooks } from './useNewsletter'

const TABS = [
  { value: '', label: 'All' },
  { value: 'active', label: 'Subscribed' },
  { value: 'unsubscribed', label: 'Unsubscribed' },
]

/**
 * The mailing list.
 *
 * There is no "Add subscriber" button, and that is the point: an address here
 * belongs to someone who asked to be mailed, and one typed in by an
 * administrator would be one nobody consented to. The list is read, exported
 * and — when somebody asks to be taken off — unsubscribed.
 */
export default function NewsletterListPage() {
  const toast = useToast()
  const confirm = useConfirm()

  const list = useListParams({
    filterKeys: ['status'],
    defaultSort: { field: 'subscribedAt', dir: 'desc' },
  })
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  const query = newsletterHooks.useList(list.params)
  const update = newsletterHooks.useUpdate()
  const remove = newsletterHooks.useRemove()

  const rows = useMemo(() => query.data?.items ?? [], [query.data])
  const total = query.data?.total ?? 0

  async function setStatus(subscriber: Subscriber, status: Subscriber['status']) {
    try {
      await update.mutateAsync({ id: subscriber.id, input: { status } })
      toast.success(
        status === 'active' ? 'Marked as subscribed.' : 'Marked as unsubscribed.',
      )
    } catch (error) {
      toast.error('Could not update this subscriber', {
        description: error instanceof ApiError ? error.message : 'Please try again.',
      })
    }
  }

  /**
   * Deleting is offered as well as unsubscribing because they answer different
   * requests: "stop emailing me" leaves a record that says so, while "erase my
   * data" must not.
   */
  async function deleteSubscribers(ids: string[], label: string) {
    const confirmed = await confirm({
      title: `Delete ${label}?`,
      description: 'This removes the record entirely. To stop mailing someone, unsubscribe instead.',
      confirmLabel: 'Delete',
    })
    if (!confirmed) return

    try {
      await remove.mutateAsync(ids)
      setSelectedIds([])
      toast.success(`Deleted ${label}.`)
    } catch (error) {
      toast.error('Could not delete', {
        description: error instanceof ApiError ? error.message : 'Please try again.',
      })
    }
  }

  /** Exports what is on screen — the current filter and page, not the table. */
  function exportCsv() {
    downloadCsv(
      'newsletter-subscribers.csv',
      toCsv(rows, [
        { header: 'Email', value: (row) => row.email },
        { header: 'Status', value: (row) => row.status },
        { header: 'Source', value: (row) => row.source },
        { header: 'Subscribed', value: (row) => row.subscribedAt },
      ]),
    )
  }

  const columns: Column<Subscriber>[] = [
    {
      id: 'email',
      header: 'Email',
      primary: true,
      sortable: true,
      cell: (row) => <span className="font-medium text-slate-900">{row.email}</span>,
    },
    {
      id: 'status',
      header: 'Status',
      sortable: true,
      cell: (row) => (
        <Badge tone={row.status === 'active' ? 'success' : 'neutral'} withDot>
          {row.status === 'active' ? 'Subscribed' : 'Unsubscribed'}
        </Badge>
      ),
    },
    {
      id: 'source',
      header: 'Source',
      hideBelow: 'lg',
      cell: (row) => <span className="text-slate-500">{row.source}</span>,
    },
    {
      id: 'subscribedAt',
      header: 'Subscribed',
      sortable: true,
      hideBelow: 'md',
      cell: (row) => (
        <span className="whitespace-nowrap text-slate-500">
          {formatShortDate(row.subscribedAt)}
        </span>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Newsletter"
        description={
          query.isLoading
            ? 'Loading…'
            : `${total} ${total === 1 ? 'address' : 'addresses'} in total`
        }
      />

      <Card flush>
        <Tabs
          value={list.filters.status ?? ''}
          onValueChange={(value) => list.setFilter('status', value || undefined)}
          items={TABS}
        />

        <FilterBar
          search={list.search}
          onSearchChange={list.setSearch}
          searchPlaceholder="Search by email address"
          actions={
            <Button variant="secondary" size="sm" icon={Download} onClick={exportCsv}>
              Export CSV
            </Button>
          }
        />

        {selectedIds.length > 0 && (
          <div className="flex flex-wrap items-center gap-3 border-b border-slate-100 bg-primary-50/60 px-5 py-2.5">
            <p className="text-sm font-medium text-primary-900">{selectedIds.length} selected</p>
            <Button
              variant="secondary"
              size="sm"
              icon={Trash2}
              onClick={() =>
                deleteSubscribers(
                  selectedIds,
                  `${selectedIds.length} ${selectedIds.length === 1 ? 'address' : 'addresses'}`,
                )
              }
            >
              Delete
            </Button>
            <button
              type="button"
              onClick={() => setSelectedIds([])}
              className="text-sm font-medium text-primary-700 hover:text-primary-800"
            >
              Clear selection
            </button>
          </div>
        )}

        <DataTable
          rows={rows}
          columns={columns}
          getRowId={(row) => row.id}
          caption="Newsletter subscribers with their status and sign-up date"
          loading={query.isLoading}
          error={query.error as Error | null}
          onRetry={() => query.refetch()}
          sort={list.sort}
          onSortChange={list.setSort}
          selectedIds={selectedIds}
          onSelectionChange={setSelectedIds}
          emptyIcon={Mail}
          emptyTitle={list.search ? 'No matching addresses' : 'No subscribers yet'}
          emptyDescription={
            list.search
              ? 'Try a different search term.'
              : 'Addresses appear here when visitors subscribe from the blog.'
          }
          rowActions={(row) => (
            <DropdownMenu
              trigger={
                <Button variant="ghost" size="sm" aria-label={`Actions for ${row.email}`}>
                  <MoreHorizontal size={16} aria-hidden="true" />
                </Button>
              }
            >
              {row.status === 'active' ? (
                <DropdownItem icon={MailX} onSelect={() => void setStatus(row, 'unsubscribed')}>
                  Unsubscribe
                </DropdownItem>
              ) : (
                <DropdownItem icon={Send} onSelect={() => void setStatus(row, 'active')}>
                  Resubscribe
                </DropdownItem>
              )}
              <DropdownSeparator />
              <DropdownItem
                icon={Trash2}
                tone="danger"
                onSelect={() => deleteSubscribers([row.id], row.email)}
              >
                Delete
              </DropdownItem>
            </DropdownMenu>
          )}
        />

        {total > 0 && (
          <Pagination
            page={list.page}
            pageSize={list.pageSize}
            total={total}
            onPageChange={list.setPage}
            onPageSizeChange={list.setPageSize}
          />
        )}
      </Card>
    </div>
  )
}

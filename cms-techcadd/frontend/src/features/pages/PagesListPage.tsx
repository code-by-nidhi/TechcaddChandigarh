import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { EyeOff, FileText, MoreHorizontal, Pencil, Plus, Send, Trash2 } from 'lucide-react'

import { ApiError, type ListParams } from '../../api'
import { Badge, ContentStatusBadge } from '../../components/common/Badge'
import { Button } from '../../components/common/Button'
import { Card } from '../../components/common/Card'
import { DropdownItem, DropdownMenu, DropdownSeparator } from '../../components/common/DropdownMenu'
import { DataTable, type Column } from '../../components/data/DataTable'
import { ViewOnSiteButton, ViewOnSiteItem } from '../../components/common/ViewOnSite'
import { PageHeader } from '../../components/layout/PageHeader'
import { useConfirm } from '../../hooks/useConfirm'
import { useToast } from '../../hooks/useToast'
import type { ContentStatus, Page } from '../../types'
import { usePublishToggle } from '../shared/usePublishToggle'
import { pageHooks } from './usePages'

/** Hand-ordered and few, so the whole set loads at once. */
const ALL: ListParams = { page: 1, pageSize: 500, sort: { field: 'order', dir: 'asc' } }

export default function PagesListPage() {
  const navigate = useNavigate()
  const toast = useToast()
  const confirm = useConfirm()

  const query = pageHooks.useList(ALL)
  const remove = pageHooks.useRemove()
  const update = pageHooks.useUpdate()

  const togglePublished = usePublishToggle<Page>(
    (id, status: ContentStatus) => update.mutateAsync({ id, input: { status } }),
    'page',
  )

  const [selectedIds, setSelectedIds] = useState<string[]>([])

  const pages = useMemo(() => query.data?.items ?? [], [query.data])

  async function deletePage(page: Page) {
    const confirmed = await confirm({
      title: `Delete “${page.title}”?`,
      description:
        page.kind === 'override'
          ? 'The route goes back to the copy built into the site.'
          : 'The page and its URL are removed.',
      confirmLabel: 'Delete',
    })
    if (!confirmed) return

    try {
      await remove.mutateAsync([page.id])
      toast.success('Page deleted.')
    } catch (error) {
      toast.error('Could not delete', {
        description: error instanceof ApiError ? error.message : 'Please try again.',
      })
    }
  }

  const columns: Column<Page>[] = [
    {
      id: 'title',
      header: 'Page',
      cell: (page) => (
        <div className="min-w-0">
          <p className="truncate font-medium text-slate-900">{page.title}</p>
          <p className="truncate text-xs text-slate-500">
            {page.path ?? (page.kind === 'override' ? `/${page.slug}` : `/pages/${page.slug}`)}
          </p>
        </div>
      ),
    },
    {
      id: 'kind',
      header: 'Kind',
      /*
       * The distinction matters more than any other column here: an override
       * silently replaces copy on a page that already exists, and an editor
       * needs to see which rows do that without opening them.
       */
      cell: (page) => (
        <Badge tone={page.kind === 'override' ? 'warning' : 'primary'}>
          {page.kind === 'override' ? 'Replaces existing' : 'New page'}
        </Badge>
      ),
    },
    {
      id: 'nav',
      header: 'In menu',
      cell: (page) =>
        page.kind === 'custom' && page.showInNav ? (
          <Badge tone="success">Resources</Badge>
        ) : (
          <span className="text-xs text-slate-400">—</span>
        ),
    },
    {
      id: 'status',
      header: 'Status',
      cell: (page) => <ContentStatusBadge status={page.status} />,
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Pages"
        description="New pages of your own, and replacement copy for pages the site already has"
        actions={
          <>
            <ViewOnSiteButton module="pages" />
            <Link to="/pages/new">
              <Button icon={Plus}>Add page</Button>
            </Link>
          </>
        }
      />

      <Card flush>
        <DataTable
          rows={pages}
          columns={columns}
          getRowId={(page) => page.id}
          caption="Pages with their address, kind and status"
          loading={query.isLoading}
          error={query.error as Error | null}
          onRetry={() => query.refetch()}
          selectedIds={selectedIds}
          onSelectionChange={setSelectedIds}
          onRowClick={(page) => navigate(`/pages/${page.id}/edit`)}
          emptyIcon={FileText}
          emptyTitle="No pages yet"
          emptyDescription="Add a page to publish a new URL, or to replace the copy on one the site already has."
          rowActions={(page) => (
            <DropdownMenu
              trigger={
                <Button variant="ghost" size="sm" aria-label={`Actions for ${page.title}`}>
                  <MoreHorizontal size={16} />
                </Button>
              }
            >
              <DropdownItem icon={Pencil} onSelect={() => navigate(`/pages/${page.id}/edit`)}>
                Edit
              </DropdownItem>
              <DropdownItem
                icon={page.status === 'published' ? EyeOff : Send}
                onSelect={() => void togglePublished(page)}
              >
                {page.status === 'published' ? 'Unpublish' : 'Publish'}
              </DropdownItem>
              <ViewOnSiteItem module="pages" record={page} />
              <DropdownSeparator />
              <DropdownItem icon={Trash2} tone="danger" onSelect={() => deletePage(page)}>
                Delete
              </DropdownItem>
            </DropdownMenu>
          )}
        />
      </Card>
    </div>
  )
}

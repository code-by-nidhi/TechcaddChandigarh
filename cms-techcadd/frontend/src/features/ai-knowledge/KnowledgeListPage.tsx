import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Bot, EyeOff, MoreHorizontal, Pencil, Plus, Send, Trash2 } from 'lucide-react'

import { ApiError, type ListParams } from '../../api'
import { Badge, ContentStatusBadge } from '../../components/common/Badge'
import { Button } from '../../components/common/Button'
import { Card } from '../../components/common/Card'
import { DropdownItem, DropdownMenu, DropdownSeparator } from '../../components/common/DropdownMenu'
import { DataTable, type Column } from '../../components/data/DataTable'
import { ViewOnSiteButton } from '../../components/common/ViewOnSite'
import { PageHeader } from '../../components/layout/PageHeader'
import { useConfirm } from '../../hooks/useConfirm'
import { useToast } from '../../hooks/useToast'
import type { AiKnowledgeEntry, ContentStatus } from '../../types'
import { usePublishToggle } from '../shared/usePublishToggle'
import { knowledgeHooks } from './useAiKnowledge'

const ALL: ListParams = { page: 1, pageSize: 500, sort: { field: 'order', dir: 'asc' } }

export default function KnowledgeListPage() {
  const navigate = useNavigate()
  const toast = useToast()
  const confirm = useConfirm()

  const query = knowledgeHooks.useList(ALL)
  const remove = knowledgeHooks.useRemove()
  const update = knowledgeHooks.useUpdate()

  const togglePublished = usePublishToggle<AiKnowledgeEntry>(
    (id, status: ContentStatus) => update.mutateAsync({ id, input: { status } }),
    'entry',
  )

  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const entries = useMemo(() => query.data?.items ?? [], [query.data])

  async function deleteEntry(entry: AiKnowledgeEntry) {
    const confirmed = await confirm({
      title: `Delete “${entry.question}”?`,
      description: 'The chatbot will stop answering with it.',
      confirmLabel: 'Delete',
    })
    if (!confirmed) return

    try {
      await remove.mutateAsync([entry.id])
      toast.success('Entry deleted.')
    } catch (error) {
      toast.error('Could not delete', {
        description: error instanceof ApiError ? error.message : 'Please try again.',
      })
    }
  }

  const columns: Column<AiKnowledgeEntry>[] = [
    {
      id: 'question',
      header: 'Question',
      cell: (entry) => (
        <div className="min-w-0">
          <p className="truncate font-medium text-slate-900">{entry.question}</p>
          <p className="truncate text-xs text-slate-500">{entry.answer}</p>
        </div>
      ),
    },
    {
      id: 'keywords',
      header: 'Also matches',
      /*
       * Surfaced in the list because it is the field that decides whether an
       * entry is ever found. An entry with none is one only a visitor who
       * guesses the exact wording will reach — worth seeing at a glance.
       */
      cell: (entry) =>
        entry.keywords ? (
          <span className="block max-w-[16rem] truncate text-xs text-slate-500">
            {entry.keywords}
          </span>
        ) : (
          <Badge tone="warning">No alternates</Badge>
        ),
    },
    {
      id: 'category',
      header: 'Group',
      cell: (entry) => <Badge tone="neutral">{entry.category}</Badge>,
    },
    {
      id: 'hits',
      header: 'Served',
      cell: (entry) => (
        <span className="whitespace-nowrap text-sm text-slate-600">
          {entry.hits}
          {entry.hits === 0 && entry.status === 'published' && (
            <span className="ml-2 text-xs text-slate-400">never matched</span>
          )}
        </span>
      ),
    },
    {
      id: 'status',
      header: 'Status',
      cell: (entry) => <ContentStatusBadge status={entry.status} />,
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="AI Knowledge"
        description="What the website chatbot answers visitors from"
        actions={
          <>
            <ViewOnSiteButton module="ai-knowledge" />
            <Link to="/ai-knowledge/new">
              <Button icon={Plus}>Add entry</Button>
            </Link>
          </>
        }
      />

      <Card flush>
        <DataTable
          rows={entries}
          columns={columns}
          getRowId={(entry) => entry.id}
          caption="Knowledge base entries with their alternate phrasings and how often each is served"
          loading={query.isLoading}
          error={query.error as Error | null}
          onRetry={() => query.refetch()}
          selectedIds={selectedIds}
          onSelectionChange={setSelectedIds}
          onRowClick={(entry) => navigate(`/ai-knowledge/${entry.id}/edit`)}
          emptyIcon={Bot}
          emptyTitle="Nothing in the knowledge base yet"
          emptyDescription="Add the questions visitors actually ask — fees, timings, locations — and the chatbot can answer them."
          rowActions={(entry) => (
            <DropdownMenu
              trigger={
                <Button variant="ghost" size="sm" aria-label={`Actions for ${entry.question}`}>
                  <MoreHorizontal size={16} />
                </Button>
              }
            >
              <DropdownItem
                icon={Pencil}
                onSelect={() => navigate(`/ai-knowledge/${entry.id}/edit`)}
              >
                Edit
              </DropdownItem>
              <DropdownItem
                icon={entry.status === 'published' ? EyeOff : Send}
                onSelect={() => void togglePublished(entry)}
              >
                {entry.status === 'published' ? 'Unpublish' : 'Publish'}
              </DropdownItem>
              <DropdownSeparator />
              <DropdownItem icon={Trash2} tone="danger" onSelect={() => deleteEntry(entry)}>
                Delete
              </DropdownItem>
            </DropdownMenu>
          )}
        />
      </Card>
    </div>
  )
}

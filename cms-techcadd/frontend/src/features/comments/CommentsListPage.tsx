import { useMemo, useState } from 'react'
import { Ban, Check, MessageSquare, MoreHorizontal, Trash2, Undo2 } from 'lucide-react'

import { ApiError, type ListParams } from '../../api'
import { Badge } from '../../components/common/Badge'
import { Button } from '../../components/common/Button'
import { Card } from '../../components/common/Card'
import { DropdownItem, DropdownMenu, DropdownSeparator } from '../../components/common/DropdownMenu'
import { DataTable, type Column } from '../../components/data/DataTable'
import { Tabs } from '../../components/data/Tabs'
import { ViewOnSiteButton, ViewOnSiteItem } from '../../components/common/ViewOnSite'
import { PageHeader } from '../../components/layout/PageHeader'
import { useConfirm } from '../../hooks/useConfirm'
import { useToast } from '../../hooks/useToast'
import { formatShortDate } from '../../lib/format'
import type { Comment, CommentStatus } from '../../types'
import { commentHooks, useBulkCommentStatus, usePendingComments } from './useComments'

/**
 * The moderation queue.
 *
 * A list with no form behind it: a comment is written by a visitor, and the
 * only thing staff change about it is whether it is published. There is
 * deliberately no way to edit the text — rewriting someone's words under their
 * own name is not moderation.
 */

const TABS: { value: CommentStatus; label: string }[] = [
  { value: 'pending', label: 'Pending' },
  { value: 'approved', label: 'Approved' },
  { value: 'spam', label: 'Spam' },
]

const STATUS_TONE = {
  pending: 'warning',
  approved: 'success',
  spam: 'danger',
} as const

export default function CommentsListPage() {
  const toast = useToast()
  const confirm = useConfirm()

  // Opens on Pending: the queue exists to be emptied, and the other two tabs
  // are for looking something up rather than for daily work.
  const [status, setStatus] = useState<CommentStatus>('pending')
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  const params: ListParams = useMemo(
    () => ({ page: 1, pageSize: 200, filters: { status }, sort: { field: 'createdAt', dir: 'desc' } }),
    [status],
  )

  const query = commentHooks.useList(params)
  const remove = commentHooks.useRemove()
  const bulk = useBulkCommentStatus()
  const pending = usePendingComments()

  const comments = useMemo(() => query.data?.items ?? [], [query.data])

  async function setStatusFor(ids: string[], next: CommentStatus, verb: string) {
    if (ids.length === 0) return
    try {
      await bulk.mutateAsync({ ids, status: next })
      setSelectedIds([])
      toast.success(`${ids.length} comment${ids.length === 1 ? '' : 's'} ${verb}.`)
    } catch (error) {
      toast.error('Could not update', {
        description: error instanceof ApiError ? error.message : 'Please try again.',
      })
    }
  }

  async function deleteComments(ids: string[]) {
    const confirmed = await confirm({
      title: ids.length === 1 ? 'Delete this comment?' : `Delete ${ids.length} comments?`,
      description: 'Any replies to it go too. This cannot be undone.',
      confirmLabel: 'Delete',
    })
    if (!confirmed) return

    try {
      await remove.mutateAsync(ids)
      setSelectedIds([])
      toast.success('Deleted.')
    } catch (error) {
      toast.error('Could not delete', {
        description: error instanceof ApiError ? error.message : 'Please try again.',
      })
    }
  }

  const columns: Column<Comment>[] = [
    {
      id: 'comment',
      header: 'Comment',
      cell: (comment) => (
        <div className="min-w-0">
          <p className="flex items-center gap-2 font-medium text-slate-900">
            {comment.authorName}
            {comment.parentId && <Badge tone="neutral">Reply</Badge>}
          </p>
          {/*
            * The full text, not a truncation. A moderator cannot judge a
            * comment they can only see the first line of, and expanding every
            * row to read it is the whole job made slower.
            */}
          <p className="mt-1 whitespace-pre-wrap text-sm text-slate-600">{comment.body}</p>
          {comment.email && <p className="mt-1 text-xs text-slate-400">{comment.email}</p>}
        </div>
      ),
    },
    {
      id: 'post',
      header: 'On',
      cell: (comment) => (
        <span className="block max-w-[14rem] truncate text-sm text-slate-600">
          {comment.blogTitle}
        </span>
      ),
    },
    {
      id: 'received',
      header: 'Received',
      cell: (comment) => (
        <span className="whitespace-nowrap text-sm text-slate-500">
          {formatShortDate(comment.createdAt)}
        </span>
      ),
    },
    {
      id: 'status',
      header: 'Status',
      cell: (comment) => <Badge tone={STATUS_TONE[comment.status]}>{comment.status}</Badge>,
    },
  ]

  const pendingCount = pending.data?.count ?? 0

  return (
    <div className="space-y-6">
      <PageHeader
        title="Comments"
        description={
          pendingCount > 0
            ? `${pendingCount} waiting for a decision`
            : 'Nothing waiting — the queue is clear'
        }
        actions={<ViewOnSiteButton module="comments" />}
      />

      <Card flush>
        <Tabs
          value={status}
          onValueChange={(value) => {
            setStatus(value as CommentStatus)
            // Selections do not survive a tab change: the ids belong to rows
            // that are no longer on screen, and acting on them would be
            // invisible.
            setSelectedIds([])
          }}
          items={TABS.map((tab) => ({
            value: tab.value,
            label: tab.label,
            badge: tab.value === 'pending' && pendingCount > 0 ? pendingCount : undefined,
          }))}
        />
      </Card>

      {selectedIds.length > 0 && (
        <Card className="flex flex-wrap items-center justify-between gap-3 p-4">
          <p className="text-sm text-slate-600">
            {selectedIds.length} selected
          </p>
          <div className="flex flex-wrap gap-2">
            {status !== 'approved' && (
              <Button
                size="sm"
                icon={Check}
                onClick={() => void setStatusFor(selectedIds, 'approved', 'approved')}
              >
                Approve
              </Button>
            )}
            {status !== 'spam' && (
              <Button
                size="sm"
                variant="secondary"
                icon={Ban}
                onClick={() => void setStatusFor(selectedIds, 'spam', 'marked as spam')}
              >
                Spam
              </Button>
            )}
            {status !== 'pending' && (
              <Button
                size="sm"
                variant="secondary"
                icon={Undo2}
                onClick={() => void setStatusFor(selectedIds, 'pending', 'moved back to pending')}
              >
                Back to pending
              </Button>
            )}
            <Button
              size="sm"
              variant="ghost"
              icon={Trash2}
              onClick={() => void deleteComments(selectedIds)}
            >
              Delete
            </Button>
          </div>
        </Card>
      )}

      <Card flush>
        <DataTable
          rows={comments}
          columns={columns}
          getRowId={(comment) => comment.id}
          caption="Comments awaiting moderation, with the post each was left on"
          loading={query.isLoading}
          error={query.error as Error | null}
          onRetry={() => query.refetch()}
          selectedIds={selectedIds}
          onSelectionChange={setSelectedIds}
          emptyIcon={MessageSquare}
          emptyTitle={
            status === 'pending' ? 'Nothing waiting' : `No ${status} comments`
          }
          emptyDescription={
            status === 'pending'
              ? 'Comments left on the blog appear here for approval before they show on the site.'
              : 'Nothing has been filed here yet.'
          }
          rowActions={(comment) => (
            <DropdownMenu
              trigger={
                <Button variant="ghost" size="sm" aria-label={`Actions for ${comment.authorName}`}>
                  <MoreHorizontal size={16} />
                </Button>
              }
            >
              {comment.status !== 'approved' && (
                <DropdownItem
                  icon={Check}
                  onSelect={() => void setStatusFor([comment.id], 'approved', 'approved')}
                >
                  Approve
                </DropdownItem>
              )}
              {comment.status !== 'spam' && (
                <DropdownItem
                  icon={Ban}
                  onSelect={() => void setStatusFor([comment.id], 'spam', 'marked as spam')}
                >
                  Mark as spam
                </DropdownItem>
              )}
              {comment.status !== 'pending' && (
                <DropdownItem
                  icon={Undo2}
                  onSelect={() => void setStatusFor([comment.id], 'pending', 'moved back to pending')}
                >
                  Back to pending
                </DropdownItem>
              )}
              <ViewOnSiteItem module="comments" record={comment} />
              <DropdownSeparator />
              <DropdownItem
                icon={Trash2}
                tone="danger"
                onSelect={() => void deleteComments([comment.id])}
              >
                Delete
              </DropdownItem>
            </DropdownMenu>
          )}
        />
      </Card>
    </div>
  )
}

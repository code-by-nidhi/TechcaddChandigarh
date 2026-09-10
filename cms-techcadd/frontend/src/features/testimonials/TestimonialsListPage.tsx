import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { EyeOff, MessageSquareQuote, MoreHorizontal, Pencil, Play, Plus, Send, Trash2 } from 'lucide-react'

import { ApiError, type ListParams } from '../../api'
import { Badge, ContentStatusBadge } from '../../components/common/Badge'
import { Button } from '../../components/common/Button'
import { Card } from '../../components/common/Card'
import { DropdownItem, DropdownMenu, DropdownSeparator } from '../../components/common/DropdownMenu'
import { DataTable, type Column } from '../../components/data/DataTable'
import { PageHeader } from '../../components/layout/PageHeader'
import { useConfirm } from '../../hooks/useConfirm'
import { useToast } from '../../hooks/useToast'
import type { ContentStatus, Testimonial } from '../../types'
import { usePublishToggle } from '../shared/usePublishToggle'
import { youtubeId } from './testimonialSchema'
import { testimonialHooks } from './useTestimonials'

/** Hand-ordered and few, so the whole set loads at once. */
const ALL: ListParams = { page: 1, pageSize: 500, sort: { field: 'order', dir: 'asc' } }

export default function TestimonialsListPage() {
  const navigate = useNavigate()
  const toast = useToast()
  const confirm = useConfirm()

  const query = testimonialHooks.useList(ALL)
  const remove = testimonialHooks.useRemove()
  const update = testimonialHooks.useUpdate()

  const togglePublished = usePublishToggle<Testimonial>(
    (id, status: ContentStatus) => update.mutateAsync({ id, input: { status } }),
    'testimonial',
  )

  const [selectedIds, setSelectedIds] = useState<string[]>([])

  const testimonials = useMemo(() => query.data?.items ?? [], [query.data])

  async function deleteTestimonial(testimonial: Testimonial) {
    const confirmed = await confirm({
      title: `Delete the testimonial from ${testimonial.authorName}?`,
      confirmLabel: 'Delete',
    })
    if (!confirmed) return

    try {
      await remove.mutateAsync([testimonial.id])
      toast.success('Testimonial deleted.')
    } catch (error) {
      toast.error('Could not delete', {
        description: error instanceof ApiError ? error.message : 'Please try again.',
      })
    }
  }

  const columns: Column<Testimonial>[] = [
    {
      id: 'author',
      header: 'Testimonial',
      cell: (testimonial) => (
        <div className="min-w-0">
          <p className="flex items-center gap-2 truncate font-medium text-slate-900">
            {testimonial.authorName}
            {testimonial.featured && <Badge tone="success">Featured</Badge>}
          </p>
          {testimonial.role && <p className="truncate text-xs text-primary-700">{testimonial.role}</p>}
          <p className="truncate text-xs text-slate-500">{testimonial.quote}</p>
        </div>
      ),
    },
    {
      id: 'video',
      header: 'Video',
      /*
       * A thumbnail rather than a tick: the point of this list is spotting the
       * one whose link is wrong, and a wrong id shows a grey box here while a
       * tick would look identical either way.
       */
      cell: (testimonial) => {
        const id = youtubeId(testimonial.youtubeUrl)
        if (!id) {
          return testimonial.youtubeUrl ? (
            <Badge tone="warning">Link not recognised</Badge>
          ) : (
            <span className="text-xs text-slate-400">Text only</span>
          )
        }
        return (
          <span className="flex items-center gap-2">
            <img
              src={`https://i.ytimg.com/vi/${id}/default.jpg`}
              alt=""
              className="h-8 w-14 rounded object-cover"
              loading="lazy"
            />
            <Play size={14} className="text-slate-400" />
          </span>
        )
      },
    },
    {
      id: 'rating',
      header: 'Rating',
      cell: (testimonial) => (
        <span
          className="whitespace-nowrap text-amber-500"
          aria-label={`${testimonial.rating} out of 5`}
        >
          {'★'.repeat(testimonial.rating)}
          <span className="text-slate-300">{'★'.repeat(5 - testimonial.rating)}</span>
        </span>
      ),
    },
    {
      id: 'status',
      header: 'Status',
      cell: (testimonial) => <ContentStatusBadge status={testimonial.status} />,
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Testimonials"
        description="Students on camera, with the Google review behind them"
        actions={
          <Link to="/testimonials/new">
            <Button icon={Plus}>Add testimonial</Button>
          </Link>
        }
      />

      <Card flush>
        <DataTable
          rows={testimonials}
          columns={columns}
          getRowId={(testimonial) => testimonial.id}
          caption="Video testimonials with their rating and status"
          loading={query.isLoading}
          error={query.error as Error | null}
          onRetry={() => query.refetch()}
          selectedIds={selectedIds}
          onSelectionChange={setSelectedIds}
          onRowClick={(testimonial) => navigate(`/testimonials/${testimonial.id}/edit`)}
          emptyIcon={MessageSquareQuote}
          emptyTitle="No testimonials yet"
          emptyDescription="Add a student video and it will appear on the testimonial wall."
          rowActions={(testimonial) => (
            <DropdownMenu
              trigger={
                <Button
                  variant="ghost"
                  size="sm"
                  aria-label={`Actions for ${testimonial.authorName}`}
                >
                  <MoreHorizontal size={16} />
                </Button>
              }
            >
              <DropdownItem
                icon={Pencil}
                onSelect={() => navigate(`/testimonials/${testimonial.id}/edit`)}
              >
                Edit
              </DropdownItem>
              <DropdownItem
                icon={testimonial.status === 'published' ? EyeOff : Send}
                onSelect={() => void togglePublished(testimonial)}
              >
                {testimonial.status === 'published' ? 'Unpublish' : 'Publish'}
              </DropdownItem>
              <DropdownSeparator />
              <DropdownItem
                icon={Trash2}
                tone="danger"
                onSelect={() => deleteTestimonial(testimonial)}
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

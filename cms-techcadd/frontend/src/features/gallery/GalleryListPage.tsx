import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { EyeOff, Images, MoreHorizontal, Pencil, Plus, Send, Trash2 } from 'lucide-react'

import { ApiError, type ListParams } from '../../api'
import { assetUrl } from '../../api/client'
import { Badge, ContentStatusBadge } from '../../components/common/Badge'
import { Button } from '../../components/common/Button'
import { Card } from '../../components/common/Card'
import { DropdownItem, DropdownMenu, DropdownSeparator } from '../../components/common/DropdownMenu'
import { DataTable, type Column } from '../../components/data/DataTable'
import { ViewOnSiteButton } from '../../components/common/ViewOnSite'
import { PageHeader } from '../../components/layout/PageHeader'
import { useConfirm } from '../../hooks/useConfirm'
import { useToast } from '../../hooks/useToast'
import type { ContentStatus, GalleryAlbum } from '../../types'
import { usePublishToggle } from '../shared/usePublishToggle'
import { albumHooks } from './useGallery'

/** Hand-ordered and few, so the whole set loads at once. */
const ALL: ListParams = { page: 1, pageSize: 500, sort: { field: 'order', dir: 'asc' } }

export default function GalleryListPage() {
  const navigate = useNavigate()
  const toast = useToast()
  const confirm = useConfirm()

  const query = albumHooks.useList(ALL)
  const remove = albumHooks.useRemove()
  const update = albumHooks.useUpdate()

  const togglePublished = usePublishToggle<GalleryAlbum>(
    (id, status: ContentStatus) => update.mutateAsync({ id, input: { status } }),
    'album',
  )

  const [selectedIds, setSelectedIds] = useState<string[]>([])

  const albums = useMemo(() => query.data?.items ?? [], [query.data])

  async function deleteAlbum(album: GalleryAlbum) {
    const confirmed = await confirm({
      title: `Delete the album “${album.title}”?`,
      description: 'The photos stay in the media library — only the album goes.',
      confirmLabel: 'Delete',
    })
    if (!confirmed) return

    try {
      await remove.mutateAsync([album.id])
      toast.success('Album deleted.')
    } catch (error) {
      toast.error('Could not delete', {
        description: error instanceof ApiError ? error.message : 'Please try again.',
      })
    }
  }

  const columns: Column<GalleryAlbum>[] = [
    {
      id: 'album',
      header: 'Album',
      cell: (album) => (
        <div className="flex min-w-0 items-center gap-3">
          {/*
            * `thumbnail` is the chosen cover, or the first image when none was
            * picked — resolved by the API so this row never has to guess.
            */}
          {album.thumbnail?.url ? (
            <img
              src={assetUrl(album.thumbnail.url)}
              alt=""
              className="size-10 shrink-0 rounded object-cover"
              loading="lazy"
            />
          ) : (
            <span className="grid size-10 shrink-0 place-items-center rounded bg-slate-100">
              <Images size={16} className="text-slate-400" />
            </span>
          )}
          <div className="min-w-0">
            <p className="truncate font-medium text-slate-900">{album.title}</p>
            <p className="truncate text-xs text-slate-500">/{album.slug}</p>
          </div>
        </div>
      ),
    },
    {
      id: 'category',
      header: 'Group',
      cell: (album) => <Badge tone="neutral">{album.category}</Badge>,
    },
    {
      id: 'photos',
      header: 'Photos',
      cell: (album) => (
        <span className="whitespace-nowrap text-sm text-slate-600">
          {album.imageCount ?? album.images?.length ?? 0}
        </span>
      ),
    },
    {
      id: 'status',
      header: 'Status',
      cell: (album) => <ContentStatusBadge status={album.status} />,
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Gallery"
        description="Photo albums for the campus, classrooms and events"
        actions={
          <>
            <ViewOnSiteButton module="gallery" />
            <Link to="/gallery/new">
              <Button icon={Plus}>Add album</Button>
            </Link>
          </>
        }
      />

      <Card flush>
        <DataTable
          rows={albums}
          columns={columns}
          getRowId={(album) => album.id}
          caption="Gallery albums with their group, photo count and status"
          loading={query.isLoading}
          error={query.error as Error | null}
          onRetry={() => query.refetch()}
          selectedIds={selectedIds}
          onSelectionChange={setSelectedIds}
          onRowClick={(album) => navigate(`/gallery/${album.id}/edit`)}
          emptyIcon={Images}
          emptyTitle="No albums yet"
          emptyDescription="Create an album, add photos from the media library, and it appears on the gallery page."
          rowActions={(album) => (
            <DropdownMenu
              trigger={
                <Button variant="ghost" size="sm" aria-label={`Actions for ${album.title}`}>
                  <MoreHorizontal size={16} />
                </Button>
              }
            >
              <DropdownItem icon={Pencil} onSelect={() => navigate(`/gallery/${album.id}/edit`)}>
                Edit
              </DropdownItem>
              <DropdownItem
                icon={album.status === 'published' ? EyeOff : Send}
                onSelect={() => void togglePublished(album)}
              >
                {album.status === 'published' ? 'Unpublish' : 'Publish'}
              </DropdownItem>
              <DropdownSeparator />
              <DropdownItem icon={Trash2} tone="danger" onSelect={() => deleteAlbum(album)}>
                Delete
              </DropdownItem>
            </DropdownMenu>
          )}
        />
      </Card>
    </div>
  )
}

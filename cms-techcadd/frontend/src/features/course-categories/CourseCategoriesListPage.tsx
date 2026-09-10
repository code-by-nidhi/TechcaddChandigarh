import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { EyeOff, FolderTree, MoreHorizontal, Pencil, Plus, Send, Trash2 } from 'lucide-react'

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
import type { ContentStatus, CourseCategory } from '../../types'
import { usePublishToggle } from '../shared/usePublishToggle'
import { courseCategoryHooks } from './useCourseCategories'

/** Hand-ordered and few, so the whole set loads at once. */
const ALL: ListParams = { page: 1, pageSize: 200, sort: { field: 'order', dir: 'asc' } }

export default function CourseCategoriesListPage() {
  const navigate = useNavigate()
  const toast = useToast()
  const confirm = useConfirm()

  const query = courseCategoryHooks.useList(ALL)
  const remove = courseCategoryHooks.useRemove()
  const update = courseCategoryHooks.useUpdate()

  const togglePublished = usePublishToggle<CourseCategory>(
    (id, status: ContentStatus) => update.mutateAsync({ id, input: { status } }),
    'category',
  )

  const [selectedIds, setSelectedIds] = useState<string[]>([])

  const categories = useMemo(() => query.data?.items ?? [], [query.data])

  async function deleteCategory(category: CourseCategory) {
    const count = category.courseCount ?? 0

    const confirmed = await confirm({
      title: `Delete “${category.name}”?`,
      // The courses survive — they just fall out of their filter group. Said
      // plainly, because "delete category" reads like it takes them with it.
      description:
        count > 0
          ? `${count} course${count === 1 ? '' : 's'} are filed under this. They will stay published but become uncategorised until you refile them.`
          : 'Nothing is filed under this category.',
      confirmLabel: 'Delete',
    })
    if (!confirmed) return

    try {
      await remove.mutateAsync([category.id])
      toast.success('Category deleted.')
    } catch (error) {
      toast.error('Could not delete', {
        description: error instanceof ApiError ? error.message : 'Please try again.',
      })
    }
  }

  const columns: Column<CourseCategory>[] = [
    {
      id: 'name',
      header: 'Category',
      cell: (category) => (
        <div className="min-w-0">
          <p className="truncate font-medium text-slate-900">{category.name}</p>
          <p className="truncate text-xs text-slate-500">
            {category.shortName} · {category.slug}
          </p>
        </div>
      ),
    },
    {
      id: 'courses',
      header: 'Courses',
      cell: (category) => (
        <span className="whitespace-nowrap text-sm text-slate-600">
          {category.courseCount ?? 0}
        </span>
      ),
    },
    {
      id: 'icon',
      header: 'Icon',
      cell: (category) => <Badge tone="neutral">{category.icon}</Badge>,
    },
    {
      id: 'status',
      header: 'Status',
      cell: (category) => <ContentStatusBadge status={category.status} />,
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Course Categories"
        description="The groups the courses page files everything under"
        actions={
          <>
            <ViewOnSiteButton module="course-categories" />
            <Link to="/course-categories/new">
              <Button icon={Plus}>Add category</Button>
            </Link>
          </>
        }
      />

      <Card flush>
        <DataTable
          rows={categories}
          columns={columns}
          getRowId={(category) => category.id}
          caption="Course categories with their course count and status"
          loading={query.isLoading}
          error={query.error as Error | null}
          onRetry={() => query.refetch()}
          selectedIds={selectedIds}
          onSelectionChange={setSelectedIds}
          onRowClick={(category) => navigate(`/course-categories/${category.id}/edit`)}
          emptyIcon={FolderTree}
          emptyTitle="No course categories yet"
          emptyDescription="Add a category and courses can be filed under it."
          rowActions={(category) => (
            <DropdownMenu
              trigger={
                <Button variant="ghost" size="sm" aria-label={`Actions for ${category.name}`}>
                  <MoreHorizontal size={16} />
                </Button>
              }
            >
              <DropdownItem
                icon={Pencil}
                onSelect={() => navigate(`/course-categories/${category.id}/edit`)}
              >
                Edit
              </DropdownItem>
              <DropdownItem
                icon={category.status === 'published' ? EyeOff : Send}
                onSelect={() => void togglePublished(category)}
              >
                {category.status === 'published' ? 'Unpublish' : 'Publish'}
              </DropdownItem>
              <DropdownSeparator />
              <DropdownItem icon={Trash2} tone="danger" onSelect={() => deleteCategory(category)}>
                Delete
              </DropdownItem>
            </DropdownMenu>
          )}
        />
      </Card>
    </div>
  )
}

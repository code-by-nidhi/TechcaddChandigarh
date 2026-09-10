import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { EyeOff, GraduationCap, MoreHorizontal, Pencil, Plus, Send, Trash2 } from 'lucide-react'

import { ApiError, type ListParams } from '../../api'
import { Badge, ContentStatusBadge } from '../../components/common/Badge'
import { Button } from '../../components/common/Button'
import { Card } from '../../components/common/Card'
import { DropdownItem, DropdownMenu, DropdownSeparator } from '../../components/common/DropdownMenu'
import { DataTable, type Column } from '../../components/data/DataTable'
import { PageHeader } from '../../components/layout/PageHeader'
import { useConfirm } from '../../hooks/useConfirm'
import { useToast } from '../../hooks/useToast'
import type { ContentStatus, Course } from '../../types'
import { usePublishToggle } from '../shared/usePublishToggle'
import { courseHooks } from './useCourses'

/** The catalogue is 44 courses, so the whole set loads at once. */
const ALL: ListParams = { page: 1, pageSize: 200, sort: { field: 'order', dir: 'asc' } }

const rupees = (value: number) => `₹${value.toLocaleString('en-IN')}`

export default function CoursesListPage() {
  const navigate = useNavigate()
  const toast = useToast()
  const confirm = useConfirm()

  const query = courseHooks.useList(ALL)
  const remove = courseHooks.useRemove()
  const update = courseHooks.useUpdate()

  const togglePublished = usePublishToggle<Course>(
    (id, status: ContentStatus) => update.mutateAsync({ id, input: { status } }),
    'course',
  )

  const [selectedIds, setSelectedIds] = useState<string[]>([])

  const courses = useMemo(() => query.data?.items ?? [], [query.data])

  async function deleteCourse(course: Course) {
    const confirmed = await confirm({
      title: `Delete “${course.name}”?`,
      // Said plainly because it is not one page: the key drives the course
      // page, the training page and any after-12th entry pointing at it.
      description:
        'Its syllabus goes with it, and every page built from its key stops existing. This cannot be undone.',
      confirmLabel: 'Delete',
    })
    if (!confirmed) return

    try {
      await remove.mutateAsync([course.id])
      toast.success('Course deleted.')
    } catch (error) {
      toast.error('Could not delete', {
        description: error instanceof ApiError ? error.message : 'Please try again.',
      })
    }
  }

  const columns: Column<Course>[] = [
    {
      id: 'name',
      header: 'Course',
      cell: (course) => (
        <div className="min-w-0">
          <p className="flex items-center gap-2 truncate font-medium text-slate-900">
            {course.name}
            {course.featured && <Badge tone="success">Featured</Badge>}
            {course.badge && <Badge tone="warning">{course.badge}</Badge>}
          </p>
          <p className="truncate text-xs text-slate-500">
            {course.courseKey}
            {course.hasTraining ? ' · also runs as training' : ''}
          </p>
        </div>
      ),
    },
    {
      id: 'category',
      header: 'Category',
      cell: (course) =>
        course.category ? (
          <Badge tone="neutral">{course.category.shortName}</Badge>
        ) : (
          // Visible rather than blank: a course drops here when its category
          // is deleted, and it stays out of the filter groups until refiled.
          <Badge tone="warning">Uncategorised</Badge>
        ),
    },
    {
      id: 'syllabus',
      header: 'Syllabus',
      cell: (course) => (
        <span className="whitespace-nowrap text-xs text-slate-500">
          {course.modules?.length ?? 0} modules · {course.tools?.length ?? 0} tools
        </span>
      ),
    },
    {
      id: 'fee',
      header: 'Fee',
      cell: (course) =>
        course.fee ? (
          <span className="whitespace-nowrap text-sm">
            {rupees(course.fee.offer)}
            {course.fee.offer !== course.fee.original && (
              <span className="ml-1.5 text-xs text-slate-400 line-through">
                {rupees(course.fee.original)}
              </span>
            )}
          </span>
        ) : (
          <span className="text-xs text-slate-400">On request</span>
        ),
    },
    {
      id: 'status',
      header: 'Status',
      cell: (course) => <ContentStatusBadge status={course.status} />,
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Courses"
        description="The catalogue every course page on the site is built from"
        actions={
          <Link to="/courses/new">
            <Button icon={Plus}>Add course</Button>
          </Link>
        }
      />

      <Card flush>
        <DataTable
          rows={courses}
          columns={columns}
          getRowId={(course) => course.id}
          caption="Courses with their category, syllabus size, fee and status"
          loading={query.isLoading}
          error={query.error as Error | null}
          onRetry={() => query.refetch()}
          selectedIds={selectedIds}
          onSelectionChange={setSelectedIds}
          onRowClick={(course) => navigate(`/courses/${course.id}/edit`)}
          emptyIcon={GraduationCap}
          emptyTitle="No courses yet"
          emptyDescription="Add a course and its pages appear on the site."
          rowActions={(course) => (
            <DropdownMenu
              trigger={
                <Button variant="ghost" size="sm" aria-label={`Actions for ${course.name}`}>
                  <MoreHorizontal size={16} />
                </Button>
              }
            >
              <DropdownItem icon={Pencil} onSelect={() => navigate(`/courses/${course.id}/edit`)}>
                Edit
              </DropdownItem>
              <DropdownItem
                icon={course.status === 'published' ? EyeOff : Send}
                onSelect={() => void togglePublished(course)}
              >
                {course.status === 'published' ? 'Unpublish' : 'Publish'}
              </DropdownItem>
              <DropdownSeparator />
              <DropdownItem icon={Trash2} tone="danger" onSelect={() => deleteCourse(course)}>
                Delete
              </DropdownItem>
            </DropdownMenu>
          )}
        />
      </Card>
    </div>
  )
}

import { useEffect } from 'react'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { zodResolver } from '@hookform/resolvers/zod'

import { ApiError } from '../../api'
import { AppearsOn } from '../../components/common/AppearsOn'
import { Button } from '../../components/common/Button'
import { Card, CardBody, CardHeader } from '../../components/common/Card'
import { Alert } from '../../components/feedback/Alert'
import { Spinner } from '../../components/feedback/Spinner'
import { FormField } from '../../components/form/FormField'
import { Input } from '../../components/form/Input'
import { NumberInput } from '../../components/form/NumberInput'
import { Select } from '../../components/form/Select'
import { Textarea } from '../../components/form/Textarea'
import { FormFooter } from '../../components/layout/FormFooter'
import { PageHeader } from '../../components/layout/PageHeader'
import { useToast } from '../../hooks/useToast'
import { useUnsavedChanges } from '../../hooks/useUnsavedChanges'
import { STATUS_OPTIONS } from '../shared/statusOptions'
import {
  courseCategorySchema,
  emptyCourseCategory,
  ICON_OPTIONS,
  type CourseCategoryFormValues,
} from './courseCategorySchema'
import { courseCategoryHooks } from './useCourseCategories'

export default function CourseCategoryFormPage() {
  const { id } = useParams<{ id: string }>()
  const isEdit = Boolean(id)
  const navigate = useNavigate()
  const toast = useToast()

  const existing = courseCategoryHooks.useOne(id)
  const create = courseCategoryHooks.useCreate()
  const update = courseCategoryHooks.useUpdate()

  const {
    control,
    register,
    handleSubmit,
    reset,
    setValue,
    setError,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<CourseCategoryFormValues>({
    resolver: zodResolver(courseCategorySchema),
    defaultValues: emptyCourseCategory(),
    mode: 'onBlur',
  })

  useEffect(() => {
    if (existing.data) reset(existing.data as CourseCategoryFormValues)
  }, [existing.data, reset])

  const blocker = useUnsavedChanges(isDirty && !isSubmitting)
  const saving = create.isPending || update.isPending
  const watched = useWatch({ control }) as Record<string, unknown>

  const publish =
    watched.status === 'published'
      ? undefined
      : () => {
          setValue('status', 'published', { shouldDirty: true })
          void handleSubmit(onSubmit)()
        }

  async function onSubmit(values: CourseCategoryFormValues) {
    try {
      if (isEdit && id) {
        await update.mutateAsync({ id, input: values })
        toast.success('Category updated.')
      } else {
        await create.mutateAsync(values)
        toast.success('Category added.')
      }
      navigate('/course-categories')
    } catch (error) {
      if (error instanceof ApiError && error.fieldErrors) {
        for (const [field, message] of Object.entries(error.fieldErrors)) {
          setError(field as keyof CourseCategoryFormValues, { message })
        }
        toast.error('Please fix the highlighted fields.')
        return
      }
      toast.error('Could not save this category', {
        description: error instanceof Error ? error.message : 'Please try again.',
      })
    }
  }

  if (isEdit && existing.isLoading) {
    return (
      <div className="flex items-center gap-2 p-8 text-sm text-slate-500">
        <Spinner />
        Loading category…
      </div>
    )
  }

  if (isEdit && existing.error) {
    return (
      <Alert tone="error" title="Could not load this category">
        <p>{(existing.error as Error).message}</p>
        <Link to="/course-categories" className="mt-3 inline-block">
          <Button variant="secondary" size="sm">
            Back to categories
          </Button>
        </Link>
      </Alert>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pb-24">
      <PageHeader
        title={isEdit ? 'Edit Course Category' : 'Add Course Category'}
        breadcrumb={[
          { label: 'Course Categories', to: '/course-categories' },
          { label: isEdit ? 'Edit' : 'New' },
        ]}
      />

      <AppearsOn module="course-categories" record={watched} saved={isEdit} />

      {Object.keys(errors).length > 0 && (
        <Alert tone="error" title="This category could not be saved">
          Check the highlighted fields below and try again.
        </Alert>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card flush>
            <CardHeader title="The category" />
            <CardBody className="space-y-5">
              <FormField label="Name" required error={errors.name?.message}>
                <Input {...register('name')} placeholder="e.g. Artificial Intelligence & Data" />
              </FormField>

              <FormField
                label="Short label"
                required
                description="What the filter pill shows, where the full name will not fit."
                error={errors.shortName?.message}
              >
                <Input {...register('shortName')} placeholder="e.g. AI & Data" />
              </FormField>

              <FormField
                label="Key"
                required
                description="Used in URLs and stored on every course. Renaming the category above is safe; changing this moves pages."
                error={errors.slug?.message}
              >
                <Input {...register('slug')} placeholder="e.g. ai" />
              </FormField>

              <FormField
                label="Blurb"
                description="One or two lines, shown under the category heading on the courses page."
                error={errors.blurb?.message}
              >
                <Textarea {...register('blurb')} rows={3} />
              </FormField>
            </CardBody>
          </Card>
        </div>

        <div className="space-y-6">
          <Card flush>
            <CardHeader title="Details" />
            <CardBody className="space-y-5">
              <FormField label="Status">
                <Select {...register('status')} options={STATUS_OPTIONS} />
              </FormField>

              <FormField
                label="Icon"
                description="From the website's own set. Anything outside this list would render as an empty square."
                error={errors.icon?.message}
              >
                <Select {...register('icon')} options={ICON_OPTIONS} />
              </FormField>

              <FormField
                label="Order"
                description="Lower numbers come first."
                error={errors.order?.message}
              >
                <Controller
                  control={control}
                  name="order"
                  render={({ field }) => (
                    <NumberInput
                      value={field.value ?? 0}
                      onChange={(value) => field.onChange(value === '' ? 0 : value)}
                      min={0}
                    />
                  )}
                />
              </FormField>
            </CardBody>
          </Card>
        </div>
      </div>

      <FormFooter
        onPublish={publish}
        cancelTo="/course-categories"
        submitLabel={isEdit ? 'Save changes' : 'Add category'}
        saving={saving}
        dirty={isDirty}
        blocker={blocker}
        entityLabel="category"
      />
    </form>
  )
}

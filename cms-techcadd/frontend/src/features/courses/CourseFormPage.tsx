import { useEffect } from 'react'
import { Controller, useFieldArray, useForm, useWatch } from 'react-hook-form'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { zodResolver } from '@hookform/resolvers/zod'
import { GripVertical, Plus, Trash2 } from 'lucide-react'

import { ApiError, type ListParams } from '../../api'
import { AppearsOn } from '../../components/common/AppearsOn'
import { Button } from '../../components/common/Button'
import { Card, CardBody, CardHeader } from '../../components/common/Card'
import { Alert } from '../../components/feedback/Alert'
import { Spinner } from '../../components/feedback/Spinner'
import { FormField } from '../../components/form/FormField'
import { ImageField } from '../../components/form/ImageField'
import { Input } from '../../components/form/Input'
import { NumberInput } from '../../components/form/NumberInput'
import { Select } from '../../components/form/Select'
import { SeoFields } from '../../components/form/SeoFields'
import { Switch } from '../../components/form/Switch'
import { TagInput } from '../../components/form/TagInput'
import { Textarea } from '../../components/form/Textarea'
import { FormFooter } from '../../components/layout/FormFooter'
import { PageHeader } from '../../components/layout/PageHeader'
import { useToast } from '../../hooks/useToast'
import { useUnsavedChanges } from '../../hooks/useUnsavedChanges'
import { courseCategoryHooks } from '../course-categories/useCourseCategories'
import { STATUS_OPTIONS } from '../shared/statusOptions'
import {
  BADGE_OPTIONS,
  courseSchema,
  emptyCourse,
  LEVEL_OPTIONS,
  type CourseFormValues,
} from './courseSchema'
import { courseHooks } from './useCourses'

const CATEGORY_QUERY: ListParams = { page: 1, pageSize: 200, sort: { field: 'order', dir: 'asc' } }

export default function CourseFormPage() {
  const { id } = useParams<{ id: string }>()
  const isEdit = Boolean(id)
  const navigate = useNavigate()
  const toast = useToast()

  const existing = courseHooks.useOne(id)
  const create = courseHooks.useCreate()
  const update = courseHooks.useUpdate()
  const categories = courseCategoryHooks.useList(CATEGORY_QUERY)

  const {
    control,
    register,
    handleSubmit,
    reset,
    setValue,
    setError,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<CourseFormValues>({
    resolver: zodResolver(courseSchema),
    defaultValues: emptyCourse(),
    mode: 'onBlur',
  })

  const modules = useFieldArray({ control, name: 'modules' })

  useEffect(() => {
    if (existing.data) reset(existing.data as CourseFormValues)
  }, [existing.data, reset])

  const blocker = useUnsavedChanges(isDirty && !isSubmitting)
  const saving = create.isPending || update.isPending

  const watched = useWatch({ control }) as Record<string, unknown>
  const fee = watched.fee as { original?: number; offer?: number } | null | undefined

  const categoryOptions = [
    { value: '', label: 'Uncategorised' },
    ...(categories.data?.items ?? []).map((category) => ({
      value: category.id,
      label: category.name,
    })),
  ]

  const publish =
    watched.status === 'published'
      ? undefined
      : () => {
          setValue('status', 'published', { shouldDirty: true })
          void handleSubmit(onSubmit)()
        }

  async function onSubmit(values: CourseFormValues) {
    try {
      const input = {
        ...values,
        // The select cannot hold null, so "Uncategorised" comes back as an
        // empty string. The API wants null to clear the column.
        categoryId: values.categoryId || null,
      }

      if (isEdit && id) {
        await update.mutateAsync({ id, input })
        toast.success('Course updated.')
      } else {
        await create.mutateAsync(input)
        toast.success('Course added.')
      }
      navigate('/courses')
    } catch (error) {
      if (error instanceof ApiError && error.fieldErrors) {
        for (const [field, message] of Object.entries(error.fieldErrors)) {
          setError(field as keyof CourseFormValues, { message })
        }
        toast.error('Please fix the highlighted fields.')
        return
      }
      toast.error('Could not save this course', {
        description: error instanceof Error ? error.message : 'Please try again.',
      })
    }
  }

  if (isEdit && existing.isLoading) {
    return (
      <div className="flex items-center gap-2 p-8 text-sm text-slate-500">
        <Spinner />
        Loading course…
      </div>
    )
  }

  if (isEdit && existing.error) {
    return (
      <Alert tone="error" title="Could not load this course">
        <p>{(existing.error as Error).message}</p>
        <Link to="/courses" className="mt-3 inline-block">
          <Button variant="secondary" size="sm">
            Back to courses
          </Button>
        </Link>
      </Alert>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pb-24">
      <PageHeader
        title={isEdit ? 'Edit Course' : 'Add Course'}
        breadcrumb={[{ label: 'Courses', to: '/courses' }, { label: isEdit ? 'Edit' : 'New' }]}
      />

      <AppearsOn module="courses" record={watched} saved={isEdit} />

      {Object.keys(errors).length > 0 && (
        <Alert tone="error" title="This course could not be saved">
          Check the highlighted fields below and try again.
        </Alert>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card flush>
            <CardHeader title="The course" />
            <CardBody className="space-y-5">
              <FormField label="Name" required error={errors.name?.message}>
                <Input {...register('name')} placeholder="e.g. Python Programming" />
              </FormField>

              <FormField
                label="Course key"
                required
                description="Every URL for this course is built from it — the course page, the training page and any after-12th entry. Changing it moves all of them."
                error={errors.courseKey?.message}
              >
                <Input {...register('courseKey')} placeholder="e.g. python" />
              </FormField>

              <FormField
                label="Summary"
                description="One or two sentences. This is what the card and the search result show."
                error={errors.summary?.message}
              >
                <Textarea {...register('summary')} rows={3} />
              </FormField>

              <div className="grid gap-5 sm:grid-cols-2">
                <FormField
                  label="Duration"
                  description="As displayed, e.g. “2 – 3 months”."
                  error={errors.duration?.message}
                >
                  <Input {...register('duration')} placeholder="2 – 3 months" />
                </FormField>

                <FormField label="Level" error={errors.level?.message}>
                  <Select {...register('level')} options={LEVEL_OPTIONS} />
                </FormField>
              </div>
            </CardBody>
          </Card>

          <Card flush>
            <CardHeader
              title="Syllabus"
              subtitle={`${modules.fields.length} modules. Each one is a heading on the course page with its topics beneath.`}
              action={
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  icon={Plus}
                  onClick={() => modules.append({ title: '', topics: [] })}
                >
                  Add module
                </Button>
              }
            />
            <CardBody className="space-y-4">
              {modules.fields.length === 0 && (
                <p className="text-sm text-slate-500">
                  No modules yet. A course with an empty syllabus still publishes — the page simply
                  omits that section.
                </p>
              )}

              {modules.fields.map((entry, index) => (
                <div key={entry.id} className="rounded-lg border border-slate-200 p-4">
                  <div className="flex items-start gap-2">
                    <GripVertical size={16} className="mt-2.5 shrink-0 text-slate-300" />

                    <div className="flex-1">
                      <Input
                        {...register(`modules.${index}.title`)}
                        placeholder="Module title, e.g. Core Python"
                        aria-label={`Title for module ${index + 1}`}
                        invalid={Boolean(errors.modules?.[index]?.title)}
                      />
                    </div>

                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      aria-label={`Remove module ${index + 1}`}
                      onClick={() => modules.remove(index)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>

                  {/*
                    * Topics are a tag input rather than a row of text boxes:
                    * a module has a dozen of them, and typing one and pressing
                    * Enter is far quicker than clicking "add" each time.
                    */}
                  <div className="mt-3 pl-6">
                    <Controller
                      control={control}
                      name={`modules.${index}.topics`}
                      render={({ field }) => (
                        <TagInput
                          value={field.value ?? []}
                          onChange={field.onChange}
                          placeholder="Add a topic and press Enter…"
                        />
                      )}
                    />
                  </div>
                </div>
              ))}
            </CardBody>
          </Card>

          <Card flush>
            <CardHeader title="What students get out of it" />
            <CardBody className="space-y-5">
              <FormField
                label="Tools covered"
                description="Shown as a row of chips on the course page."
                error={errors.tools?.message}
              >
                <Controller
                  control={control}
                  name="tools"
                  render={({ field }) => (
                    <TagInput
                      value={field.value ?? []}
                      onChange={field.onChange}
                      placeholder="e.g. Python, Django, PostgreSQL…"
                    />
                  )}
                />
              </FormField>

              <FormField
                label="Outcomes"
                description="What a student can do afterwards. One per entry."
                error={errors.outcomes?.message}
              >
                <Controller
                  control={control}
                  name="outcomes"
                  render={({ field }) => (
                    <TagInput
                      value={field.value ?? []}
                      onChange={field.onChange}
                      placeholder="Add an outcome and press Enter…"
                    />
                  )}
                />
              </FormField>

              <FormField
                label="Careers"
                description="The roles this track leads to."
                error={errors.careers?.message}
              >
                <Controller
                  control={control}
                  name="careers"
                  render={({ field }) => (
                    <TagInput
                      value={field.value ?? []}
                      onChange={field.onChange}
                      placeholder="e.g. Python Developer…"
                    />
                  )}
                />
              </FormField>
            </CardBody>
          </Card>

          <Controller
            control={control}
            name="seo"
            render={({ field }) => (
              <SeoFields
                value={field.value}
                onChange={field.onChange}
                previewUrl={`techcadd.com/${(watched.courseKey as string) || 'your-course'}-course-in-chandigarh`}
                fallbackTitle={(watched.name as string) ?? ''}
                fallbackDescription={(watched.summary as string) ?? ''}
                errors={{
                  metaTitle: errors.seo?.metaTitle?.message,
                  metaDescription: errors.seo?.metaDescription?.message,
                }}
              />
            )}
          />
        </div>

        <div className="space-y-6">
          <Card flush>
            <CardHeader title="Publishing" />
            <CardBody className="space-y-5">
              <FormField label="Status">
                <Select {...register('status')} options={STATUS_OPTIONS} />
              </FormField>

              <FormField label="Category" error={errors.categoryId?.message}>
                <Select {...register('categoryId')} options={categoryOptions} />
              </FormField>

              <FormField
                label="Badge"
                description="The ribbon on the card. Only these three are styled by the site."
              >
                <Select {...register('badge')} options={BADGE_OPTIONS} />
              </FormField>

              <Controller
                control={control}
                name="featured"
                render={({ field }) => (
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    label="Feature this course"
                    description="Featured courses lead the homepage and the branch pages."
                  />
                )}
              />

              <Controller
                control={control}
                name="hasTraining"
                render={({ field }) => (
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    label="Also runs as industrial training"
                    description="Publishes a second page at …-training-in-chandigarh. Only switch this on for tracks that genuinely run that way."
                  />
                )}
              />

              <FormField label="Hero image">
                <Controller
                  control={control}
                  name="heroImage"
                  render={({ field }) => (
                    <ImageField value={field.value} onChange={field.onChange} aspect="video" />
                  )}
                />
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

          <Card flush>
            <CardHeader
              title="Fee"
              subtitle="Leave both blank for “fee on request”."
            />
            <CardBody className="space-y-5">
              {/*
                * Written as a pair. Clearing one has to clear the other, or the
                * card shows an offer with nothing to compare it against.
                */}
              <FormField label="Original price" error={errors.fee?.original?.message}>
                <Controller
                  control={control}
                  name="fee.original"
                  render={({ field }) => (
                    <NumberInput
                      value={field.value ?? ''}
                      onChange={(value) =>
                        setValue(
                          'fee',
                          value === ''
                            ? null
                            : { original: Number(value), offer: fee?.offer ?? Number(value) },
                          { shouldDirty: true },
                        )
                      }
                      min={0}
                    />
                  )}
                />
              </FormField>

              <FormField label="Offer price" error={errors.fee?.offer?.message}>
                <Controller
                  control={control}
                  name="fee.offer"
                  render={({ field }) => (
                    <NumberInput
                      value={field.value ?? ''}
                      onChange={(value) =>
                        setValue(
                          'fee',
                          value === '' && !fee?.original
                            ? null
                            : {
                                original: fee?.original ?? Number(value),
                                offer: value === '' ? (fee?.original ?? 0) : Number(value),
                              },
                          { shouldDirty: true },
                        )
                      }
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
        cancelTo="/courses"
        submitLabel={isEdit ? 'Save changes' : 'Add course'}
        saving={saving}
        dirty={isDirty}
        blocker={blocker}
        entityLabel="course"
      />
    </form>
  )
}

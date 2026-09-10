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
import { ImageField } from '../../components/form/ImageField'
import { Input } from '../../components/form/Input'
import { NumberInput } from '../../components/form/NumberInput'
import { Select } from '../../components/form/Select'
import { StarRating } from '../../components/form/StarRating'
import { Switch } from '../../components/form/Switch'
import { Textarea } from '../../components/form/Textarea'
import { FormFooter } from '../../components/layout/FormFooter'
import { PageHeader } from '../../components/layout/PageHeader'
import { useToast } from '../../hooks/useToast'
import { useUnsavedChanges } from '../../hooks/useUnsavedChanges'
import { STATUS_OPTIONS } from '../shared/statusOptions'
import {
  emptyTestimonial,
  testimonialSchema,
  youtubeId,
  type TestimonialFormValues,
} from './testimonialSchema'
import { testimonialHooks } from './useTestimonials'

export default function TestimonialFormPage() {
  const { id } = useParams<{ id: string }>()
  const isEdit = Boolean(id)
  const navigate = useNavigate()
  const toast = useToast()

  const existing = testimonialHooks.useOne(id)
  const create = testimonialHooks.useCreate()
  const update = testimonialHooks.useUpdate()

  const {
    control,
    register,
    handleSubmit,
    reset,
    setValue,
    setError,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<TestimonialFormValues>({
    resolver: zodResolver(testimonialSchema),
    defaultValues: emptyTestimonial(),
    mode: 'onBlur',
  })

  useEffect(() => {
    if (existing.data) reset(existing.data as TestimonialFormValues)
  }, [existing.data, reset])

  const blocker = useUnsavedChanges(isDirty && !isSubmitting)
  const saving = create.isPending || update.isPending

  const watched = useWatch({ control }) as Record<string, unknown>
  const videoId = youtubeId(watched.youtubeUrl as string | undefined)

  /**
   * Publishes and saves in one action.
   *
   * Setting the status select and then pressing Save is two steps that read as
   * one, and the step people miss is the first.
   */
  const publish =
    watched.status === 'published'
      ? undefined
      : () => {
          setValue('status', 'published', { shouldDirty: true })
          void handleSubmit(onSubmit)()
        }

  async function onSubmit(values: TestimonialFormValues) {
    try {
      if (isEdit && id) {
        await update.mutateAsync({ id, input: values })
        toast.success('Testimonial updated.')
      } else {
        await create.mutateAsync(values)
        toast.success('Testimonial added.')
      }
      navigate('/testimonials')
    } catch (error) {
      if (error instanceof ApiError && error.fieldErrors) {
        for (const [field, message] of Object.entries(error.fieldErrors)) {
          setError(field as keyof TestimonialFormValues, { message })
        }
        toast.error('Please fix the highlighted fields.')
        return
      }
      toast.error('Could not save this testimonial', {
        description: error instanceof Error ? error.message : 'Please try again.',
      })
    }
  }

  if (isEdit && existing.isLoading) {
    return (
      <div className="flex items-center gap-2 p-8 text-sm text-slate-500">
        <Spinner />
        Loading testimonial…
      </div>
    )
  }

  if (isEdit && existing.error) {
    return (
      <Alert tone="error" title="Could not load this testimonial">
        <p>{(existing.error as Error).message}</p>
        <Link to="/testimonials" className="mt-3 inline-block">
          <Button variant="secondary" size="sm">
            Back to testimonials
          </Button>
        </Link>
      </Alert>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pb-24">
      <PageHeader
        title={isEdit ? 'Edit Testimonial' : 'Add Testimonial'}
        breadcrumb={[
          { label: 'Testimonials', to: '/testimonials' },
          { label: isEdit ? 'Edit' : 'New' },
        ]}
      />

      <AppearsOn module="testimonials" record={watched} saved={isEdit} />

      {Object.keys(errors).length > 0 && (
        <Alert tone="error" title="This testimonial could not be saved">
          Check the highlighted fields below and try again.
        </Alert>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card flush>
            <CardHeader title="The testimonial" />
            <CardBody className="space-y-5">
              <FormField label="Name" required error={errors.authorName?.message}>
                <Input {...register('authorName')} placeholder="e.g. Simranjeet Kaur" />
              </FormField>

              <FormField label="Rating" required error={errors.rating?.message}>
                <Controller
                  control={control}
                  name="rating"
                  render={({ field }) => (
                    <StarRating value={field.value} onChange={field.onChange} />
                  )}
                />
              </FormField>

              <FormField
                label="What they said"
                required
                description="Shown on the card whether or not there is a video, so it has to stand on its own."
                error={errors.quote?.message}
              >
                <Textarea {...register('quote')} rows={5} />
              </FormField>
            </CardBody>
          </Card>

          <Card flush>
            <CardHeader
              title="Video"
              subtitle="Plays in a dialog on the page — the visitor is never sent to YouTube."
            />
            <CardBody className="space-y-5">
              <FormField
                label="YouTube link"
                description="Paste the address from YouTube. Watch links, youtu.be, Shorts and embed links all work."
                error={errors.youtubeUrl?.message}
              >
                <Input
                  {...register('youtubeUrl')}
                  type="url"
                  inputMode="url"
                  placeholder="https://www.youtube.com/watch?v=…"
                />
              </FormField>

              {/*
                * A real thumbnail rather than a tick. It confirms the link
                * points at the video the editor meant, which is the mistake
                * this preview exists to catch.
                */}
              {videoId && (
                <div className="flex items-start gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3">
                  <img
                    src={`https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`}
                    alt=""
                    className="h-20 w-36 shrink-0 rounded object-cover"
                  />
                  <p className="text-xs text-slate-500">
                    This is the video visitors will see. If it is not the right one, check the link
                    above.
                  </p>
                </div>
              )}

              {!videoId && Boolean(watched.youtubeUrl) && (
                <Alert tone="warning" title="That link has no video in it we can recognise">
                  The card will still link out, but it will not play on the page. Copy the address
                  straight from the YouTube player to fix it.
                </Alert>
              )}
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
                label="Link to the Google review"
                description="Optional. Paste the link to this review on Google and the card becomes clickable, so a visitor can check it for themselves."
                error={errors.googleUrl?.message}
              >
                <Input
                  {...register('googleUrl')}
                  type="url"
                  inputMode="url"
                  placeholder="https://maps.app.goo.gl/…"
                />
              </FormField>

              <FormField
                label="Outcome"
                description="The line the card leads with — where this student ended up."
                error={errors.role?.message}
              >
                <Input {...register('role')} placeholder="e.g. Placed as MERN Developer" />
              </FormField>

              <FormField label="Course" error={errors.courseName?.message}>
                <Input {...register('courseName')} placeholder="e.g. MERN Stack Development" />
              </FormField>

              <FormField
                label="Photo"
                description="Optional. Without one the card shows their initials."
              >
                <Controller
                  control={control}
                  name="avatar"
                  render={({ field }) => (
                    <ImageField value={field.value} onChange={field.onChange} aspect="square" />
                  )}
                />
              </FormField>

              <Controller
                control={control}
                name="featured"
                render={({ field }) => (
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    label="Feature this testimonial"
                    description="Featured testimonials open the wall on the homepage."
                  />
                )}
              />

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
        cancelTo="/testimonials"
        submitLabel={isEdit ? 'Save changes' : 'Add testimonial'}
        saving={saving}
        dirty={isDirty}
        blocker={blocker}
        entityLabel="testimonial"
      />
    </form>
  )
}

import { useEffect } from 'react'
import { Controller, useFieldArray, useForm, useWatch } from 'react-hook-form'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { zodResolver } from '@hookform/resolvers/zod'
import { GripVertical, Plus, Trash2 } from 'lucide-react'

import { ApiError } from '../../api'
import { AppearsOn } from '../../components/common/AppearsOn'
import { Button } from '../../components/common/Button'
import { Card, CardBody, CardHeader } from '../../components/common/Card'
import { Alert } from '../../components/feedback/Alert'
import { Spinner } from '../../components/feedback/Spinner'
import { DatePicker } from '../../components/form/DatePicker'
import { FormField } from '../../components/form/FormField'
import { ImageField } from '../../components/form/ImageField'
import { Input } from '../../components/form/Input'
import { RichTextEditor } from '../../components/form/RichTextEditor'
import { Select } from '../../components/form/Select'
import { SeoFields } from '../../components/form/SeoFields'
import { SlugInput } from '../../components/form/SlugInput'
import { Switch } from '../../components/form/Switch'
import { Textarea } from '../../components/form/Textarea'
import { FormFooter } from '../../components/layout/FormFooter'
import { PageHeader } from '../../components/layout/PageHeader'
import { useToast } from '../../hooks/useToast'
import { useUnsavedChanges } from '../../hooks/useUnsavedChanges'
import { STATUS_OPTIONS } from '../shared/statusOptions'
import { emptyEvent, eventSchema, EVENT_TYPE_OPTIONS, type EventFormValues } from './eventSchema'
import { EventPhotos } from './EventPhotos'
import { eventHooks } from './useEvents'

/** `startTime` → "Start time", `seo` → "SEO". */
function fieldLabel(field: string): string {
  if (field === 'seo') return 'SEO'
  const spaced = field.replace(/([A-Z])/g, ' $1').toLowerCase()
  return spaced.charAt(0).toUpperCase() + spaced.slice(1)
}

export default function EventFormPage() {
  const { id } = useParams<{ id: string }>()
  const isEdit = Boolean(id)
  const navigate = useNavigate()
  const toast = useToast()

  const existing = eventHooks.useOne(id)
  const create = eventHooks.useCreate()
  const update = eventHooks.useUpdate()

  const {
    control,
    register,
    handleSubmit,
    reset,
    setValue,
    setError,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: emptyEvent(),
    mode: 'onBlur',
  })

  const agenda = useFieldArray({ control, name: 'agenda' })

  useEffect(() => {
    if (existing.data) reset(existing.data as EventFormValues)
  }, [existing.data, reset])

  const blocker = useUnsavedChanges(isDirty && !isSubmitting)
  const saving = create.isPending || update.isPending

  const watched = useWatch({ control }) as Record<string, unknown>
  const title = (watched.title as string) ?? ''

  const publish =
    watched.status === 'published'
      ? undefined
      : () => {
          setValue('status', 'published', { shouldDirty: true })
          void handleSubmit(onSubmit)()
        }

  async function onSubmit(values: EventFormValues) {
    try {
      if (isEdit && id) {
        await update.mutateAsync({ id, input: values })
        toast.success('Event updated.')
      } else {
        await create.mutateAsync(values)
        toast.success('Event added.')
      }
      navigate('/events')
    } catch (error) {
      if (error instanceof ApiError && error.fieldErrors) {
        for (const [field, message] of Object.entries(error.fieldErrors)) {
          setError(field as keyof EventFormValues, { message })
        }
        toast.error('Please fix the highlighted fields.')
        return
      }
      toast.error('Could not save this event', {
        description: error instanceof Error ? error.message : 'Please try again.',
      })
    }
  }

  if (isEdit && existing.isLoading) {
    return (
      <div className="flex items-center gap-2 p-8 text-sm text-slate-500">
        <Spinner />
        Loading event…
      </div>
    )
  }

  if (isEdit && existing.error) {
    return (
      <Alert tone="error" title="Could not load this event">
        <p>{(existing.error as Error).message}</p>
        <Link to="/events" className="mt-3 inline-block">
          <Button variant="secondary" size="sm">
            Back to events
          </Button>
        </Link>
      </Alert>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pb-24">
      <PageHeader
        title={isEdit ? 'Edit Event' : 'Add Event'}
        breadcrumb={[{ label: 'Events', to: '/events' }, { label: isEdit ? 'Edit' : 'New' }]}
      />

      <AppearsOn module="events" record={watched} saved={isEdit} />

      {Object.keys(errors).length > 0 && (
        <Alert tone="error" title="This event could not be saved">
          {/*
            * The fields are named, not just "highlighted".
            *
            * Not every field that can fail has a control to highlight — an SEO
            * value the API never returned, a photo entry, an agenda row that
            * scrolled out of view. Saying only "check the highlighted fields"
            * leaves an editor hunting a red border that is not on the screen,
            * which is exactly how an unsaveable event looked before.
            */}
          {Object.entries(errors)
            .map(([field, error]) => {
              const message = (error as { message?: string })?.message
              return message ? `${fieldLabel(field)}: ${message}` : fieldLabel(field)
            })
            .join(' · ')}
        </Alert>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card flush>
            <CardHeader title="The event" />
            <CardBody className="space-y-5">
              <FormField label="Title" required error={errors.title?.message}>
                <Input {...register('title')} placeholder="e.g. techcadd AI Summit" />
              </FormField>

              <FormField label="Slug" required error={errors.slug?.message}>
                <Controller
                  control={control}
                  name="slug"
                  render={({ field }) => (
                    <SlugInput
                      value={field.value}
                      onChange={field.onChange}
                      source={title}
                      baseUrl="techcadd.com/events/"
                    />
                  )}
                />
              </FormField>

              <FormField
                label="Summary"
                description="One or two lines. This is what the calendar card shows."
                error={errors.excerpt?.message}
              >
                <Textarea {...register('excerpt')} rows={3} />
              </FormField>

              <FormField label="Details" error={errors.body?.message}>
                <Controller
                  control={control}
                  name="body"
                  render={({ field }) => (
                    <RichTextEditor value={field.value ?? ''} onChange={field.onChange} />
                  )}
                />
              </FormField>
            </CardBody>
          </Card>

          <Card flush>
            <CardHeader
              title="Agenda"
              subtitle="The running order. Leave it empty and the event page simply omits the schedule."
              action={
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  icon={Plus}
                  onClick={() => agenda.append({ time: '', item: '' })}
                >
                  Add slot
                </Button>
              }
            />
            <CardBody className="space-y-3">
              {agenda.fields.length === 0 && (
                <p className="text-sm text-slate-500">No slots yet.</p>
              )}

              {agenda.fields.map((entry, index) => (
                <div key={entry.id} className="flex items-start gap-2">
                  <GripVertical size={16} className="mt-2.5 shrink-0 text-slate-300" />

                  {/*
                    * A plain text box, not a time picker: a one-day summit reads
                    * "09:30" and a four-day workshop reads "Day 1", and a picker
                    * would make the second one unsayable.
                    */}
                  <div className="w-28 shrink-0">
                    <Input
                      {...register(`agenda.${index}.time`)}
                      placeholder="09:30"
                      aria-label={`Time for slot ${index + 1}`}
                      invalid={Boolean(errors.agenda?.[index]?.time)}
                    />
                  </div>

                  <div className="flex-1">
                    <Input
                      {...register(`agenda.${index}.item`)}
                      placeholder="What happens in this slot"
                      aria-label={`Description for slot ${index + 1}`}
                      invalid={Boolean(errors.agenda?.[index]?.item)}
                    />
                  </div>

                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    aria-label={`Remove slot ${index + 1}`}
                    onClick={() => agenda.remove(index)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              ))}

              {errors.agenda && (
                <p className="text-sm text-red-600">
                  Every slot needs both a time and a description.
                </p>
              )}
            </CardBody>
          </Card>

          <Card flush>
            <CardHeader
              title="Photographs"
              subtitle="What the event page leads with. An event that already happened is best shown, not described."
            />
            <CardBody>
              <Controller
                control={control}
                name="photos"
                render={({ field }) => (
                  <EventPhotos photos={field.value ?? []} onChange={field.onChange} />
                )}
              />
            </CardBody>
          </Card>

          <Controller
            control={control}
            name="seo"
            render={({ field }) => (
              <SeoFields
                value={field.value}
                onChange={field.onChange}
                previewUrl={`techcadd.com/events/${(watched.slug as string) || 'your-slug'}`}
                fallbackTitle={title}
                fallbackDescription={(watched.excerpt as string) ?? ''}
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
            <CardHeader title="When and where" />
            <CardBody className="space-y-5">
              <FormField label="Status">
                <Select {...register('status')} options={STATUS_OPTIONS} />
              </FormField>

              <FormField label="Date" required error={errors.date?.message}>
                <Controller
                  control={control}
                  name="date"
                  render={({ field }) => (
                    <DatePicker
                      value={field.value}
                      onChange={(value) => field.onChange(value ?? '')}
                      invalid={Boolean(errors.date)}
                    />
                  )}
                />
              </FormField>

              <FormField
                label="End date"
                description="Only for an event that runs over several days."
                error={errors.endDate?.message}
              >
                <Controller
                  control={control}
                  name="endDate"
                  render={({ field }) => (
                    <DatePicker
                      value={field.value || undefined}
                      onChange={(value) => field.onChange(value ?? '')}
                    />
                  )}
                />
              </FormField>

              <FormField
                label="Start time"
                description="As displayed, e.g. “09:30 AM”."
                error={errors.startTime?.message}
              >
                <Input {...register('startTime')} placeholder="09:30 AM" />
              </FormField>

              <FormField label="Location" error={errors.location?.message}>
                <Input {...register('location')} placeholder="Sector 34-A campus, Lab 3" />
              </FormField>

              <FormField label="Type">
                <Select {...register('type')} options={EVENT_TYPE_OPTIONS} />
              </FormField>
            </CardBody>
          </Card>

          <Card flush>
            <CardHeader
              title="Pictures"
              subtitle="The cover leads the listing card; the gallery is what the event page shows."
            />
            <CardBody className="space-y-5">
              <FormField
                label="Cover image"
                description="Shown on the events calendar and as the social preview."
              >
                <Controller
                  control={control}
                  name="cover"
                  render={({ field }) => (
                    <ImageField value={field.value} onChange={field.onChange} aspect="video" />
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
                    label="Feature this event"
                    description="Featured events lead the calendar page."
                  />
                )}
              />
            </CardBody>
          </Card>
        </div>
      </div>

      <FormFooter
        onPublish={publish}
        cancelTo="/events"
        submitLabel={isEdit ? 'Save changes' : 'Add event'}
        saving={saving}
        dirty={isDirty}
        blocker={blocker}
        entityLabel="event"
      />
    </form>
  )
}

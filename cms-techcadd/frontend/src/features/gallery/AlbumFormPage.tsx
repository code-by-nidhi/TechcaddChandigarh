import { useEffect, useState } from 'react'
import { Controller, useFieldArray, useForm, useWatch } from 'react-hook-form'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { zodResolver } from '@hookform/resolvers/zod'
import { ImagePlus, Trash2 } from 'lucide-react'

import { ApiError } from '../../api'
import { assetUrl } from '../../api/client'
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
import { SlugInput } from '../../components/form/SlugInput'
import { Textarea } from '../../components/form/Textarea'
import { MediaPicker } from '../../components/media/MediaPicker'
import { FormFooter } from '../../components/layout/FormFooter'
import { PageHeader } from '../../components/layout/PageHeader'
import { useToast } from '../../hooks/useToast'
import { useUnsavedChanges } from '../../hooks/useUnsavedChanges'
import { STATUS_OPTIONS } from '../shared/statusOptions'
import { albumSchema, CATEGORY_SUGGESTIONS, emptyAlbum, type AlbumFormValues } from './albumSchema'
import { albumHooks } from './useGallery'

const CATEGORY_OPTIONS = CATEGORY_SUGGESTIONS.map((value) => ({ value, label: value }))

export default function AlbumFormPage() {
  const { id } = useParams<{ id: string }>()
  const isEdit = Boolean(id)
  const navigate = useNavigate()
  const toast = useToast()

  const existing = albumHooks.useOne(id)
  const create = albumHooks.useCreate()
  const update = albumHooks.useUpdate()

  const [pickerOpen, setPickerOpen] = useState(false)

  const {
    control,
    register,
    handleSubmit,
    reset,
    setValue,
    setError,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<AlbumFormValues>({
    resolver: zodResolver(albumSchema),
    defaultValues: emptyAlbum(),
    mode: 'onBlur',
  })

  const images = useFieldArray({ control, name: 'images' })

  useEffect(() => {
    if (existing.data) reset(existing.data as AlbumFormValues)
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

  async function onSubmit(values: AlbumFormValues) {
    try {
      if (isEdit && id) {
        await update.mutateAsync({ id, input: values })
        toast.success('Album updated.')
      } else {
        await create.mutateAsync(values)
        toast.success('Album created.')
      }
      navigate('/gallery')
    } catch (error) {
      if (error instanceof ApiError && error.fieldErrors) {
        for (const [field, message] of Object.entries(error.fieldErrors)) {
          setError(field as keyof AlbumFormValues, { message })
        }
        toast.error('Please fix the highlighted fields.')
        return
      }
      toast.error('Could not save this album', {
        description: error instanceof Error ? error.message : 'Please try again.',
      })
    }
  }

  if (isEdit && existing.isLoading) {
    return (
      <div className="flex items-center gap-2 p-8 text-sm text-slate-500">
        <Spinner />
        Loading album…
      </div>
    )
  }

  if (isEdit && existing.error) {
    return (
      <Alert tone="error" title="Could not load this album">
        <p>{(existing.error as Error).message}</p>
        <Link to="/gallery" className="mt-3 inline-block">
          <Button variant="secondary" size="sm">
            Back to the gallery
          </Button>
        </Link>
      </Alert>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pb-24">
      <PageHeader
        title={isEdit ? 'Edit Album' : 'New Album'}
        breadcrumb={[{ label: 'Gallery', to: '/gallery' }, { label: isEdit ? 'Edit' : 'New' }]}
      />

      <AppearsOn module="gallery" record={watched} saved={isEdit} />

      {Object.keys(errors).length > 0 && (
        <Alert tone="error" title="This album could not be saved">
          Check the highlighted fields below and try again.
        </Alert>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card flush>
            <CardHeader title="The album" />
            <CardBody className="space-y-5">
              <FormField label="Title" required error={errors.title?.message}>
                <Input {...register('title')} placeholder="e.g. AI Summit 2026" />
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
                      baseUrl="techcadd.com/gallery/"
                    />
                  )}
                />
              </FormField>

              <FormField
                label="Description"
                description="Optional. Shown under the album heading."
                error={errors.description?.message}
              >
                <Textarea {...register('description')} rows={3} />
              </FormField>
            </CardBody>
          </Card>

          <Card flush>
            <CardHeader
              title="Photos"
              subtitle={`${images.fields.length} in this album. Drag order is the order they appear.`}
              action={
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  icon={ImagePlus}
                  onClick={() => setPickerOpen(true)}
                >
                  Add photos
                </Button>
              }
            />
            <CardBody className="space-y-3">
              {images.fields.length === 0 && (
                <p className="text-sm text-slate-500">
                  No photos yet. Add them from the media library.
                </p>
              )}

              {images.fields.map((entry, index) => {
                const url = entry.url
                return (
                  <div
                    key={entry.id}
                    className="flex items-center gap-3 rounded-lg border border-slate-200 p-2"
                  >
                    {url ? (
                      <img
                        src={assetUrl(url)}
                        alt=""
                        className="size-14 shrink-0 rounded object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <span className="size-14 shrink-0 rounded bg-slate-100" />
                    )}

                    {/*
                      * A caption per placement, not per file: the same photo can
                      * caption differently in a Campus album and an Events one,
                      * so this overrides the library's alt text here only.
                      */}
                    <div className="flex-1">
                      <Input
                        {...register(`images.${index}.caption`)}
                        placeholder="Caption — also the alt text for this tile"
                        aria-label={`Caption for photo ${index + 1}`}
                      />
                    </div>

                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      aria-label={`Remove photo ${index + 1}`}
                      onClick={() => images.remove(index)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                )
              })}
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
                label="Group"
                description="The filter pill this album sits under on the gallery page."
                error={errors.category?.message}
              >
                <Select {...register('category')} options={CATEGORY_OPTIONS} />
              </FormField>

              <FormField
                label="Cover"
                description="Optional. Without one the album shows its first photo."
              >
                <Controller
                  control={control}
                  name="cover"
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
        </div>
      </div>

      <MediaPicker
        open={pickerOpen}
        onOpenChange={setPickerOpen}
        multiple
        onSelect={(items) => {
          // Appended rather than replacing, so a second trip to the library
          // adds to the album instead of discarding what is already in it.
          for (const item of items) {
            images.append({
              mediaId: item.id,
              caption: item.alt ?? '',
              url: item.url,
              alt: item.alt,
            })
          }
          setPickerOpen(false)
        }}
      />

      <FormFooter
        onPublish={publish}
        cancelTo="/gallery"
        submitLabel={isEdit ? 'Save changes' : 'Create album'}
        saving={saving}
        dirty={isDirty}
        blocker={blocker}
        entityLabel="album"
      />
    </form>
  )
}

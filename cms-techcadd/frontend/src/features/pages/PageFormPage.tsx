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
import {
  emptyPage,
  pageSchema,
  PAGE_KIND_OPTIONS,
  ROUTE_OPTIONS,
  type PageFormValues,
} from './pageSchema'
import { pageHooks } from './usePages'

export default function PageFormPage() {
  const { id } = useParams<{ id: string }>()
  const isEdit = Boolean(id)
  const navigate = useNavigate()
  const toast = useToast()

  const existing = pageHooks.useOne(id)
  const create = pageHooks.useCreate()
  const update = pageHooks.useUpdate()

  const {
    control,
    register,
    handleSubmit,
    reset,
    setValue,
    setError,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<PageFormValues>({
    resolver: zodResolver(pageSchema),
    defaultValues: emptyPage(),
    mode: 'onBlur',
  })

  useEffect(() => {
    if (existing.data) reset(existing.data as PageFormValues)
  }, [existing.data, reset])

  const blocker = useUnsavedChanges(isDirty && !isSubmitting)
  const saving = create.isPending || update.isPending

  const watched = useWatch({ control }) as Record<string, unknown>
  const title = (watched.title as string) ?? ''
  const slug = (watched.slug as string) ?? ''
  const isOverride = watched.kind === 'override'

  const publish =
    watched.status === 'published'
      ? undefined
      : () => {
          setValue('status', 'published', { shouldDirty: true })
          void handleSubmit(onSubmit)()
        }

  async function onSubmit(values: PageFormValues) {
    try {
      if (isEdit && id) {
        await update.mutateAsync({ id, input: values })
        toast.success('Page updated.')
      } else {
        await create.mutateAsync(values)
        toast.success('Page created.')
      }
      navigate('/pages')
    } catch (error) {
      if (error instanceof ApiError && error.fieldErrors) {
        for (const [field, message] of Object.entries(error.fieldErrors)) {
          setError(field as keyof PageFormValues, { message })
        }
        toast.error('Please fix the highlighted fields.')
        return
      }
      toast.error('Could not save this page', {
        description: error instanceof Error ? error.message : 'Please try again.',
      })
    }
  }

  if (isEdit && existing.isLoading) {
    return (
      <div className="flex items-center gap-2 p-8 text-sm text-slate-500">
        <Spinner />
        Loading page…
      </div>
    )
  }

  if (isEdit && existing.error) {
    return (
      <Alert tone="error" title="Could not load this page">
        <p>{(existing.error as Error).message}</p>
        <Link to="/pages" className="mt-3 inline-block">
          <Button variant="secondary" size="sm">
            Back to pages
          </Button>
        </Link>
      </Alert>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pb-24">
      <PageHeader
        title={isEdit ? 'Edit Page' : 'New Page'}
        breadcrumb={[{ label: 'Pages', to: '/pages' }, { label: isEdit ? 'Edit' : 'New' }]}
      />

      <AppearsOn module="pages" record={watched} saved={isEdit} />

      {Object.keys(errors).length > 0 && (
        <Alert tone="error" title="This page could not be saved">
          Check the highlighted fields below and try again.
        </Alert>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card flush>
            <CardHeader title="The page" />
            <CardBody className="space-y-5">
              <FormField
                label="What is this?"
                description="A new page gets a URL of its own. Replacing an existing page changes the wording on a page the site already has."
              >
                <Select {...register('kind')} options={PAGE_KIND_OPTIONS} />
              </FormField>

              <FormField label="Title" required error={errors.title?.message}>
                <Input {...register('title')} placeholder="e.g. Scholarships" />
              </FormField>

              {/*
                * Two different questions behind one column. A new page needs a
                * slug invented for it; an override needs to name a route that
                * already exists, which is a choice from a list rather than
                * something to type and get wrong.
                */}
              {isOverride ? (
                <FormField
                  label="Which page"
                  required
                  description="The existing page whose copy this replaces."
                  error={errors.slug?.message}
                >
                  <Select {...register('slug')} options={ROUTE_OPTIONS} />
                </FormField>
              ) : (
                <FormField label="Slug" required error={errors.slug?.message}>
                  <Controller
                    control={control}
                    name="slug"
                    render={({ field }) => (
                      <SlugInput
                        value={field.value}
                        onChange={field.onChange}
                        source={title}
                        baseUrl="techcadd.com/pages/"
                      />
                    )}
                  />
                </FormField>
              )}

              <FormField
                label="Summary"
                description="Used in menus and search results."
                error={errors.excerpt?.message}
              >
                <Textarea {...register('excerpt')} rows={2} />
              </FormField>
            </CardBody>
          </Card>

          <Card flush>
            <CardHeader
              title="Page heading"
              subtitle={
                isOverride
                  ? 'Anything left blank keeps whatever the page says today.'
                  : 'The banner at the top of the page.'
              }
            />
            <CardBody className="space-y-5">
              <FormField label="Eyebrow" description="The small line above the heading.">
                <Input {...register('heroEyebrow')} placeholder="e.g. Financial support" />
              </FormField>

              <FormField label="Heading" error={errors.heroTitle?.message}>
                <Input {...register('heroTitle')} placeholder="Leave blank to use the title" />
              </FormField>

              <FormField label="Intro" error={errors.heroBody?.message}>
                <Textarea {...register('heroBody')} rows={3} />
              </FormField>
            </CardBody>
          </Card>

          {/*
            * An override replaces heading copy and nothing more: the rest of
            * those routes is built from data the site owns, so a body typed
            * here would have nowhere to go and would read as a save that did
            * nothing.
            */}
          {!isOverride && (
            <Card flush>
              <CardHeader title="Content" />
              <CardBody>
                <Controller
                  control={control}
                  name="body"
                  render={({ field }) => (
                    <RichTextEditor value={field.value ?? ''} onChange={field.onChange} />
                  )}
                />
              </CardBody>
            </Card>
          )}

          <Controller
            control={control}
            name="seo"
            render={({ field }) => (
              <SeoFields
                value={field.value}
                onChange={field.onChange}
                previewUrl={
                  isOverride
                    ? `techcadd.com/${slug || 'page'}`
                    : `techcadd.com/pages/${slug || 'your-slug'}`
                }
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
            <CardHeader title="Publishing" />
            <CardBody className="space-y-5">
              <FormField label="Status">
                <Select {...register('status')} options={STATUS_OPTIONS} />
              </FormField>

              {isOverride ? (
                <Alert tone="info" title="This replaces copy on an existing page">
                  Nothing new is published at its own address. Unpublish it and the page goes back
                  to the wording built into the site.
                </Alert>
              ) : (
                <Controller
                  control={control}
                  name="showInNav"
                  render={({ field }) => (
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      label="Show in the Resources menu"
                      description="Listed under Resources → Pages on the website."
                    />
                  )}
                />
              )}

              <FormField label="Cover image">
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
                description="Lower numbers come first in the menu."
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
        cancelTo="/pages"
        submitLabel={isEdit ? 'Save changes' : 'Create page'}
        saving={saving}
        dirty={isDirty}
        blocker={blocker}
        entityLabel="page"
      />
    </form>
  )
}

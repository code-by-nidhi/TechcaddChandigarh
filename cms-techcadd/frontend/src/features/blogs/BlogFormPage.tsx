import { useEffect, useState } from 'react'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { zodResolver } from '@hookform/resolvers/zod'

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
import { SelectOrCreate } from '../../components/form/SelectOrCreate'
import { SeoFields } from '../../components/form/SeoFields'
import { SlugInput } from '../../components/form/SlugInput'
import { Switch } from '../../components/form/Switch'
import { TagInput } from '../../components/form/TagInput'
import { Textarea } from '../../components/form/Textarea'
import { FormFooter } from '../../components/layout/FormFooter'
import { PageHeader } from '../../components/layout/PageHeader'
import { useToast } from '../../hooks/useToast'
import { useUnsavedChanges } from '../../hooks/useUnsavedChanges'
import { categoryHooks } from '../categories/useCategories'
import { slugify } from '../../lib/slugify'
import { STATUS_OPTIONS } from '../shared/statusOptions'
import { blogSchema, emptyBlog, readingTimeMinutes, type BlogFormValues } from './blogSchema'
import { blogHooks } from './useBlogs'

export default function BlogFormPage() {
  const { id } = useParams<{ id: string }>()
  const isEdit = Boolean(id)
  const navigate = useNavigate()
  const toast = useToast()

  const existing = blogHooks.useOne(id)
  const create = blogHooks.useCreate()
  const update = blogHooks.useUpdate()
  const categories = categoryHooks.useList({ page: 1, pageSize: 200 })
  const createCategory = categoryHooks.useCreate()
  const removeCategory = categoryHooks.useRemove()

  /*
   * Categories created from this form, in this session.
   *
   * An editor can add a category here, change their mind and file the post
   * somewhere else — which would leave an empty category behind that nobody
   * asked for. These ids are the only ones this form is allowed to clean up;
   * a category made deliberately on the Categories page is never touched, even
   * when it is empty, because pre-creating one before writing its posts is a
   * perfectly reasonable thing to do.
   *
   * State rather than a ref: selecting the new category re-renders anyway, so
   * there is nothing to avoid, and a ref read from the submit handler is a
   * value the compiler cannot reason about.
   */
  const [createdHere, setCreatedHere] = useState<string[]>([])

  const {
    control,
    register,
    handleSubmit,
    reset,
    setValue,
    setError,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<BlogFormValues>({
    resolver: zodResolver(blogSchema),
    defaultValues: emptyBlog(),
    mode: 'onBlur',
  })

  useEffect(() => {
    if (existing.data) reset(existing.data as BlogFormValues)
  }, [existing.data, reset])

  const blocker = useUnsavedChanges(isDirty && !isSubmitting)
  const title = useWatch({ control, name: 'title' })
  const slug = useWatch({ control, name: 'slug' })
  const excerpt = useWatch({ control, name: 'excerpt' })
  const body = useWatch({ control, name: 'body' })
  const saving = create.isPending || update.isPending

  // Feeds the "where this appears" note — it shows the live URL, which moves
  // with the slug as it is typed.
  const watched = useWatch({ control }) as Record<string, unknown>

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

  const categoryOptions = (categories.data?.items ?? []).map((category) => ({
    value: category.id,
    label: category.name,
  }))

  /**
   * Removes categories this form created and the post did not end up using.
   *
   * Never allowed to fail the save: the article is already stored by the time
   * this runs, and an editor should not see "could not save" because a tidy-up
   * request was refused. A category that survives is empty, visible on the
   * Categories page, and deletable there.
   */
  async function discardUnusedCategories(keptId: string | null | undefined) {
    const orphans = createdHere.filter((categoryId) => categoryId !== keptId)
    setCreatedHere(keptId ? [keptId] : [])
    if (orphans.length === 0) return

    try {
      await removeCategory.mutateAsync(orphans)
    } catch {
      // Left in place deliberately — see the note above.
    }
  }

  async function onSubmit(values: BlogFormValues) {
    try {
      if (isEdit && id) {
        await update.mutateAsync({ id, input: values })
        toast.success('Article updated.')
      } else {
        await create.mutateAsync(values)
        toast.success('Article created.')
      }
      await discardUnusedCategories(values.categoryId)
      navigate('/blogs')
    } catch (error) {
      if (error instanceof ApiError && error.fieldErrors) {
        for (const [field, message] of Object.entries(error.fieldErrors)) {
          setError(field as keyof BlogFormValues, { message })
        }
        toast.error('Please fix the highlighted fields.')
        return
      }
      toast.error('Could not save this article', {
        description: error instanceof Error ? error.message : 'Please try again.',
      })
    }
  }

  if (isEdit && existing.isLoading) {
    return (
      <div className="flex items-center gap-2 p-8 text-sm text-slate-500">
        <Spinner />
        Loading article…
      </div>
    )
  }

  if (isEdit && existing.error) {
    return (
      <Alert tone="error" title="Could not load this article">
        <p>{(existing.error as Error).message}</p>
        <Link to="/blogs" className="mt-3 inline-block">
          <Button variant="secondary" size="sm">
            Back to blogs
          </Button>
        </Link>
      </Alert>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pb-24">
      <PageHeader
        title={isEdit ? 'Edit Article' : 'Add Article'}
        breadcrumb={[{ label: 'Blogs', to: '/blogs' }, { label: isEdit ? 'Edit' : 'New' }]}
      />

      <AppearsOn module="blogs" record={watched} saved={isEdit} />

      {Object.keys(errors).length > 0 && (
        <Alert tone="error" title="This article could not be saved">
          Check the highlighted fields below and try again.
        </Alert>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card flush>
            <CardHeader
              title="Article"
              subtitle={body ? `About ${readingTimeMinutes(body)} min to read` : undefined}
            />
            <CardBody className="space-y-5">
              <FormField label="Title" required error={errors.title?.message}>
                <Input {...register('title')} placeholder="e.g. Top 10 Skills for 2026" />
              </FormField>

              <FormField label="URL slug" required error={errors.slug?.message}>
                <Controller
                  control={control}
                  name="slug"
                  render={({ field }) => (
                    <SlugInput
                      value={field.value}
                      onChange={field.onChange}
                      source={title}
                      baseUrl="techcadd.com/blog/"
                    />
                  )}
                />
              </FormField>

              <FormField
                label="Excerpt"
                required
                description="Shown on article cards and in search results."
                error={errors.excerpt?.message}
              >
                <Textarea {...register('excerpt')} rows={3} maxLength={300} showCount />
              </FormField>

              <FormField label="Body" error={errors.body?.message}>
                <Controller
                  control={control}
                  name="body"
                  render={({ field }) => (
                    <RichTextEditor value={field.value} onChange={field.onChange} />
                  )}
                />
              </FormField>
            </CardBody>
          </Card>
        </div>

        <div className="space-y-6">
          <Card flush>
            <CardHeader title="Publishing" />
            <CardBody className="space-y-5">
              <FormField label="Status">
                <Select {...register('status')} options={STATUS_OPTIONS} />
              </FormField>

              <FormField label="Publish date">
                <Controller
                  control={control}
                  name="publishDate"
                  render={({ field }) => (
                    <DatePicker value={field.value} onChange={field.onChange} />
                  )}
                />
              </FormField>

              <FormField
                label="Category"
                description="Pick one, or add a new one without leaving this page."
              >
                {/* Controlled, not registered: the control needs a defined
                    value or React treats it as uncontrolled and warns on the
                    first edit. */}
                <Controller
                  control={control}
                  name="categoryId"
                  render={({ field }) => (
                    <SelectOrCreate
                      value={field.value ?? ''}
                      onChange={field.onChange}
                      options={categoryOptions}
                      placeholder="Uncategorised"
                      noun="category"
                      onCreate={async (name) => {
                        const category = await createCategory.mutateAsync({
                          name,
                          slug: slugify(name),
                          // Published, not draft: a category an editor just
                          // made to file this post under has to be one the
                          // site will actually show it in.
                          status: 'published',
                          order: 0,
                        })
                        setCreatedHere((previous) => [...previous, category.id])
                        return category.id
                      }}
                    />
                  )}
                />
              </FormField>

              <FormField label="Tags">
                <Controller
                  control={control}
                  name="tags"
                  render={({ field }) => (
                    <TagInput value={field.value} onChange={field.onChange} maxTags={8} />
                  )}
                />
              </FormField>
            </CardBody>
          </Card>

          <Card flush>
            <CardHeader
              title="Promotion"
              subtitle="Where this article shows up on the blog, beyond the listing."
            />
            <CardBody className="space-y-5">
              <Controller
                control={control}
                name="featured"
                render={({ field }) => (
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    label="Lead story"
                    description="The large panel at the top of the blog. Turning this on takes it from whichever article has it now."
                  />
                )}
              />

              <Controller
                control={control}
                name="trending"
                render={({ field }) => (
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    label="Trending"
                    description="Appears in the Trending sidebar and the editor's picks row."
                  />
                )}
              />
            </CardBody>
          </Card>

          <Card flush>
            <CardHeader title="Cover image" />
            <CardBody>
              <Controller
                control={control}
                name="coverImage"
                render={({ field }) => (
                  <ImageField value={field.value} onChange={field.onChange} aspect="video" />
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
                previewUrl={`techcadd.com/blog/${slug || 'your-slug'}`}
                fallbackTitle={title}
                fallbackDescription={excerpt}
                errors={{
                  metaTitle: errors.seo?.metaTitle?.message,
                  metaDescription: errors.seo?.metaDescription?.message,
                }}
              />
            )}
          />
        </div>
      </div>

      <FormFooter
        onPublish={publish}
        cancelTo="/blogs"
        submitLabel={isEdit ? 'Save changes' : 'Create article'}
        saving={saving}
        dirty={isDirty}
        blocker={blocker}
        entityLabel="article"
      />
    </form>
  )
}

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
import { Checkbox } from '../../components/form/Checkbox'
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
import { emptyFaq, faqSchema, FAQ_CATEGORY_SUGGESTIONS, type FaqFormValues } from './faqSchema'
import { SelectOrCreate } from '../../components/form/SelectOrCreate'
import { faqHooks, useFaqCategories } from './useFaqs'

export default function FaqFormPage() {
  const { id } = useParams<{ id: string }>()
  const isEdit = Boolean(id)
  const navigate = useNavigate()
  const toast = useToast()

  const existing = faqHooks.useOne(id)
  const create = faqHooks.useCreate()
  const update = faqHooks.useUpdate()
  const categories = useFaqCategories()

  /*
   * The categories in use, or the starter names when nothing has been filed
   * yet — a dropdown with nothing in it on a fresh install would leave an
   * editor with no way forward but "+ New category".
   */
  const inUse = categories.data?.items ?? []
  const categoryOptions = (inUse.length > 0 ? inUse : FAQ_CATEGORY_SUGGESTIONS).map((name) => ({
    value: name,
    label: name,
  }))

  const {
    control,
    register,
    handleSubmit,
    reset,
    setValue,
    setError,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<FaqFormValues>({
    resolver: zodResolver(faqSchema),
    defaultValues: emptyFaq(),
    mode: 'onBlur',
  })

  useEffect(() => {
    if (existing.data) reset(existing.data as FaqFormValues)
  }, [existing.data, reset])

  const blocker = useUnsavedChanges(isDirty && !isSubmitting)
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

  async function onSubmit(values: FaqFormValues) {
    try {
      if (isEdit && id) {
        await update.mutateAsync({ id, input: values })
        toast.success('Question updated.')
      } else {
        await create.mutateAsync(values)
        toast.success('Question added.')
      }
      navigate('/faqs')
    } catch (error) {
      if (error instanceof ApiError && error.fieldErrors) {
        for (const [field, message] of Object.entries(error.fieldErrors)) {
          setError(field as keyof FaqFormValues, { message })
        }
        toast.error('Please fix the highlighted fields.')
        return
      }
      toast.error('Could not save this question', {
        description: error instanceof Error ? error.message : 'Please try again.',
      })
    }
  }

  if (isEdit && existing.isLoading) {
    return (
      <div className="flex items-center gap-2 p-8 text-sm text-slate-500">
        <Spinner />
        Loading question…
      </div>
    )
  }

  if (isEdit && existing.error) {
    return (
      <Alert tone="error" title="Could not load this question">
        <p>{(existing.error as Error).message}</p>
        <Link to="/faqs" className="mt-3 inline-block">
          <Button variant="secondary" size="sm">
            Back to FAQ
          </Button>
        </Link>
      </Alert>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pb-24">
      <PageHeader
        title={isEdit ? 'Edit Question' : 'Add Question'}
        breadcrumb={[{ label: 'FAQ', to: '/faqs' }, { label: isEdit ? 'Edit' : 'New' }]}
      />

      <AppearsOn module="faqs" record={watched} saved={isEdit} />

      {Object.keys(errors).length > 0 && (
        <Alert tone="error" title="This question could not be saved">
          Check the highlighted fields below and try again.
        </Alert>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card flush>
            <CardHeader title="Question and answer" />
            <CardBody className="space-y-5">
              <FormField label="Question" required error={errors.question?.message}>
                <Input
                  {...register('question')}
                  placeholder="e.g. Do you offer placement assistance?"
                />
              </FormField>

              <FormField
                label="Answer"
                required
                description="Plain text. Keep it to what someone needs on the phone."
                error={errors.answer?.message}
              >
                <Textarea {...register('answer')} rows={6} />
              </FormField>
            </CardBody>
          </Card>
        </div>

        <div className="space-y-6">
          <Card flush>
            <CardHeader title="Placement" />
            <CardBody className="space-y-5">
              <FormField label="Status">
                <Select {...register('status')} options={STATUS_OPTIONS} />
              </FormField>

              <FormField
                label="Category"
                required
                description="Groups the question on the FAQ page. Pick one, or add a new one."
                error={errors.category?.message}
              >
                {/*
                  The options are the categories questions are actually filed
                  under, not a fixed list — the column is free text so a new
                  section needs no migration, and hard-coding one here would
                  quietly contradict that. The starter names are offered only
                  while nothing has been filed yet, so a fresh install is not
                  an empty dropdown.
                */}
                <Controller
                  control={control}
                  name="category"
                  render={({ field }) => (
                    <SelectOrCreate
                      value={field.value ?? ''}
                      onChange={field.onChange}
                      options={categoryOptions}
                      placeholder="Choose a category"
                      noun="category"
                      invalid={Boolean(errors.category)}
                      // Nothing is written until the FAQ itself is saved, so
                      // there is no row to create here and none to clean up.
                      onCreate={async (name) => name}
                    />
                  )}
                />
              </FormField>

              <FormField
                label="Order"
                description="Lower numbers come first within the category."
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

              <Controller
                control={control}
                name="featured"
                render={({ field }) => (
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    label="Show on the contact page"
                    description="The homepage help centre lists every question. The contact page shows only this short selection."
                  />
                )}
              />
            </CardBody>
          </Card>
        </div>
      </div>

      <FormFooter
        onPublish={publish}
        cancelTo="/faqs"
        submitLabel={isEdit ? 'Save changes' : 'Add question'}
        saving={saving}
        dirty={isDirty}
        blocker={blocker}
        entityLabel="question"
      />
    </form>
  )
}

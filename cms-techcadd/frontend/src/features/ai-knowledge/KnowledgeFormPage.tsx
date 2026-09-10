import { useEffect, useState } from 'react'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { zodResolver } from '@hookform/resolvers/zod'
import { Sparkles } from 'lucide-react'

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
import { SelectOrCreate } from '../../components/form/SelectOrCreate'
import { Textarea } from '../../components/form/Textarea'
import { FormFooter } from '../../components/layout/FormFooter'
import { PageHeader } from '../../components/layout/PageHeader'
import { useToast } from '../../hooks/useToast'
import { useUnsavedChanges } from '../../hooks/useUnsavedChanges'
import { STATUS_OPTIONS } from '../shared/statusOptions'
import {
  emptyKnowledge,
  KNOWLEDGE_CATEGORY_SUGGESTIONS,
  knowledgeSchema,
  type KnowledgeFormValues,
} from './knowledgeSchema'
import { knowledgeHooks, useKnowledgeCategories, useKnowledgeTry } from './useAiKnowledge'

export default function KnowledgeFormPage() {
  const { id } = useParams<{ id: string }>()
  const isEdit = Boolean(id)
  const navigate = useNavigate()
  const toast = useToast()

  const existing = knowledgeHooks.useOne(id)
  const create = knowledgeHooks.useCreate()
  const update = knowledgeHooks.useUpdate()
  const categories = useKnowledgeCategories()

  const {
    control,
    register,
    handleSubmit,
    reset,
    setValue,
    setError,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<KnowledgeFormValues>({
    resolver: zodResolver(knowledgeSchema),
    defaultValues: emptyKnowledge(),
    mode: 'onBlur',
  })

  useEffect(() => {
    if (existing.data) reset(existing.data as KnowledgeFormValues)
  }, [existing.data, reset])

  const blocker = useUnsavedChanges(isDirty && !isSubmitting)
  const saving = create.isPending || update.isPending
  const watched = useWatch({ control }) as Record<string, unknown>

  const inUse = categories.data?.items ?? []
  const categoryOptions = (inUse.length > 0 ? inUse : KNOWLEDGE_CATEGORY_SUGGESTIONS).map(
    (name) => ({ value: name, label: name }),
  )

  /*
   * The retrieval check.
   *
   * Its own box rather than the question field, because the point is to type
   * what a *visitor* would say, not what the entry says. The failure this
   * module is most prone to is an answer nobody's phrasing ever reaches, and it
   * is invisible until someone asks.
   */
  const [trial, setTrial] = useState('')
  const trialResult = useKnowledgeTry(trial)

  const publish =
    watched.status === 'published'
      ? undefined
      : () => {
          setValue('status', 'published', { shouldDirty: true })
          void handleSubmit(onSubmit)()
        }

  async function onSubmit(values: KnowledgeFormValues) {
    // Empty rather than absent: the field is optional to fill in and always
    // present on the record, so clearing it stores a blank instead of leaving
    // the previous alternates in place.
    const payload = { ...values, keywords: values.keywords ?? '' }

    try {
      if (isEdit && id) {
        await update.mutateAsync({ id, input: payload })
        toast.success('Entry updated.')
      } else {
        await create.mutateAsync(payload)
        toast.success('Entry added.')
      }
      navigate('/ai-knowledge')
    } catch (error) {
      if (error instanceof ApiError && error.fieldErrors) {
        for (const [field, message] of Object.entries(error.fieldErrors)) {
          setError(field as keyof KnowledgeFormValues, { message })
        }
        toast.error('Please fix the highlighted fields.')
        return
      }
      toast.error('Could not save this entry', {
        description: error instanceof Error ? error.message : 'Please try again.',
      })
    }
  }

  if (isEdit && existing.isLoading) {
    return (
      <div className="flex items-center gap-2 p-8 text-sm text-slate-500">
        <Spinner />
        Loading entry…
      </div>
    )
  }

  if (isEdit && existing.error) {
    return (
      <Alert tone="error" title="Could not load this entry">
        <p>{(existing.error as Error).message}</p>
        <Link to="/ai-knowledge" className="mt-3 inline-block">
          <Button variant="secondary" size="sm">
            Back to the knowledge base
          </Button>
        </Link>
      </Alert>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pb-24">
      <PageHeader
        title={isEdit ? 'Edit Entry' : 'Add Entry'}
        breadcrumb={[
          { label: 'AI Knowledge', to: '/ai-knowledge' },
          { label: isEdit ? 'Edit' : 'New' },
        ]}
      />

      <AppearsOn module="ai-knowledge" record={watched} saved={isEdit} />

      {Object.keys(errors).length > 0 && (
        <Alert tone="error" title="This entry could not be saved">
          Check the highlighted fields below and try again.
        </Alert>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card flush>
            <CardHeader title="The answer" />
            <CardBody className="space-y-5">
              <FormField label="Question" required error={errors.question?.message}>
                <Input
                  {...register('question')}
                  placeholder="e.g. What does the AI course cost?"
                />
              </FormField>

              <FormField
                label="Answer"
                required
                description="Written to be read aloud by a chatbot — short, plain, and complete on its own."
                error={errors.answer?.message}
              >
                <Textarea {...register('answer')} rows={6} />
              </FormField>

              <FormField
                label="Also matches"
                description="Other ways people ask this, separated by commas. This is what decides whether the entry is ever found."
                error={errors.keywords?.message}
              >
                <Input {...register('keywords')} placeholder="fees, price, how much, charges" />
              </FormField>
            </CardBody>
          </Card>

          <Card flush>
            <CardHeader
              title="Try it"
              subtitle="Type what a visitor would ask and see which entry comes back."
            />
            <CardBody className="space-y-4">
              <Input
                value={trial}
                onChange={(event) => setTrial(event.target.value)}
                placeholder="e.g. how much does it cost"
                aria-label="Try a visitor question"
              />

              {trial.trim().length > 2 && (
                <div className="space-y-2">
                  {trialResult.isLoading && (
                    <p className="flex items-center gap-2 text-sm text-slate-500">
                      <Spinner />
                      Searching…
                    </p>
                  )}

                  {trialResult.data?.items.length === 0 && (
                    <Alert tone="warning" title="Nothing matched">
                      No published entry answers that. Add the wording to “Also matches” above, or
                      write an entry for it.
                    </Alert>
                  )}

                  {trialResult.data?.items.map((match, index) => (
                    <div
                      key={match.id}
                      className="rounded-lg border border-slate-200 bg-slate-50 p-3"
                    >
                      <p className="flex items-center gap-2 text-sm font-medium text-slate-900">
                        {index === 0 && <Sparkles size={14} className="text-primary-600" />}
                        {match.question}
                        {index === 0 && (
                          <span className="text-xs font-normal text-slate-500">
                            — this is what the visitor would be told
                          </span>
                        )}
                      </p>
                      <p className="mt-1 text-sm text-slate-600">{match.answer}</p>
                    </div>
                  ))}
                </div>
              )}

              {/*
                * An unsaved entry cannot be found by this, because the search
                * runs against what is stored. Saying so beats an editor
                * concluding their wording is wrong when it simply is not there
                * yet.
                */}
              {isDirty && (
                <p className="text-xs text-slate-500">
                  Unsaved changes are not searched — save first to try them.
                </p>
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
                label="Group"
                description="Only for organising this list. Visitors never see it."
                error={errors.category?.message}
              >
                <Controller
                  control={control}
                  name="category"
                  render={({ field }) => (
                    <SelectOrCreate
                      value={field.value ?? ''}
                      onChange={field.onChange}
                      options={categoryOptions}
                      placeholder="Choose a group"
                      noun="group"
                      invalid={Boolean(errors.category)}
                      // Groups are free text on the record, so nothing is
                      // written until the entry itself is saved.
                      onCreate={async (name) => name}
                    />
                  )}
                />
              </FormField>

              <FormField
                label="Order"
                description="Used only to break a tie between equally good matches."
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
        cancelTo="/ai-knowledge"
        submitLabel={isEdit ? 'Save changes' : 'Add entry'}
        saving={saving}
        dirty={isDirty}
        blocker={blocker}
        entityLabel="entry"
      />
    </form>
  )
}

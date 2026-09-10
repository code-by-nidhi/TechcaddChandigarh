import { useMemo, useState } from 'react'
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  MoreHorizontal,
  Plus,
  Search,
  Trash2,
} from 'lucide-react'

import { ApiError, type ListParams } from '../../api'
import { Badge } from '../../components/common/Badge'
import { Button } from '../../components/common/Button'
import { Card, CardBody, CardHeader } from '../../components/common/Card'
import { DropdownItem, DropdownMenu } from '../../components/common/DropdownMenu'
import { Modal } from '../../components/common/Modal'
import { DataTable, type Column } from '../../components/data/DataTable'
import { TabPanel, Tabs } from '../../components/data/Tabs'
import { EmptyState } from '../../components/common/EmptyState'
import { Alert } from '../../components/feedback/Alert'
import { Spinner } from '../../components/feedback/Spinner'
import { Checkbox } from '../../components/form/Checkbox'
import { FormField } from '../../components/form/FormField'
import { Input } from '../../components/form/Input'
import { NumberInput } from '../../components/form/NumberInput'
import { Select } from '../../components/form/Select'
import { Switch } from '../../components/form/Switch'
import { Textarea } from '../../components/form/Textarea'
import { ViewOnSiteButton } from '../../components/common/ViewOnSite'
import { PageHeader } from '../../components/layout/PageHeader'
import { useConfirm } from '../../hooks/useConfirm'
import { useToast } from '../../hooks/useToast'
import type { Redirect, SeoMeta, SitemapSection } from '../../types'
import {
  redirectHooks,
  seoMetaHooks,
  useSaveSitemap,
  useSeoAudit,
  useSitemapSettings,
} from './useSeo'

/**
 * Four related jobs on one screen.
 *
 * Redirects, per-route meta, sitemap settings and the audit are separate data
 * but one task — "the site's relationship with search engines" — and an editor
 * fixing something the audit reports lands in one of the other three tabs to do
 * it. Four sidebar entries would scatter that.
 */

const TABS = [
  { value: 'audit', label: 'Audit' },
  { value: 'meta', label: 'Page meta' },
  { value: 'redirects', label: 'Redirects' },
  { value: 'sitemap', label: 'Sitemap & robots' },
]

const ALL: ListParams = { page: 1, pageSize: 200, filters: {} }

export default function SeoPage() {
  // Opens on the audit: it is the only tab that says what needs attention, and
  // the other three are where you go once you know.
  const [tab, setTab] = useState('audit')

  return (
    <div className="space-y-6">
      <PageHeader
        title="SEO"
        description="What search engines see, and where old links go"
        actions={<ViewOnSiteButton module="seo" />}
      />

      <Card flush>
        <Tabs value={tab} onValueChange={setTab} items={TABS}>
          <TabPanel value="audit">
            <AuditTab />
          </TabPanel>
          <TabPanel value="meta">
            <MetaTab />
          </TabPanel>
          <TabPanel value="redirects">
            <RedirectsTab />
          </TabPanel>
          <TabPanel value="sitemap">
            <SitemapTab />
          </TabPanel>
        </Tabs>
      </Card>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Audit                                                               */
/* ------------------------------------------------------------------ */

function AuditTab() {
  const query = useSeoAudit()

  if (query.isLoading) {
    return (
      <div className="flex items-center gap-2 p-8 text-sm text-slate-500">
        <Spinner />
        Checking the site…
      </div>
    )
  }

  if (query.error) {
    return (
      <div className="p-5">
        <Alert tone="error" title="Could not run the audit">
          {(query.error as Error).message}
        </Alert>
      </div>
    )
  }

  const items = query.data?.items ?? []

  if (items.length === 0) {
    return (
      <EmptyState
        icon={CheckCircle2}
        title="Nothing to fix"
        description="Every published page has a title and a description, and no redirect is shadowing a live page."
      />
    )
  }

  // Errors first: one of them is a page nobody can reach, which outranks any
  // number of missing descriptions.
  const sorted = [...items].sort((a, b) =>
    a.severity === b.severity ? 0 : a.severity === 'error' ? -1 : 1,
  )

  return (
    <div className="space-y-4 p-5">
      <div className="flex flex-wrap gap-3">
        {(query.data?.errors ?? 0) > 0 && (
          <Badge tone="danger">{query.data?.errors} needing attention</Badge>
        )}
        <Badge tone="warning">{query.data?.warnings} worth improving</Badge>
      </div>

      <ul className="divide-y divide-slate-100">
        {sorted.map((issue) => (
          <li key={`${issue.module}-${issue.id}-${issue.problem}`} className="flex gap-3 py-3">
            <AlertTriangle
              size={16}
              className={
                issue.severity === 'error' ? 'mt-0.5 text-red-500' : 'mt-0.5 text-amber-500'
              }
            />
            <div className="min-w-0">
              <p className="text-sm font-medium text-slate-900">{issue.label}</p>
              <p className="text-sm text-slate-600">{issue.problem}</p>
              <p className="mt-0.5 text-xs text-slate-400">{issue.module}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Page meta                                                           */
/* ------------------------------------------------------------------ */

const EMPTY_META = {
  route: '',
  metaTitle: '',
  metaDescription: '',
  canonicalUrl: '',
  noindex: false,
}

function MetaTab() {
  const toast = useToast()
  const confirm = useConfirm()

  const query = seoMetaHooks.useList(ALL)
  const create = seoMetaHooks.useCreate()
  const remove = seoMetaHooks.useRemove()

  const [editing, setEditing] = useState<SeoMeta | 'new' | null>(null)
  const [draft, setDraft] = useState(EMPTY_META)

  /**
   * Opens the editor with the row's values already in it.
   *
   * Both pieces of state are set here rather than the draft being synced from
   * `editing` in an effect — an effect would render once with the previous
   * row's values still on screen before correcting itself.
   */
  function openEditor(target: SeoMeta | 'new') {
    setEditing(target)
    setDraft(
      target === 'new'
        ? EMPTY_META
        : {
            route: target.route,
            metaTitle: target.metaTitle,
            metaDescription: target.metaDescription,
            canonicalUrl: target.canonicalUrl,
            noindex: target.noindex,
          },
    )
  }

  const rows = useMemo(() => query.data?.items ?? [], [query.data])

  async function save() {
    try {
      // An upsert either way — a route has at most one override, so editing an
      // existing one and adding a new one are the same request.
      await create.mutateAsync(draft)
      setEditing(null)
      toast.success('Saved.')
    } catch (error) {
      toast.error('Could not save', {
        description: error instanceof ApiError ? error.message : 'Please try again.',
      })
    }
  }

  const columns: Column<SeoMeta>[] = [
    {
      id: 'route',
      header: 'Route',
      cell: (meta) => (
        <span className="flex items-center gap-2 font-medium text-slate-900">
          {meta.route}
          {meta.noindex && <Badge tone="warning">noindex</Badge>}
        </span>
      ),
    },
    {
      id: 'title',
      header: 'Title',
      cell: (meta) => (
        <span className="block max-w-[18rem] truncate text-sm text-slate-600">
          {meta.metaTitle || <span className="text-slate-400">—</span>}
        </span>
      ),
    },
    {
      id: 'description',
      header: 'Description',
      cell: (meta) => (
        <span className="block max-w-[22rem] truncate text-sm text-slate-600">
          {meta.metaDescription || <span className="text-slate-400">—</span>}
        </span>
      ),
    },
  ]

  return (
    <div className="space-y-4 p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-slate-600">
          Overrides what search engines read for one route. Anything left blank keeps whatever the
          page already produces.
        </p>
        <Button size="sm" icon={Plus} onClick={() => openEditor('new')}>
          Add override
        </Button>
      </div>

      <DataTable
        rows={rows}
        columns={columns}
        getRowId={(meta) => meta.id}
        caption="Per-route meta overrides"
        loading={query.isLoading}
        error={query.error as Error | null}
        onRetry={() => query.refetch()}
        onRowClick={(meta) => openEditor(meta)}
        emptyIcon={Search}
        emptyTitle="No overrides"
        emptyDescription="Pages use the title and description they generate themselves until you override one here."
        rowActions={(meta) => (
          <DropdownMenu
            trigger={
              <Button variant="ghost" size="sm" aria-label={`Actions for ${meta.route}`}>
                <MoreHorizontal size={16} />
              </Button>
            }
          >
            <DropdownItem
              icon={Trash2}
              tone="danger"
              onSelect={async () => {
                const ok = await confirm({
                  title: `Remove the override for ${meta.route}?`,
                  description: 'The page goes back to the title and description it generates.',
                  confirmLabel: 'Remove',
                })
                if (ok) await remove.mutateAsync([meta.id])
              }}
            >
              Remove
            </DropdownItem>
          </DropdownMenu>
        )}
      />

      <Modal
        open={editing !== null}
        onOpenChange={(open) => !open && setEditing(null)}
        title={editing === 'new' ? 'Add override' : 'Edit override'}
        description="Leave a field blank to keep what the page already produces."
      >
        <div className="space-y-5">
          <FormField
            label="Route"
            required
            description="The site path, e.g. /courses or /blogs/mern-vs-mean."
          >
            <Input
              value={draft.route}
              onChange={(event) => setDraft({ ...draft, route: event.target.value })}
              placeholder="/courses"
              // Changing which route an override belongs to is really a new
              // override; editing it in place would silently move the old one.
              disabled={editing !== 'new'}
            />
          </FormField>

          <FormField
            label="Meta title"
            description={`${draft.metaTitle.length}/60 — Google truncates beyond this.`}
          >
            <Input
              value={draft.metaTitle}
              onChange={(event) => setDraft({ ...draft, metaTitle: event.target.value })}
              invalid={draft.metaTitle.length > 60}
            />
          </FormField>

          <FormField
            label="Meta description"
            description={`${draft.metaDescription.length}/160 — Google truncates beyond this.`}
          >
            <Textarea
              rows={3}
              value={draft.metaDescription}
              onChange={(event) => setDraft({ ...draft, metaDescription: event.target.value })}
              invalid={draft.metaDescription.length > 160}
            />
          </FormField>

          <FormField
            label="Canonical URL"
            description="Only when this page duplicates another. Leave blank otherwise."
          >
            <Input
              value={draft.canonicalUrl}
              onChange={(event) => setDraft({ ...draft, canonicalUrl: event.target.value })}
              placeholder="https://techcaddchandigarh.com/…"
            />
          </FormField>

          <Switch
            checked={draft.noindex}
            onCheckedChange={(checked) => setDraft({ ...draft, noindex: checked })}
            label="Keep out of search results"
            description="The page stays published and reachable — search engines are asked not to list it."
          />

          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setEditing(null)}>
              Cancel
            </Button>
            <Button onClick={() => void save()} disabled={!draft.route || create.isPending}>
              Save
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Redirects                                                           */
/* ------------------------------------------------------------------ */

const EMPTY_REDIRECT = { from: '', to: '', statusCode: 301 as 301 | 302, active: true, note: '' }

function RedirectsTab() {
  const toast = useToast()
  const confirm = useConfirm()

  const query = redirectHooks.useList(ALL)
  const create = redirectHooks.useCreate()
  const update = redirectHooks.useUpdate()
  const remove = redirectHooks.useRemove()

  const [adding, setAdding] = useState(false)
  const [draft, setDraft] = useState(EMPTY_REDIRECT)

  const rows = useMemo(() => query.data?.items ?? [], [query.data])

  async function save() {
    try {
      await create.mutateAsync(draft)
      closeAdding()
      toast.success('Redirect added.')
    } catch (error) {
      toast.error('Could not add this redirect', {
        description: error instanceof ApiError ? error.message : 'Please try again.',
      })
    }
  }

  function closeAdding() {
    setAdding(false)
    setDraft(EMPTY_REDIRECT)
  }

  const columns: Column<Redirect>[] = [
    {
      id: 'rule',
      header: 'Rule',
      cell: (redirect) => (
        <span className="flex min-w-0 items-center gap-2 text-sm">
          <span className="truncate font-medium text-slate-900">{redirect.from}</span>
          <ArrowRight size={14} className="shrink-0 text-slate-400" />
          <span className="truncate text-slate-600">{redirect.to}</span>
        </span>
      ),
    },
    {
      id: 'type',
      header: 'Type',
      cell: (redirect) => (
        <Badge tone={redirect.statusCode === 301 ? 'primary' : 'neutral'}>
          {redirect.statusCode === 301 ? '301 permanent' : '302 temporary'}
        </Badge>
      ),
    },
    {
      id: 'hits',
      header: 'Followed',
      /*
       * The reason the hit counter exists: a rule nobody has followed in a year
       * is one you can retire, and without a count there is no way to know
       * which those are.
       */
      cell: (redirect) => (
        <span className="whitespace-nowrap text-sm text-slate-600">
          {redirect.hits}
          {redirect.hits === 0 && <span className="ml-2 text-xs text-slate-400">never</span>}
        </span>
      ),
    },
    {
      id: 'active',
      header: 'Active',
      cell: (redirect) => (
        <Checkbox
          checked={redirect.active}
          onCheckedChange={(checked) =>
            update.mutateAsync({ id: redirect.id, input: { active: Boolean(checked) } })
          }
          aria-label={`${redirect.active ? 'Disable' : 'Enable'} the redirect from ${redirect.from}`}
        />
      ),
    },
  ]

  return (
    <div className="space-y-4 p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-slate-600">
          Sends an old address to its new one, so a renamed page keeps its traffic and its ranking.
        </p>
        <Button size="sm" icon={Plus} onClick={() => setAdding(true)}>
          Add redirect
        </Button>
      </div>

      <DataTable
        rows={rows}
        columns={columns}
        getRowId={(redirect) => redirect.id}
        caption="Redirect rules with how often each has been followed"
        loading={query.isLoading}
        error={query.error as Error | null}
        onRetry={() => query.refetch()}
        emptyIcon={ArrowRight}
        emptyTitle="No redirects"
        emptyDescription="Add one when you rename or remove a page, so its old address still works."
        rowActions={(redirect) => (
          <DropdownMenu
            trigger={
              <Button variant="ghost" size="sm" aria-label={`Actions for ${redirect.from}`}>
                <MoreHorizontal size={16} />
              </Button>
            }
          >
            <DropdownItem
              icon={Trash2}
              tone="danger"
              onSelect={async () => {
                const ok = await confirm({
                  title: `Delete the redirect from ${redirect.from}?`,
                  description: 'That address will start returning "not found" again.',
                  confirmLabel: 'Delete',
                })
                if (ok) await remove.mutateAsync([redirect.id])
              }}
            >
              Delete
            </DropdownItem>
          </DropdownMenu>
        )}
      />

      <Modal
        open={adding}
        onOpenChange={(open) => !open && closeAdding()}
        title="Add redirect"
        description="Both paths are relative to the site, e.g. /old-page."
      >
        <div className="space-y-5">
          <FormField label="From" required description="The address that should no longer be used.">
            <Input
              value={draft.from}
              onChange={(event) => setDraft({ ...draft, from: event.target.value })}
              placeholder="/old-python-course"
            />
          </FormField>

          <FormField label="To" required description="Where it should go instead.">
            <Input
              value={draft.to}
              onChange={(event) => setDraft({ ...draft, to: event.target.value })}
              placeholder="/python-course-in-chandigarh"
            />
          </FormField>

          <FormField
            label="Type"
            description="Permanent moves the page's ranking to the new address. Use temporary only if the old address will come back."
          >
            <Select
              value={String(draft.statusCode)}
              onChange={(event) =>
                setDraft({ ...draft, statusCode: Number(event.target.value) as 301 | 302 })
              }
              options={[
                { value: '301', label: '301 — permanent' },
                { value: '302', label: '302 — temporary' },
              ]}
            />
          </FormField>

          <FormField label="Note" description="Optional. Why this rule exists.">
            <Input
              value={draft.note}
              onChange={(event) => setDraft({ ...draft, note: event.target.value })}
              placeholder="Renamed during the 2026 course refresh"
            />
          </FormField>

          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={closeAdding}>
              Cancel
            </Button>
            <Button
              onClick={() => void save()}
              disabled={!draft.from || !draft.to || create.isPending}
            >
              Add
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Sitemap                                                             */
/* ------------------------------------------------------------------ */

const FREQUENCIES = ['always', 'hourly', 'daily', 'weekly', 'monthly', 'yearly', 'never'].map(
  (value) => ({ value, label: value }),
)

/** The keys the API returns, in words an editor recognises. */
const SECTION_LABELS: Record<string, string> = {
  home: 'Homepage',
  courses: 'Course pages',
  programs: 'Programs & training formats',
  blogs: 'Blog posts',
  events: 'Events',
  branches: 'Branch pages',
  serviceAreas: 'Local area pages',
  pages: 'Editor-authored pages',
  tools: 'Free tools',
  legal: 'Policies & legal',
}

function SitemapTab() {
  const toast = useToast()
  const query = useSitemapSettings()
  const save = useSaveSitemap()

  /*
   * Unsaved edits, keyed by section, layered over what the server returned.
   *
   * An overlay rather than a copy of the whole list: copying it would mean
   * syncing from an effect, which renders the stale list first, and a section
   * added to the site since the page loaded would be silently dropped on save
   * because the copy predates it.
   */
  const [edits, setEdits] = useState<Record<string, Partial<SitemapSection>>>({})

  const sections: SitemapSection[] = (query.data?.sections ?? []).map((section) => ({
    ...section,
    ...edits[section.key],
  }))

  function patch(key: string, changes: Partial<SitemapSection>) {
    setEdits((previous) => ({ ...previous, [key]: { ...previous[key], ...changes } }))
  }

  if (query.isLoading) {
    return (
      <div className="flex items-center gap-2 p-8 text-sm text-slate-500">
        <Spinner />
        Loading…
      </div>
    )
  }

  return (
    <div className="space-y-5 p-5">
      <Card flush>
        <CardHeader
          title="What goes in sitemap.xml"
          subtitle="Priority and frequency are hints. Search engines are free to ignore both — inclusion is the part that matters."
        />
        <CardBody className="space-y-3">
          {sections.map((section) => (
            <div
              key={section.key}
              className="flex flex-wrap items-center gap-4 rounded-lg border border-slate-200 p-3"
            >
              <div className="min-w-[14rem] flex-1">
                <Checkbox
                  checked={section.include}
                  onCheckedChange={(checked) =>
                    patch(section.key, { include: Boolean(checked) })
                  }
                  label={SECTION_LABELS[section.key] ?? section.key}
                />
              </div>

              <div className="w-28">
                <NumberInput
                  value={section.priority}
                  onChange={(value) =>
                    patch(section.key, { priority: value === '' ? 0 : Number(value) })
                  }
                  min={0}
                  max={1}
                  step={0.1}
                  aria-label={`Priority for ${section.key}`}
                  disabled={!section.include}
                />
              </div>

              <div className="w-36">
                <Select
                  value={section.changeFrequency}
                  onChange={(event) =>
                    patch(section.key, {
                      changeFrequency: event.target.value as SitemapSection['changeFrequency'],
                    })
                  }
                  options={FREQUENCIES}
                  aria-label={`Change frequency for ${section.key}`}
                  disabled={!section.include}
                />
              </div>
            </div>
          ))}

          <div className="flex justify-end">
            <Button
              onClick={() =>
                save
                  .mutateAsync(sections)
                  .then(() => {
                    // Cleared so the freshly saved server state is what renders,
                    // rather than an overlay that now says the same thing.
                    setEdits({})
                    toast.success('Sitemap settings saved.')
                  })
                  .catch(() => toast.error('Could not save'))
              }
              disabled={save.isPending}
            >
              Save
            </Button>
          </div>
        </CardBody>
      </Card>

      <Alert tone="info" title="robots.txt">
        Still edited under Settings → General. It is served to search engines exactly as written
        there.
      </Alert>
    </div>
  )
}

import { useState } from 'react'
import { TrendingUp } from 'lucide-react'

import { Badge } from '../../components/common/Badge'
import { Card, CardBody, CardHeader } from '../../components/common/Card'
import { EmptyState } from '../../components/common/EmptyState'
import { Alert } from '../../components/feedback/Alert'
import { Spinner } from '../../components/feedback/Spinner'
import { Select } from '../../components/form/Select'
import { PageHeader } from '../../components/layout/PageHeader'
import { useContributions } from './useContributions'

/**
 * Who did what, over a window.
 *
 * Derived from the activity log rather than counted from each module's rows,
 * for one reason: a row tells you who last touched it, not who wrote it or how
 * many times it was revised. The log is the only place that knows.
 *
 * Sign-ins are excluded from every figure here. Counting them would put
 * whoever opens the CMS most often at the top of a table about contribution.
 */

const WINDOW_OPTIONS = [
  { value: '7', label: 'Last 7 days' },
  { value: '30', label: 'Last 30 days' },
  { value: '90', label: 'Last 90 days' },
  { value: '365', label: 'Last year' },
]

function Stat({ label, value, tone }: { label: string; value: number; tone?: string }) {
  return (
    <div>
      <p className={`font-display text-xl font-bold ${tone ?? 'text-slate-900'}`}>{value}</p>
      <p className="text-xs text-slate-500">{label}</p>
    </div>
  )
}

export default function ContributionsPage() {
  const [days, setDays] = useState('30')
  const query = useContributions(Number(days))

  const items = query.data?.items ?? []
  // The busiest person sets the scale, so the bars compare people with each
  // other rather than against a number nobody chose.
  const busiest = Math.max(1, ...items.map((item) => item.total))

  return (
    <div className="space-y-6">
      <PageHeader
        title="Team Contributions"
        description="What each person has worked on, from the activity log"
        actions={
          <div className="w-44">
            <Select
              value={days}
              onChange={(event) => setDays(event.target.value)}
              options={WINDOW_OPTIONS}
              aria-label="Time period"
            />
          </div>
        }
      />

      {query.isLoading && (
        <div className="flex items-center gap-2 p-8 text-sm text-slate-500">
          <Spinner />
          Loading…
        </div>
      )}

      {query.error && (
        <Alert tone="error" title="Could not load contributions">
          {(query.error as Error).message}
        </Alert>
      )}

      {!query.isLoading && !query.error && items.length === 0 && (
        <Card>
          <EmptyState
            icon={TrendingUp}
            title="No activity in this period"
            description="Work done in the CMS is counted here. Try a longer period, or check back once there have been some changes."
          />
        </Card>
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        {items.map((person) => (
          <Card key={person.userName} flush>
            <CardHeader
              title={person.userName}
              subtitle={
                person.lastActive
                  ? `Last active ${new Date(person.lastActive).toLocaleDateString()}`
                  : undefined
              }
              action={<Badge tone="primary">{person.total} actions</Badge>}
            />
            <CardBody className="space-y-5">
              <div className="grid grid-cols-4 gap-3">
                <Stat label="Created" value={person.created} tone="text-emerald-600" />
                <Stat label="Updated" value={person.updated} tone="text-primary-600" />
                <Stat label="Published" value={person.published} tone="text-emerald-600" />
                <Stat label="Deleted" value={person.deleted} tone="text-red-600" />
              </div>

              <div>
                <span
                  className="block h-2 overflow-hidden rounded-full bg-slate-100"
                  role="img"
                  aria-label={`${person.total} of ${busiest} actions by the busiest person`}
                >
                  <span
                    className="block h-full rounded-full bg-primary-500"
                    style={{ width: `${(person.total / busiest) * 100}%` }}
                  />
                </span>
              </div>

              {person.byModule.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-slate-500">Where</p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {person.byModule.slice(0, 8).map((module) => (
                      <Badge key={module.entityType} tone="neutral">
                        {module.entityType} · {module.count}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardBody>
          </Card>
        ))}
      </div>

      {items.length > 0 && (
        <p className="text-xs text-slate-500">
          Counted from the activity log, which began recording when the log was added — work done
          before then is not included.
        </p>
      )}
    </div>
  )
}

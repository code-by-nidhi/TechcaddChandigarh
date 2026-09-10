import { List } from 'lucide-react'

import { Alert } from '../feedback/Alert'
import type { PageBlock } from './blockSchema'
import { headingsOf, MIN_HEADINGS_FOR_INDEX } from './headingsOf'

/**
 * Shows the "On this page" index the content will produce.
 *
 * The website builds that index from the headings in the content, and nothing
 * in this form said so — an editor writing a page with no headings got no
 * index and no explanation, which reads as the feature being broken rather
 * than as "add a heading".
 *
 * A live list rather than a sentence of instructions: seeing the index form as
 * you type is what makes the connection, and it doubles as a check that the
 * page has a sensible structure before anyone publishes it.
 */

export function HeadingIndexHint({ blocks }: { blocks: PageBlock[] }) {
  const headings = headingsOf(blocks)

  if (headings.length < MIN_HEADINGS_FOR_INDEX) {
    return (
      <Alert tone="info" title="No “On this page” index yet">
        The website builds a contents list from the headings in this content. Add a heading to a
        text block — or an <strong>H2</strong> inside one — and it appears here and on the page.
        Two or more are needed before the list is worth showing.
      </Alert>
    )
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
      <p className="flex items-center gap-2 text-xs font-medium text-slate-900">
        <List size={14} aria-hidden="true" />
        “On this page” index, as visitors will see it
      </p>
      <ol className="mt-2 space-y-1">
        {headings.map((heading, index) => (
          <li key={`${heading}-${index}`} className="truncate text-xs text-slate-600">
            {heading}
          </li>
        ))}
      </ol>
    </div>
  )
}

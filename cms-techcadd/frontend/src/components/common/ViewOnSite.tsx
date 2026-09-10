import { ExternalLink } from 'lucide-react'

import { SITE_MAP } from '../../config/siteMap'
import { DropdownItem } from './DropdownMenu'
import { Button } from './Button'
import { Tooltip } from './Tooltip'

/**
 * "View on site" — the shortest path from a record to the thing it produces.
 *
 * Editing content you cannot see is how a CMS drifts from the site it drives:
 * you change a heading, save, and take on faith that it landed. These open the
 * real page in a new tab, so checking costs a click.
 *
 * Two forms, because lists and records answer different questions. The header
 * button opens the page the module renders on — the review wall, the FAQ page,
 * the calendar. The row action opens the record's own page, and only exists
 * for modules that have one.
 */

/** Where the site is. Read from the same place the "where this appears" note uses. */
function indexUrlFor(module: string): string | undefined {
  return SITE_MAP[module]?.indexUrl
}

/**
 * `object`, not `Record<string, unknown>`: callers pass their own typed record
 * — a `Blog`, an `Event` — and an interface is not assignable to an index
 * signature. The site map reads a couple of known keys off it and copes with
 * anything missing, so the cast is safe and keeps every caller from needing one.
 */
function recordUrlFor(module: string, record: object): string | undefined {
  return SITE_MAP[module]?.url?.(record as Record<string, unknown>)
}

/**
 * The header button on a list page.
 *
 * Renders nothing when the module has no page on the website — the media
 * library and the audit log have nowhere to go, and a disabled button that
 * never becomes enabled is worse than no button.
 */
export function ViewOnSiteButton({ module }: { module: string }) {
  const url = indexUrlFor(module)
  if (!url) return null

  const notLive = SITE_MAP[module]?.notLive

  const button = (
    <a href={url} target="_blank" rel="noopener noreferrer">
      <Button variant="secondary" size="sm" icon={ExternalLink}>
        View on site
      </Button>
    </a>
  )

  /*
   * A module whose API is ready but which the website does not render yet still
   * gets the button — the page it points at is real — with the gap stated on
   * hover. Silently opening a page that will not show the change is the
   * confusion this whole component exists to prevent.
   */
  return notLive ? <Tooltip content={notLive}>{button}</Tooltip> : button
}

/**
 * The row action in a list's overflow menu.
 *
 * Only for a record with an address of its own, and only once it is published:
 * a draft has no page, and offering the link would lead to a 404 that reads as
 * a broken CMS rather than as "not published yet".
 */
export function ViewOnSiteItem({
  module,
  record,
}: {
  module: string
  record: object
}) {
  const url = recordUrlFor(module, record)
  if (!url) return null

  const status = (record as { status?: unknown }).status
  if (status !== undefined && status !== 'published') return null

  return (
    <DropdownItem
      icon={ExternalLink}
      onSelect={() => window.open(url, '_blank', 'noopener,noreferrer')}
    >
      View on site
    </DropdownItem>
  )
}

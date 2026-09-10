import type { ReactNode } from "react";
import { PageHeader } from "@/components/PageHeader";
import { getPageOverride } from "@/lib/cms";

/**
 * A page header an editor can rewrite.
 *
 * Every route in the CMS's overridable list renders this instead of
 * `PageHeader` directly. It looks for an override for that route and merges it
 * over the copy the page passes in, field by field — so a page with no
 * override behaves exactly as it did before this existed, and an editor who
 * fills in only the heading changes only the heading.
 *
 * Merging rather than replacing is the point. An override row always has all
 * three fields; most are blank, and treating a blank as "use this" would wipe
 * the eyebrow off a page whose heading someone wanted to reword.
 *
 * The route name must match an entry in `OVERRIDABLE_ROUTES` in
 * `cms-techcadd/backend/src/modules/pages/pages.schema.ts` — the CMS refuses to
 * save an override for anything else, so a typo here means a header that can
 * never be edited rather than one that breaks.
 */
export async function CmsPageHeader({
  route,
  eyebrow,
  title,
  body,
  breadcrumbs,
  meta,
  children,
}: {
  /** The site path this header belongs to, without a leading slash. */
  route: string;
  eyebrow?: string;
  title: ReactNode;
  body?: ReactNode;
  breadcrumbs?: { label: string; href?: string }[];
  meta?: { label: string; value: string }[];
  children?: ReactNode;
}) {
  const override = await getPageOverride(route);

  return (
    <PageHeader
      breadcrumbs={breadcrumbs}
      meta={meta}
      eyebrow={override?.heroEyebrow || eyebrow}
      title={override?.heroTitle || title}
      body={override?.heroBody || body}
    >
      {children}
    </PageHeader>
  );
}

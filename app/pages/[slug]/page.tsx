import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/PageHeader";
import { CtaSection } from "@/components/sections/Home";
import { Rail, cx } from "@/components/ui";
import { PageBlocks } from "@/components/PageBlocks";
import { TableOfContents, hasIndex } from "@/components/TableOfContents";
import { headingsFromBlocks, withHeadingIds } from "@/lib/headings";
import { getCustomPage, getCustomPages } from "@/lib/cms";
import { site } from "@/data/site";

/**
 * Pages written in the CMS, each at its own address.
 *
 * Deliberately under `/pages/` rather than at the root: the root namespace is
 * already the site's SEO slugs (`/python-course-in-chandigarh`), resolved by
 * `lib/routes.ts` against the course catalogue. An editor-authored page landing
 * there could shadow a course URL, and the collision would only surface as a
 * course page quietly disappearing.
 */

/**
 * A page published after the last build must still resolve, so unknown slugs
 * render on demand. `getCustomPage` returns null for one the CMS does not
 * have, and that is what produces the 404.
 */
export const dynamicParams = true;

export async function generateStaticParams() {
  const pages = await getCustomPages();
  return pages.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = await getCustomPage(slug);
  if (!page) return {};

  return {
    title: page.seo?.metaTitle || page.title,
    description: page.seo?.metaDescription || page.excerpt || undefined,
    alternates: { canonical: `${site.url}/pages/${page.slug}` },
    openGraph: {
      type: "article",
      title: page.seo?.metaTitle || page.title,
      description: page.seo?.metaDescription || page.excerpt || undefined,
      url: `${site.url}/pages/${page.slug}`,
    },
  };
}

export default async function CmsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = await getCustomPage(slug);
  if (!page) notFound();

  /*
   * Headings with ids, so the index can link to them. Computed here so the
   * anchors it lists and the ids in the markup are produced by the same pass —
   * including the suffixes that keep repeated headings unique.
   */
  const fromBlocks = page.blocks.length > 0 ? headingsFromBlocks(page.blocks) : null;
  const fromBody = !fromBlocks && page.body ? withHeadingIds(page.body) : null;
  const headings = fromBlocks?.headings ?? fromBody?.headings ?? [];

  /** Drives both the sidebar and whether the grid reserves a column for it. */
  const showIndex = hasIndex(headings);

  return (
    <>
      <PageHeader
        // Centred to match the reading column below it.
        align="center"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: page.title }]}
        eyebrow={page.heroEyebrow}
        // The heading falls back to the title, so an editor who fills in only
        // the title still gets a banner rather than an empty one.
        title={page.heroTitle || page.title}
        body={page.heroBody || page.excerpt}
      />

      <section className="py-16 lg:py-20">
        {/*
          * Blocks when the page has them, the old single body when it does not.
          * Both are sanitised in `lib/cms.ts`. A page written before the block
          * editor keeps rendering exactly as it did, and starts using blocks
          * the moment an editor adds one.
          */}
        {fromBlocks || fromBody ? (
          <Rail>
            {/*
              * Index on the left, content on the right, the pair centred.
              *
              * `sticky` keeps it in view while the page scrolls past — a
              * contents list that scrolls away stops being navigation after
              * the first screen. Below `lg` it stacks above the content, where
              * it matters most: the narrow screen shows least at once.
              *
              * `TableOfContents` renders nothing when there is too little to
              * index, and the grid column simply collapses.
              */}
            <div className={cx(
                "mx-auto grid gap-10 lg:gap-14",
                // Without an index there is no left column to make room for,
                // so the content keeps the plain centred measure.
                showIndex
                  ? "max-w-5xl lg:grid-cols-[minmax(0,15rem)_minmax(0,1fr)]"
                  : "max-w-3xl",
              )}>
              <TableOfContents
                headings={headings}
                className="lg:sticky lg:top-24 lg:self-start"
              />

              <div className="min-w-0">
                {fromBlocks ? (
                  // `bare`: the Rail above already provides the gutter.
                  <PageBlocks blocks={fromBlocks.blocks} align="left" bare />
                ) : (
                  <div
                    className="cms-prose max-w-3xl"
                    dangerouslySetInnerHTML={{ __html: fromBody!.html }}
                  />
                )}
              </div>
            </div>
          </Rail>
        ) : (
          /*
           * Nothing to show. Said plainly rather than rendering an empty band:
           * a page that looks broken is how "I saved it and nothing happened"
           * starts, and the summary above is often where the copy actually went.
           */
          <Rail>
            <p className="mx-auto max-w-3xl text-center text-muted">
              This page has no content yet.
            </p>
          </Rail>
        )}
      </section>

      <CtaSection />
    </>
  );
}

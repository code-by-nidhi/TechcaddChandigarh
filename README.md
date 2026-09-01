# techcadd Chandigarh

Next.js 15 (App Router) site for the techcadd Chandigarh centre, structured after
[techcaddjalandhar.com](https://techcaddjalandhar.com) and localised to the tricity.

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # 195 pages, all statically prerendered
npm run typecheck
```

## Design system

The palette, typography and layout tokens are lifted from the reference site's compiled
stylesheet and declared once in [app/globals.css](app/globals.css) as a Tailwind v4 `@theme` block.

| Token group | Values |
| --- | --- |
| Brand blue | `--color-brand-50` `#eff6ff` → `--color-brand-900` `#1e3a8a`, primary `--color-brand-600` `#2563eb` |
| Navy / hero | `--color-hero-950` `#060e2b`, `-900` `#0b1a4d`, `-800` `#123285`, `-600` `#1c53d1`, glow `#2f7dff` |
| Panel & ink | `--color-panel` `#0b1030`, `--color-ink` `#2a2c5e`, `--color-logo` `#0c1f6c` |
| Accents | `--color-accent-400` `#22d3ee`, `-500` `#0ea5e9`, glow `#00d4ff`, yellow `#ffd23f` |
| Surfaces | background `#fff`, foreground `#0f172a`, muted `#64748b`, subtle `#f8fafc`, line `#e2e8f0` |
| Type | Inter via `next/font/google`, exposed as `--font-inter` / `--font-display` |
| Rail | `max-width: 1304px`, `1rem` padding, `2rem` from `lg` |

Custom utilities: `hero-surface` (the three-layer navy gradient, byte-identical to the
reference), `panel-surface`, `rail`, `card-hover`, `skeleton` / `skeleton-dark`,
`marquee-track`, `fade-up`.

## Navigation

[components/Header.tsx](components/Header.tsx) has two states, driven by scroll position:

The bar has two states:

- **At the top** — fully transparent over the navy hero: white wordmark, white links, white
  Book Demo pill.
- **Scrolled past 32px** — a **floating glass pill**: `rounded-full`, frosted with
  `backdrop-blur-2xl` `backdrop-saturate-150` over `white/88`, a light border and a hairline
  highlight along the top edge. The wordmark and links turn navy and Book Demo turns brand blue.
  Opening a mega menu forces the same state so the panel reads against the bar.

**The change is a cross-fade with zero layout movement.** The pill is a separate
absolutely-positioned layer whose opacity animates `0 → 1`; the bar keeps one height and the
content never shifts. Everything that changes — opacity, colour, shadow — is paint-only.
Animating height, padding, margin, border-width or `backdrop-filter` on the bar itself, as an
earlier version did, forces layout on every frame and visibly stutters. Verified by sampling
geometry through the transition: height, logo position and nav position are identical in every
frame while opacity ramps smoothly.

The wordmark is two stacked copies — navy, plus a `brightness-0 invert` knock-out — cross-fading
on the same 300ms `ease-in-out` curve as the pill, which avoids the muddy midpoint of animating
`filter` from `none`. Every state-driven transition in the header shares that one duration and
curve so they move as a single change.

The header sits on the **same `rail` as every section**, so the logo lines up exactly with the
hero heading in both states (verified at 1280 / 1440 / 1920). The pill bleeds out past the rail
with negative offsets while the content stays on the rail line.

The scroll listener uses **hysteresis** — solid above 32px, clear below 8px — so creeping across a
single threshold cannot flip the bar back and forth.

## Motion

GSAP with ScrollTrigger, wrapped in four primitives in
[components/motion/Reveal.tsx](components/motion/Reveal.tsx):

| Component | Used for |
| --- | --- |
| `<Reveal>` | Fade-and-rise as a section scrolls in; `stagger` sequences direct children |
| `<HeroReveal>` | Plays on mount for above-the-fold content, stepping through `[data-hero-item]` |
| `<CountUp>` | Counts stat figures up when they enter view, preserving suffixes like `15K+` |
| `<Parallax>` | Scrub-linked drift for decorative layers (the hero grid) |

Every one bails out early when `prefers-reduced-motion: reduce` is set, and each uses
`gsap.context()` so effects are reverted on unmount. Animations run `once`, so scrolling back up
does not replay them.

Because `gsap.from` sets the start state after hydration, the server HTML renders fully visible —
crawlers and no-JS visitors see the content. Verified by walking the whole page in both motion
modes: no element is left stranded below full opacity.

## Hero visual

[components/sections/HeroVisual.tsx](components/sections/HeroVisual.tsx) is a pearlescent torus
framing the technology stack, with two stat cards floating off its edge.

Drawn as SVG rather than shipped as an image so it stays crisp at any size and uses the brand
palette directly. The tech chips live **inside the SVG** so their labels scale with the artwork
instead of drifting out of the opening at small sizes; their row widths are declared rather than
measured, so the server and client lay them out identically. The stat cards are real HTML on top,
so those figures stay selectable text and read from `site.stats`.

Motion (skipped under `prefers-reduced-motion`): the ring rotates slowly, carrying its gradient
round with it so a highlight travels over the surface, and a blurred specular arc counter-rotates.
The chips deliberately stay still — they are content, so they have to remain upright and readable.

## Skeleton loading

`loading.tsx` at 21 route segments, composed from the shapes in
[components/Skeleton.tsx](components/Skeleton.tsx) — `PageHeaderSkeleton` (navy banner),
`SectionHeadingSkeleton`, `CardGridSkeleton`, `RowsSkeleton`, `DetailSkeleton`, `ArticleSkeleton`.
They mirror the real layout so nothing jumps on swap, and use the `skeleton` / `skeleton-dark`
shimmer utilities from `globals.css`.

Note that these rarely appear in production: every route is statically prerendered, so navigation
resolves instantly and there is nothing to suspend on. They show when a payload is genuinely slow
to arrive — confirmed by forcing a suspension, which rendered the correct boundary
(`aria-label="Loading courses"`, 33 placeholder bars).

## Content model

Everything on the site is generated from [data/](data/) — no page hard-codes a course name,
a fee or a URL.

| File | Holds |
| --- | --- |
| [site.ts](data/site.ts) | Name, address, phone, socials, headline stats |
| [courses.ts](data/courses.ts) | 40 courses across 7 tracks, each with syllabus modules, outcomes, careers, tools, fees |
| [programs.ts](data/programs.ts) | Track × duration matrix (60 program pages), 7 industrial-training formats, 14 after-12th tracks |
| [branches.ts](data/branches.ts) | 6 centres and 12 local service areas |
| [content.ts](data/content.ts) | Process steps, differentiators, testimonials, FAQs, technology groups |
| [blog.ts](data/blog.ts) · [events.ts](data/events.ts) · [tools.ts](data/tools.ts) | Articles, campus events, free tools |
| [nav.ts](data/nav.ts) | Header mega menus and footer columns, derived from the above |

Adding a course to `courses.ts` creates its detail page, its catalogue entry, its nav link
and its sitemap row. Adding a track to `programTracks` creates six new program pages.

## Routing

SEO slugs are published flat at the root, as on the reference site, and resolved by
[lib/routes.ts](lib/routes.ts):

```
/python-course-in-chandigarh              course
/artificial-intelligence-training-in-...  training variant (flagship tracks only)
/6-month-data-science-program-in-...      certificate program
/after-12th-6-month-...-program-in-...    after-12th program
/45-days-training-in-chandigarh           industrial training format
/after-12th-python-course-in-chandigarh   after-12th course
```

`resolveSlug` checks the exact-match maps before the suffix patterns, so
`45-days-training-in-chandigarh` is not mistaken for a course training variant.

Section routes: `/courses` `/certificate-programs` `/after-12th-courses` `/about/*`
`/branches/[branch]` `/computer-training-in/[area]` `/blogs/[post]` `/events/[event]`
`/tools/*` `/reviews` `/gallery` `/faq` `/contact` `/placement` `/internship-training`
`/college-partnerships`, plus the four policy pages.

Every route is statically prerendered (`dynamicParams = false` on each dynamic segment).

## Before going live

1. **Contact details** in `data/site.ts` and `data/branches.ts` are placeholders — swap in the
   real Chandigarh addresses, phone numbers and social handles.
2. **Enquiry form** in `components/EnquiryForm.tsx` simulates submission. Point `handleSubmit`
   at the CRM or an API route.
3. **Gallery** in `app/gallery/page.tsx` uses captioned placeholder tiles; drop real photography
   into `public/assets/gallery/` and swap them for `next/image`.
4. **Policy pages** are drafts. Have them reviewed — particularly the refund windows.
5. **Fees** in `data/courses.ts` are illustrative and should be confirmed per batch.
6. **Founder name** in `data/site.ts` (`site.founder`) is taken from the techcadd Jalandhar site —
   confirm it is correct for the Chandigarh entity before publishing.

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

- **At the top** — transparent, 72px tall, white text over the hero.
- **Scrolled past 24px** — a white bar flush to the top edge (`rounded-b-3xl`, 68px tall, inset
  horizontally, with a soft shadow), dark text, and the Book Demo button flips from white to brand
  blue. Opening a menu or the mobile drawer forces the same state.

There is deliberately **no gap above the scrolled bar**. A transparent strip there shows whatever
is scrolling underneath, so the moment a light section passed behind it a white band appeared
across the top of the viewport. The bar is flush at `top: 0` instead, and carries only a bottom
border — side borders would push the logo 1px off the rail.

**The state change animates opacity only.** The white surface is a separate absolutely-positioned
layer that cross-fades `opacity-0 → opacity-100`; the bar keeps one height and the content never
moves. Animating height, margin, padding, border-width and `backdrop-filter` on the bar itself —
as an earlier version did — forces layout on every frame and visibly stutters. The wordmark is two
stacked copies (navy, plus a `brightness-0 invert` knock-out) cross-fading on the same 300ms
`ease-in-out` curve, which avoids the muddy midpoint of animating `filter` from `none`.

The scroll listener uses **hysteresis** — solid above 32px, clear below 8px — so creeping across a
single threshold cannot flip the bar back and forth.

The header sits on the **same `rail` as every section**, so the logo lines up exactly with the
hero heading and every section heading (verified at 1280 / 1440 / 1920). The capsule bleeds out
past the rail with a negative margin and adds back the same amount as padding — bleed and inner
padding are kept equal, which is what preserves that alignment while still letting the pill float
clear of the content column. Capping the bar at the content width is also what keeps the gaps
either side of the nav small (22–40px) instead of absorbing all the leftover space.

The wordmark is the official artwork at [public/assets/logo.png](public/assets/logo.png). It is
navy on transparent, so on the navy header it is knocked out to white with `brightness-0 invert`
rather than shipping a second file — the mark is one flat colour, so the result is exact.

The `AI` item renders as a gradient blue pill with a glow, as on the reference nav.

Mega panels are one wide centred sheet under the bar, in three shapes declared per item in
[data/nav.ts](data/nav.ts):

| `panel.kind` | Used by | Looks like |
| --- | --- | --- |
| `columns` | AI, Courses, After 12th, Resources | Numbered columns with a subtitle, rule and link list |
| `tiles` | Certificate Programs, Branches | 4-across grid of icon cards |
| `cards` | About | Link column, divider, three preview cards |

`columns` and `tiles` close with a quote strip and a CTA link. Below `xl` the whole thing
collapses into an accordion drawer that flattens every panel shape into labelled link groups.
Verified free of horizontal overflow at 320, 360, 768, 1024 and 1280px; Book Demo hides below
380px so the wordmark keeps its room.

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

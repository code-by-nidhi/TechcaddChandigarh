import { randomUUID } from 'node:crypto'

import { execute, pool, query, queryOne, type Row } from './pool.js'

/**
 * Moves the Chandigarh website's built-in events, gallery and testimonials
 * into the CMS.
 *
 * These lived in `data/events.ts` and `data/content.ts` — real, published copy
 * that only a developer could change. This carries it across so the site loses
 * nothing on the day it starts reading these modules from the CMS, and so the
 * new forms open with something in them rather than an empty table.
 *
 * Idempotent: every insert checks for its own row first, so running it twice
 * changes nothing and running it after an editor has been at work does not
 * overwrite them.
 *
 *   npm run db:seed:chd
 */

/* ------------------------------------------------------------------ */
/* Events                                                               */
/* ------------------------------------------------------------------ */

interface SeedEvent {
  title: string
  slug: string
  date: string
  location: string
  type: 'Summit' | 'Workshop' | 'Seminar' | 'Drive'
  excerpt: string
  body: string[]
  agenda: { time: string; item: string }[]
}

const EVENTS: SeedEvent[] = [
  {
    title: 'techcadd AI Summit — Artificial Intelligence & Innovation',
    slug: 'techcadd-ai-summit',
    date: '2026-10-11',
    location: 'Chandigarh campus, Sector 34-A',
    type: 'Summit',
    excerpt:
      'A full day on where applied AI actually stands — live agent demos, a hiring panel, and student project showcases.',
    body: [
      'Our annual AI summit brings together working engineers, hiring managers and students for a day that stays deliberately practical. No keynote slides about the future of everything — demos that run, systems that fail on stage and get debugged, and honest conversation about what companies are actually paying for.',
      'The afternoon hiring panel is the part students consistently rate highest. Four hiring managers review anonymised candidate portfolios in front of the room and say what they would do with each one. It is uncomfortable and extremely useful.',
    ],
    agenda: [
      { time: '09:30', item: 'Registration and campus tour' },
      { time: '10:00', item: 'Opening: what shipped in AI this year that matters' },
      { time: '11:15', item: 'Live build: an agent with tools, memory and evaluation' },
      { time: '13:00', item: 'Lunch and student project showcase' },
      { time: '14:30', item: 'Hiring panel: portfolios reviewed live' },
      { time: '16:00', item: 'Open Q&A and counselling desks' },
    ],
  },
  {
    title: '4-Day App Development Workshop',
    slug: '4-day-app-development-workshop',
    date: '2026-09-22',
    location: 'Chandigarh campus, Lab 3',
    type: 'Workshop',
    excerpt:
      'Build and publish a working Flutter app in four days — from empty project to a store listing.',
    body: [
      'A compressed, hands-on workshop where every participant leaves with an app on their own phone and a build uploaded to the Play Console. Laptops provided if you do not have one.',
      'Open to students of any background. We cover just enough Dart on day one to get moving, then spend the rest of the time building.',
    ],
    agenda: [
      { time: 'Day 1', item: 'Dart essentials and your first Flutter screen' },
      { time: 'Day 2', item: 'Layout, navigation and state' },
      { time: 'Day 3', item: 'Firebase auth and live data' },
      { time: 'Day 4', item: 'Polish, build signing and Play Console upload' },
    ],
  },
]

async function seedEvents(): Promise<number> {
  let added = 0

  for (const event of EVENTS) {
    const existing = await queryOne<Row>('SELECT id FROM events WHERE slug = ? LIMIT 1', [
      event.slug,
    ])
    if (existing) continue

    const id = randomUUID()
    await execute(
      `INSERT INTO events
         (id, title, slug, event_date, location, event_type, excerpt, body,
          featured, status, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'published', NOW(3), NOW(3))`,
      [
        id,
        event.title,
        event.slug,
        event.date,
        event.location,
        event.type,
        event.excerpt,
        // The site's bodies are paragraph arrays; the CMS stores rich text.
        event.body.map((paragraph) => `<p>${paragraph}</p>`).join('\n'),
        event.type === 'Summit' ? 1 : 0,
      ],
    )

    let position = 0
    for (const slot of event.agenda) {
      await execute(
        `INSERT INTO event_agenda (id, event_id, time_label, item, sort_order)
         VALUES (?, ?, ?, ?, ?)`,
        [randomUUID(), id, slot.time, slot.item, position++],
      )
    }

    added += 1
  }

  return added
}

/* ------------------------------------------------------------------ */
/* Gallery                                                              */
/* ------------------------------------------------------------------ */

/**
 * The albums the gallery page already groups its tiles under.
 *
 * Seeded empty of photos on purpose: the site's tiles are captioned
 * placeholders with no image behind them, and inventing media rows would put
 * broken images on a page that currently renders correctly. An editor adds the
 * real photography from the media library.
 */
const ALBUMS = [
  { title: 'Campus', slug: 'campus', category: 'Campus', description: 'Labs, classrooms and the Sector 34-A floor.' },
  { title: 'Classroom', slug: 'classroom', category: 'Classroom', description: 'Sessions, code reviews and doubt-clearing.' },
  { title: 'Events', slug: 'events', category: 'Events', description: 'Summits, workshops and placement drives.' },
  { title: 'Students', slug: 'students', category: 'Students', description: 'Certificates, alumni meets and project showcases.' },
]

async function seedAlbums(): Promise<number> {
  let added = 0
  let order = 0

  for (const album of ALBUMS) {
    const existing = await queryOne<Row>('SELECT id FROM gallery_albums WHERE slug = ? LIMIT 1', [
      album.slug,
    ])
    order += 1
    if (existing) continue

    await execute(
      `INSERT INTO gallery_albums
         (id, title, slug, description, category, sort_order, status, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, 'draft', NOW(3), NOW(3))`,
      [randomUUID(), album.title, album.slug, album.description, album.category, order],
    )
    added += 1
  }

  return added
}

/* ------------------------------------------------------------------ */
/* Testimonials                                                         */
/* ------------------------------------------------------------------ */

/**
 * Carried over from the site's own testimonial list.
 *
 * No `youtube_url` on any of them: there are no videos yet, and a made-up link
 * would put a play button on the site that leads nowhere. They publish as
 * written testimonials, and an editor adds the video to each as it is filmed.
 */
interface SeedTestimonial {
  authorName: string
  role: string
  courseName: string
  quote: string
}

const TESTIMONIALS: SeedTestimonial[] = [
  {
    authorName: 'Harleen Kaur',
    role: 'Frontend Developer, Mohali',
    courseName: 'Full-Stack Development',
    quote:
      'The live projects were the difference. In interviews I could open the repository, walk through the commits and explain why I made each decision. That is what got me the offer.',
  },
  {
    authorName: 'Rohit Sharma',
    role: 'Data Analyst, Chandigarh',
    courseName: 'Data Analytics',
    quote:
      'I came from a commerce background and assumed SQL would be beyond me. The trainers sat with me through every doubt session until it clicked. Six months later I am writing production queries.',
  },
  {
    authorName: 'Ananya Verma',
    role: 'AI Engineer, Zirakpur',
    courseName: 'Artificial Intelligence',
    quote:
      'The generative AI modules were genuinely current. We built a RAG system with evaluations, not a chatbot demo. My interviewer said it was the first candidate project he had seen with tracing set up.',
  },
  {
    authorName: 'Karan Malhotra',
    role: 'DevOps Engineer, Mohali',
    courseName: 'Cloud Computing & DevOps',
    quote:
      'I had been a support engineer for three years and was stuck. The Kubernetes and Terraform modules were what actually moved me — six weeks after finishing I was running deployments instead of tickets.',
  },
]

async function seedTestimonials(): Promise<number> {
  let added = 0
  let order = 0

  for (const testimonial of TESTIMONIALS) {
    order += 1
    const existing = await queryOne<Row>(
      'SELECT id FROM testimonials WHERE author_name = ? AND course_name = ? LIMIT 1',
      [testimonial.authorName, testimonial.courseName],
    )
    if (existing) continue

    await execute(
      `INSERT INTO testimonials
         (id, author_name, role, course_name, quote, rating, featured, sort_order,
          status, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, 5, ?, ?, 'published', NOW(3), NOW(3))`,
      [
        randomUUID(),
        testimonial.authorName,
        testimonial.role,
        testimonial.courseName,
        testimonial.quote,
        order <= 2 ? 1 : 0,
        order,
      ],
    )
    added += 1
  }

  return added
}

/* ------------------------------------------------------------------ */
/* Pages                                                                */
/* ------------------------------------------------------------------ */

/**
 * One worked example of each kind, so the module is not an empty table an
 * editor has to guess the shape of. Both start as drafts — nothing appears on
 * the site until someone publishes it deliberately.
 */
async function seedPages(): Promise<number> {
  const pages = [
    {
      title: 'Scholarships & Fee Assistance',
      slug: 'scholarships',
      kind: 'custom',
      excerpt: 'Who qualifies, what is available, and how to apply.',
      body: '<h2>Who qualifies</h2><p>Replace this with the real policy before publishing.</p>',
      showInNav: 1,
    },
    {
      title: 'Placement page heading',
      slug: 'placement',
      kind: 'override',
      excerpt: 'Replacement heading copy for the placement page.',
      body: null,
      showInNav: 0,
    },
  ]

  let added = 0
  for (const page of pages) {
    const existing = await queryOne<Row>(
      'SELECT id FROM pages WHERE kind = ? AND slug = ? LIMIT 1',
      [page.kind, page.slug],
    )
    if (existing) continue

    await execute(
      `INSERT INTO pages
         (id, title, slug, kind, excerpt, body, show_in_nav, sort_order, status,
          created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'draft', NOW(3), NOW(3))`,
      [randomUUID(), page.title, page.slug, page.kind, page.excerpt, page.body, page.showInNav, added],
    )
    added += 1
  }

  return added
}

/* ------------------------------------------------------------------ */

async function main(): Promise<void> {
  const events = await seedEvents()
  const albums = await seedAlbums()
  const testimonials = await seedTestimonials()
  const pages = await seedPages()

  console.log(`\nSeeded the Chandigarh site content into \`${process.env.DB_NAME}\`:`)
  console.log(`  events        ${events} added`)
  console.log(`  gallery       ${albums} albums added (no photos — add them from the library)`)
  console.log(`  testimonials  ${testimonials} added (no videos yet)`)
  console.log(`  pages         ${pages} added as drafts`)

  const counts = await query<Row>(
    `SELECT 'events' AS module, COUNT(*) AS n FROM events
      UNION ALL SELECT 'gallery', COUNT(*) FROM gallery_albums
      UNION ALL SELECT 'testimonials', COUNT(*) FROM testimonials
      UNION ALL SELECT 'pages', COUNT(*) FROM pages`,
  )
  console.log('\nTotals now:')
  for (const row of counts) console.log(`  ${String(row.module).padEnd(14)} ${row.n}`)

  await pool.end()
}

main().catch((error: unknown) => {
  console.error(error)
  process.exit(1)
})

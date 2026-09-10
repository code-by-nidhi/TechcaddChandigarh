import { randomUUID } from 'node:crypto'

import { execute, pool, query, queryOne, type Row } from './pool.js'

/**
 * Moves the Hoshiarpur website's built-in content into the CMS.
 *
 * The student reviews and the help-centre questions lived in
 * `techcadd-hero/src/lib/site.ts` — real, published copy that only a developer
 * could change. This carries it across verbatim so the site loses nothing on
 * the day it starts reading from the CMS instead.
 *
 * Idempotent: every insert checks for its own row first, so running it twice
 * changes nothing and running it after an editor has been at work does not
 * overwrite them.
 *
 *   npm run db:seed:hsp
 */

const isoDay = (date: Date) => date.toISOString().slice(0, 10)

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 200)

/* ------------------------------------------------------------------ */
/* Reviews — the student success wall                                   */
/* ------------------------------------------------------------------ */

interface SeedReview {
  authorName: string
  courseName: string
  badge: string
  rating: number
  quote: string
  featured?: boolean
}

const REVIEWS: SeedReview[] = [
  {
    authorName: 'Harmanpreet Singh',
    courseName: 'Full Stack Development',
    badge: 'Placed as MERN Developer',
    rating: 5,
    featured: true,
    quote:
      'I walked in with a commerce degree and no idea what an API was. Eighteen weeks later I was reviewing pull requests. Three deployed projects and a clean commit history did more for me in interviews than any certificate — the code reviews here were brutal in the best possible way, and that is exactly what made the difference when someone finally asked me to explain my architecture.',
  },
  {
    authorName: 'Simranjeet Kaur',
    courseName: 'Data Science',
    badge: 'Data Analyst',
    rating: 5,
    quote:
      'The SQL and statistics modules were relentless, and that is exactly why the interview felt easy.',
  },
  {
    authorName: 'Aditya Malhotra',
    courseName: 'AI & Machine Learning',
    badge: 'Placed as Python Developer',
    rating: 5,
    quote:
      'The internship put me on a real model in production. I stopped learning about ML and started doing it.',
  },
  {
    authorName: 'Navjot Kaur',
    courseName: 'Cloud & DevOps',
    badge: 'Internship Completed',
    rating: 5,
    quote:
      'Mock interviews were the turning point. By the fourth one I could defend my design decisions without freezing.',
  },
  {
    authorName: 'Rahul Verma',
    courseName: 'Cyber Security',
    badge: 'Portfolio Ready',
    rating: 4,
    quote:
      'The lab range is the difference. Reading about threat hunting and doing it on a live network are not the same skill.',
  },
  {
    authorName: 'Ishita Sharma',
    courseName: 'Full Stack Development',
    badge: 'Frontend Engineer',
    rating: 5,
    quote:
      'Weekend batches meant I never had to choose between my degree and this. Same syllabus, same trainers.',
  },
  {
    authorName: 'Karan Chadha',
    courseName: 'Digital Marketing',
    badge: 'Portfolio Ready',
    rating: 5,
    quote:
      'Running live campaigns with a real budget taught me more in a month than a year of theory.',
  },
  {
    authorName: 'Manpreet Gill',
    courseName: 'Data Science',
    badge: 'Internship Completed',
    rating: 5,
    quote:
      'My mentor still reviews my work a year after the course ended. That part nobody advertises.',
  },
]

async function seedReviews(): Promise<number> {
  let created = 0

  for (const [index, review] of REVIEWS.entries()) {
    const existing = await queryOne<Row>(
      'SELECT id FROM reviews WHERE author_name = ? AND quote = ? LIMIT 1',
      [review.authorName, review.quote],
    )
    if (existing) continue

    await execute(
      `INSERT INTO reviews
         (id, author_name, rating, quote, reviewed_on, course_name, badge, featured,
          source, sort_order, status, created_at, updated_at)
       VALUES (?, ?, ?, ?, NULL, ?, ?, ?, 'website', ?, 'published', NOW(3), NOW(3))`,
      [
        randomUUID(),
        review.authorName,
        review.rating,
        review.quote,
        review.courseName,
        review.badge,
        review.featured ? 1 : 0,
        // Keeps the order the wall had, so nothing moves on the day it goes live.
        index,
      ],
    )
    created += 1
  }

  return created
}

/* ------------------------------------------------------------------ */
/* FAQs — the help centre, and the shorter list on the contact page     */
/* ------------------------------------------------------------------ */

interface SeedFaq {
  category: string
  question: string
  answer: string
  /** Marked for the contact page's short list. */
  featured?: boolean
}

const FAQS: SeedFaq[] = [
  {
    category: 'Admissions',
    question: 'Do I need a technical background to start?',
    answer:
      'No. Around a third of each batch comes from non-technical degrees. Counselling exists to place you in a track that matches where you are starting from, and the foundation modules assume nothing.',
  },
  {
    category: 'Admissions',
    question: 'When do new batches begin?',
    answer:
      'New batches open every month across weekday, evening and weekend slots. Your counsellor will tell you the next start date for the track you are considering.',
  },
  {
    category: 'Admissions',
    question: 'Can I switch tracks after enrolling?',
    answer:
      'Yes, within the first two weeks. If the fit is not right, we move you across and adjust the schedule rather than leaving you to struggle through.',
  },
  {
    category: 'Admissions',
    question: 'Which course is best for beginners?',
    answer:
      'Most beginners start with Full Stack Development or Data Science, since both begin from fundamentals. Your counsellor will match the track to your background and the role you want.',
    featured: true,
  },
  {
    category: 'Fees',
    question: 'Are there instalment options?',
    answer:
      'Yes. Most programmes can be paid in two or three instalments across the duration of the course. Details are confirmed at counselling, in writing.',
  },
  {
    category: 'Fees',
    question: 'Is there a fee for repeating a module?',
    answer:
      'No. If you fall behind, you can repeat the module with a later batch at no extra cost.',
  },
  {
    category: 'Fees',
    question: 'Is counselling free?',
    answer:
      'Yes. Counselling costs nothing and carries no obligation to enrol. If a track is not right for you, we will say so before you pay.',
    featured: true,
  },
  {
    category: 'Placements',
    question: 'How does placement assistance actually work?',
    answer:
      'Resume reviews, mock technical and HR rounds, on-campus drives with recruiting companies, and direct referrals from mentors. Support continues after your course ends until you are placed.',
  },
  {
    category: 'Placements',
    question: 'How long does placement support last?',
    answer:
      'It does not expire on a fixed date. Students stay in the drive and referral pipeline until they land a role.',
  },
  {
    category: 'Placements',
    question: 'Do you provide placement assistance?',
    answer:
      'Every programme includes interview preparation, portfolio review and referrals into our hiring network, and that support continues after your certificate is printed.',
    featured: true,
  },
  {
    category: 'Internships',
    question: 'Are the internships paid?',
    answer:
      'Most six-month internships carry a stipend, which varies by company and role. Your counsellor will tell you exactly what applies to your track.',
  },
  {
    category: 'Internships',
    question: 'Is the internship guaranteed?',
    answer:
      'Internship placement is part of the six-month tracks, subject to completing the training modules and project work that come before it.',
  },
  {
    category: 'Training',
    question: 'Can I attend while working or studying full time?',
    answer:
      'Yes. Weekend batches run Saturday and Sunday, evening batches run on weekdays. Both cover identical material — only the schedule differs.',
  },
  {
    category: 'Training',
    question: 'What happens if I miss classes?',
    answer:
      'Sessions are recorded and lab access continues outside class hours. Doubt sessions exist precisely for catching up.',
  },
  {
    category: 'Training',
    question: 'Can working professionals join?',
    answer:
      'Yes. Weekend batches and one-to-one mentoring sessions exist for exactly that, so you can train without taking leave.',
    featured: true,
  },
  {
    category: 'Support',
    question: 'Can I get help after the course ends?',
    answer: 'Yes. Alumni keep access to doubt sessions, mentor hours and the referral network.',
  },
  {
    category: 'Support',
    question: 'Is there a certificate at the end?',
    answer:
      'Yes, an industry-recognised completion certificate, plus certification prep for vendor exams like AWS and Microsoft where the track calls for it.',
  },
  {
    category: 'Support',
    question: 'Can I visit the campus?',
    answer:
      'Please do. Walk in on any working day to see the labs and the project floor, or book a slot and we will keep a counsellor free for you.',
    featured: true,
  },
]

async function seedFaqs(): Promise<number> {
  let created = 0

  // Ordered within a category, because that is how the help centre groups them.
  const positions = new Map<string, number>()

  for (const faq of FAQS) {
    const position = positions.get(faq.category) ?? 0
    positions.set(faq.category, position + 1)

    const existing = await queryOne<Row>('SELECT id FROM faqs WHERE question = ? LIMIT 1', [
      faq.question,
    ])
    if (existing) continue

    await execute(
      `INSERT INTO faqs (id, question, answer, category, sort_order, featured, status,
                         created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, 'published', NOW(3), NOW(3))`,
      [randomUUID(), faq.question, faq.answer, faq.category, position, faq.featured ? 1 : 0],
    )
    created += 1
  }

  return created
}

/* ------------------------------------------------------------------ */
/* Blog — a byline, and a home for uncategorised posts                  */
/* ------------------------------------------------------------------ */

/**
 * The blog itself is not seeded here.
 *
 * `site.ts` carried six article titles and excerpts, but never the articles —
 * the homepage only ever rendered the teaser. The real published blog came
 * across from the retired NestJS API instead; see `import-blog.ts`.
 */

/** Returns the id of a category with this name, creating it if it is missing. */
async function categoryId(name: string): Promise<string> {
  const existing = await queryOne<Row>('SELECT id FROM categories WHERE name = ? LIMIT 1', [name])
  if (existing) return existing.id as string

  const id = randomUUID()
  await execute(
    `INSERT INTO categories (id, name, slug, sort_order, status, created_at, updated_at)
     VALUES (?, ?, ?, 0, 'published', NOW(3), NOW(3))`,
    [id, name, slugify(name)],
  )
  return id
}

/**
 * Gives the seeded administrator a byline.
 *
 * Without an author slug the public API falls back to one derived from the
 * account name, which for `techcadd-team` reads as a username rather than an
 * author. Only filled in where it is still empty, so a real name entered later
 * is never overwritten.
 */
async function seedAuthorProfile(): Promise<void> {
  const user = await queryOne<Row>(
    "SELECT id, author_slug FROM users WHERE role = 'admin' AND active = 1 ORDER BY created_at LIMIT 1",
  )
  if (!user) return

  if (!user.author_slug) {
    await execute(
      `UPDATE users
          SET author_slug = 'techcadd-team',
              author_title = COALESCE(author_title, 'TechCADD Hoshiarpur'),
              author_bio = COALESCE(author_bio,
                'Written by the trainers and placement team at TechCADD Hoshiarpur.'),
              updated_at = NOW(3)
        WHERE id = ?`,
      [user.id],
    )
  }
}

/**
 * Files any post that has no category.
 *
 * The blog index renders its filter row from categories that have published
 * posts in them, so an uncategorised blog shows no filters at all. Only touches
 * rows where the field is empty.
 */
async function backfillPostCategories(): Promise<number> {
  const orphans = await query<Row>('SELECT id FROM blogs WHERE category_id IS NULL')
  if (orphans.length === 0) return 0

  const fallback = await categoryId('Career')
  for (const row of orphans) {
    await execute('UPDATE blogs SET category_id = ? WHERE id = ?', [fallback, row.id])
  }

  return orphans.length
}

async function main(): Promise<void> {
  await seedAuthorProfile()

  const reviews = await seedReviews()
  const faqs = await seedFaqs()
  const filed = await backfillPostCategories()

  console.log(`\nSeeded the Hoshiarpur site content into \`${process.env.DB_NAME}\`:`)
  console.log(`  reviews    ${reviews} added (${REVIEWS.length - reviews} already present)`)
  console.log(`  faqs       ${faqs} added (${FAQS.length - faqs} already present)`)
  if (filed > 0) console.log(`  categories ${filed} uncategorised post(s) filed under Career`)
  console.log(`\nSeeded on ${isoDay(new Date())}. Safe to run again.`)
}

main()
  .catch((error: unknown) => {
    console.error('Seed failed:', error instanceof Error ? error.message : error)
    process.exitCode = 1
  })
  .finally(() => pool.end())

import { randomUUID } from 'node:crypto'

import { courseCategories, courses } from '../../../../data/courses.ts'
import { execute, pool, query, queryOne, type Row } from './pool.js'

/**
 * Moves the website's course catalogue into the CMS.
 *
 * The 44 courses and their seven groups lived in `data/courses.ts` — real,
 * published copy that only a developer could change, and the source of roughly
 * 150 of the site's URLs. This carries it across verbatim so the site loses
 * nothing on the day it starts reading courses from the CMS.
 *
 * Read directly from the website's own module rather than copied into a list
 * here: a hand-transcribed copy of 44 courses would be wrong somewhere, and
 * would be wrong again the next time either side changed.
 *
 * Idempotent: every insert checks for its own row first, so running it twice
 * changes nothing and running it after an editor has been at work does not
 * overwrite them.
 *
 *   npm run db:seed:courses
 */

async function seedCategories(): Promise<{ added: number; byKey: Map<string, string> }> {
  const byKey = new Map<string, string>()
  let added = 0
  let order = 0

  for (const category of courseCategories) {
    order += 1

    const existing = await queryOne<Row>(
      'SELECT id FROM course_categories WHERE slug = ? LIMIT 1',
      [category.id],
    )
    if (existing) {
      byKey.set(category.id, existing.id as string)
      continue
    }

    const id = randomUUID()
    await execute(
      `INSERT INTO course_categories
         (id, slug, name, short_name, blurb, icon, sort_order, status, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'published', NOW(3), NOW(3))`,
      [id, category.id, category.name, category.short, category.blurb, category.icon, order],
    )

    byKey.set(category.id, id)
    added += 1
  }

  return { added, byKey }
}

async function seedCourses(byKey: Map<string, string>): Promise<number> {
  let added = 0
  let order = 0

  for (const course of courses) {
    order += 1

    const existing = await queryOne<Row>('SELECT id FROM courses WHERE course_key = ? LIMIT 1', [
      course.id,
    ])
    if (existing) continue

    const id = randomUUID()
    await execute(
      `INSERT INTO courses
         (id, course_key, name, category_id, duration, level, summary, badge,
          featured, has_training, fee_original, fee_offer, sort_order, status,
          created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'published', NOW(3), NOW(3))`,
      [
        id,
        course.id,
        course.name,
        byKey.get(course.category) ?? null,
        course.duration,
        course.level,
        course.summary,
        course.badge ?? null,
        course.featured ? 1 : 0,
        course.training ? 1 : 0,
        course.fee?.original ?? null,
        course.fee?.offer ?? null,
        order,
      ],
    )

    let position = 0
    for (const tool of course.tools) {
      await execute(
        'INSERT INTO course_tools (id, course_id, tool, sort_order) VALUES (?, ?, ?, ?)',
        [randomUUID(), id, tool, position++],
      )
    }

    let modulePosition = 0
    for (const entry of course.modules) {
      const moduleId = randomUUID()
      await execute(
        'INSERT INTO course_modules (id, course_id, title, sort_order) VALUES (?, ?, ?, ?)',
        [moduleId, id, entry.title, modulePosition++],
      )

      let topicPosition = 0
      for (const topic of entry.topics) {
        await execute(
          'INSERT INTO course_module_topics (id, module_id, topic, sort_order) VALUES (?, ?, ?, ?)',
          [randomUUID(), moduleId, topic, topicPosition++],
        )
      }
    }

    for (const [kind, values] of [
      ['outcome', course.outcomes],
      ['career', course.careers],
    ] as const) {
      let pointPosition = 0
      for (const text of values) {
        await execute(
          'INSERT INTO course_points (id, course_id, kind, text, sort_order) VALUES (?, ?, ?, ?, ?)',
          [randomUUID(), id, kind, text, pointPosition++],
        )
      }
    }

    added += 1
  }

  return added
}

async function main(): Promise<void> {
  const { added: categoriesAdded, byKey } = await seedCategories()
  const coursesAdded = await seedCourses(byKey)

  console.log(`\nSeeded the course catalogue into \`${process.env.DB_NAME}\`:`)
  console.log(`  course categories  ${categoriesAdded} added`)
  console.log(`  courses            ${coursesAdded} added`)

  const counts = await query<Row>(
    `SELECT 'course_categories' AS t, COUNT(*) AS n FROM course_categories
      UNION ALL SELECT 'courses',              COUNT(*) FROM courses
      UNION ALL SELECT 'course_tools',         COUNT(*) FROM course_tools
      UNION ALL SELECT 'course_modules',       COUNT(*) FROM course_modules
      UNION ALL SELECT 'course_module_topics', COUNT(*) FROM course_module_topics
      UNION ALL SELECT 'course_points',        COUNT(*) FROM course_points`,
  )
  console.log('\nTotals now:')
  for (const row of counts) console.log(`  ${String(row.t).padEnd(22)} ${row.n}`)

  await pool.end()
}

main().catch((error: unknown) => {
  console.error(error)
  process.exit(1)
})

import { randomUUID } from 'node:crypto'

import { isProduction } from '../config.js'
import { execute, pool, queryOne } from './pool.js'
import { hashPassword, SEED_PASSWORD } from '../modules/auth/auth.service.js'

/**
 * Creates the first administrator so the CMS is reachable. Idempotent — running
 * it twice leaves the existing account alone rather than resetting a password
 * someone has already changed.
 */
const EMAIL = process.env.SEED_EMAIL ?? 'admin@techcadd.com'
const PASSWORD = process.env.SEED_PASSWORD ?? SEED_PASSWORD
const NAME = process.env.SEED_NAME ?? 'techcadd-team'

async function seed(): Promise<void> {
  /*
   * The default is for a developer on a fresh clone, and it is published in
   * this file. Creating an account with it on a production database would be
   * handing out a working login, so that combination is refused outright.
   */
  if (isProduction && !process.env.SEED_PASSWORD) {
    console.error('Refusing to seed a production database with the default password.')
    console.error('Set one first:  SEED_PASSWORD=<a real password> npm run db:seed')
    process.exitCode = 1
    return
  }

  const existing = await queryOne<{ id: string }>('SELECT id FROM users WHERE email = ? LIMIT 1', [
    EMAIL,
  ])

  if (existing) {
    console.log(`User ${EMAIL} already exists — nothing to do.`)
    return
  }

  await execute(
    `INSERT INTO users (id, name, email, password_hash, role, active, created_at, updated_at)
     VALUES (?, ?, ?, ?, 'admin', 1, NOW(3), NOW(3))`,
    [randomUUID(), NAME, EMAIL, await hashPassword(PASSWORD)],
  )

  console.log(`Created administrator: ${EMAIL}`)
  console.log(`Password: ${PASSWORD}`)
  console.log('\nChange it after the first sign-in (Settings → Security).')
}

seed()
  .catch((error: unknown) => {
    console.error('Seed failed:', error instanceof Error ? error.message : error)
    process.exitCode = 1
  })
  .finally(() => pool.end())

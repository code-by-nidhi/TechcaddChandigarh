# TechCADD Chandigarh CMS — API

Express + MySQL backend for the CMS in `../frontend`, and the content API the
public website in `../../techcadd-hero` reads from.

Two surfaces, deliberately separate:

- **`/api/*`** — the CMS. Every route behind a session cookie.
- **`/api/public/*`** — what the website may read, and the two things a visitor
  may write (an enquiry, a newsletter subscription). No session, drafts never
  leave it, and `status = 'published'` is forced rather than taken from the
  query string.

## Setup

**1. MySQL.** Have MySQL 8 running locally (or point at a remote server).
Nothing needs creating by hand — the migration creates the database.

**2. Environment.**

```bash
cp .env.example .env
```

Fill in `DB_USER` / `DB_PASSWORD`, and generate a real cookie secret:

```bash
node -e "console.log(crypto.randomUUID() + crypto.randomUUID())"
```

**3. Schema and first user.**

```bash
npm run db:migrate     # creates the database, applies migrations
npm run db:seed        # creates the first administrator
```

The seed prints the credentials it created. Override them if you like:

```bash
SEED_EMAIL=you@techcadd.com SEED_PASSWORD='YourStrongPass1' npm run db:seed
```

**Content.** Two one-off imports bring the website's existing content in. Both
are idempotent, so a repeat run changes nothing:

```bash
npm run db:seed:hsp      # the reviews and FAQs that were hard-coded in the site
npm run db:import:blog   # articles, authors, categories, tags and artwork,
                         # out of the old blog service's SQLite file
```

Both have already been run against the live database — the blog is in here and
the service it came from has been deleted. `db:import:blog` is kept because it
is idempotent and reads its source read-only, so it can be pointed at an
archived copy of that file if anything ever needs re-importing:
`npm run db:import:blog -- <path/to/dev.db> <path/to/site/public>`.

**4. Run.**

```bash
npm run dev            # http://localhost:4000
```

Check it: `curl http://localhost:4000/api/health`

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Watch mode via tsx |
| `npm run build` | Compile to `dist/` |
| `npm start` | Run the compiled build |
| `npm run typecheck` | Types only, no emit |
| `npm run db:migrate` | Apply pending migrations (safe to re-run) |
| `npm run db:seed` | Create the first administrator (idempotent) |
| `npm run db:seed:hsp` | Import the website's built-in reviews and FAQs (idempotent) |
| `npm run db:import:blog` | Re-import the blog from an archived SQLite file (idempotent) |
| `npm run db:inspect` | Row counts, or the rows in one table |
| `npm test` | Migrate a throwaway `*_test` database, then run the suite |

## Structure

```
src/
  config.ts              env parsed and validated at boot
  app.ts                 middleware + route wiring
  server.ts              entry, startup checks, graceful shutdown
  db/
    pool.ts              connection pool, query/execute/transaction helpers
    migrate.ts           migration runner
    seed.ts              first administrator
    seed-hsp.ts          the website's built-in reviews and FAQs
    import-blog.ts       the blog, out of the old blog service's SQLite file
    migrations/*.sql     schema, applied in filename order
  http/
    errors.ts            HttpError + the error shape the CMS expects
    listParams.ts        query-string parsing, sort/filter whitelisting
    params.ts            route-param access
  middleware/auth.ts     session resolution, requireAuth, requireRole
  modules/
    auth/                login, logout, me, password reset/change
    courses/             the reference resource — routes, repo, schema
    public/              everything the website may read
      public.routes.ts   courses, reviews, FAQs, categories, site, enquiries, newsletter
      blog.routes.ts     the blog, in the shape the website already reads
```

## The contract

Every resource exposes the same five operations, matching
`frontend/src/api/types.ts`:

| Method | Path | |
| --- | --- | --- |
| `GET` | `/api/courses?page=1&pageSize=25&q=&sort=updatedAt&dir=desc&status=draft` | list |
| `GET` | `/api/courses/:id` | get |
| `POST` | `/api/courses` | create |
| `PATCH` | `/api/courses/:id` | update |
| `DELETE` | `/api/courses` — body `{ "ids": [...] }` | bulk remove |

Lists return `{ items, total, page, pageSize }`.

Errors return `{ message, fieldErrors? }` with a matching HTTP status. The
`fieldErrors` keys are form field names — the CMS maps them straight back onto
inputs, which is how "This slug is already in use." lands on the slug field.

## Adding a resource

Copy `src/modules/courses/`. Each module is three files:

- **`*.schema.ts`** — zod, mirroring the frontend schema. Client validation is a
  convenience; this is the guarantee.
- **`*.repo.ts`** — SQL. Declare `SORTABLE` and `FILTERABLE` column maps;
  anything not in them is ignored rather than interpolated.
- **`*.routes.ts`** — the five endpoints plus role checks.

Then mount it in `app.ts`.

## Security notes

These are deliberate, not incidental:

- Passwords are **argon2id**. Login compares against a dummy hash when the user
  does not exist, so response timing does not reveal which emails are registered.
- Unknown identifier and wrong password return the **same message**, for the same reason.
- Sign-in accepts a **username or the email address**. Only the username is shown;
  the address is a way back in if a username is changed, not a feature.
- Sessions are **httpOnly, SameSite=Lax, signed cookies** — not a JWT in
  localStorage, which any XSS could read. `secure` turns on in production.
- Changing a password **revokes other sessions** but keeps the current one.
- `requireRole()` enforces permissions **server-side**. `useCan()` in the CMS
  only hides buttons.
- Sort and filter columns are **whitelisted**. Column names cannot be
  parameterised, so nothing from the query string ever reaches SQL directly.
- Rate limits on `/auth/login` and on both public write endpoints
  (`/public/enquiries`, `/public/newsletter/subscribe`).
- **There is no password reset.** One administrator signs in with a username, so
  there is no address to mail a link to and the sign-in screen offers none. A
  forgotten password is recovered with `SEED_EMAIL=… SEED_PASSWORD=… npm run db:seed`.
- Passwords are **twelve characters minimum, with no composition rules** — length
  resists a guess; "must contain a capital" mostly produces `Password1`.
- Expired sessions and spent reset tokens are **purged on boot and daily**
  (`startSessionHousekeeping`). Neither is exploitable once expired, but a table
  of stale credential material that only grows is not worth keeping.
- The API **refuses to start in production** if any active account still uses
  the password `db:seed` sets by default, and `db:seed` refuses to create one
  there. In development it prints a warning instead — the default exists so a
  fresh clone can sign in.

## The public API

What `../../techcadd-hero` reads. Everything is GET unless marked otherwise.

| Path | Serves |
| --- | --- |
| `/api/public/blog/posts` | the blog index — `?page&limit&category&search&tag&author&sort&exclude` |
| `/api/public/blog/posts/:slug` | one article, and counts a view |
| `/api/public/blog/posts/:slug/related` | more from the same category |
| `/api/public/blog/featured` | the lead story |
| `/api/public/blog/trending` | the trending rail |
| `/api/public/blog/editors-picks` | the picks row |
| `/api/public/blog/categories` | the filter row — only categories with published posts |
| `/api/public/blog/authors/:slug` | an author page |
| `/api/public/reviews` | the student wall — `?featured=1&limit=` |
| `/api/public/faqs` | the help centre — `?category=&featured=1&limit=` |
| `/api/public/courses`, `/api/public/courses/:slug` | the course catalogue |
| `/api/public/testimonials`, `/gallery`, `/banners`, `/categories`, `/site`, `/pages/:slug`, `/redirects` | as named |
| `POST /api/public/enquiries` | a form submission — rate limited, duplicate-guarded |
| `POST /api/public/newsletter/subscribe` | a subscription — idempotent |

Uploaded images come back as absolute URLs, because the website renders them on
a different origin. The origin is taken from the request; set
`PUBLIC_ASSET_BASE_URL` when the API cannot see the address it is reached at —
behind a proxy that rewrites Host, or with a CDN in front of `/uploads`.

After every successful write the API pings `SITE_REVALIDATE_URL` with
`REVALIDATE_SECRET`, so a publish shows on the website within seconds instead
of waiting out its cache. Both are optional; without them the site refreshes on
its own hourly.

## Still to build

- A mailer, so password reset actually sends a link. The token is currently
  logged in development only.
- CSRF tokens if you later relax `SameSite`.
- A scheduled job calling `purgeExpired()` to clear stale sessions and tokens.
- The course catalogue still lives in the website's own TypeScript files; the
  `courses` module here does not reach it yet.

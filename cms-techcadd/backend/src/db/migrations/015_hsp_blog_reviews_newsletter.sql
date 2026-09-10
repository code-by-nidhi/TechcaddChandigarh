-- Adapts the CMS to what the TechCADD Hoshiarpur website actually renders.
--
-- The website's blog section was built against a standalone API that is being
-- retired in favour of this one. Its pages show a featured story, a trending
-- rail, an editor's picks row and an author page — none of which the CMS's
-- blogs table could express. Rather than cut those sections from a working
-- site, the columns behind them move here.

-- --------------------------------------------------------------------------
-- Blog posts: the editorial flags the website's rails are built from.
-- --------------------------------------------------------------------------

ALTER TABLE blogs
  /* The one story that leads the blog index. Enforced as at most one in the
     API rather than by a constraint, because MySQL has no partial unique
     index and a trigger would fail a save with an error an editor cannot act
     on — the API demotes the previous holder instead. */
  ADD COLUMN featured     TINYINT(1)   NOT NULL DEFAULT 0 AFTER status,
  /* Feeds the "Trending" sidebar. Editorial, not measured: a view counter
     would promote whatever an aggregator linked to last week. */
  ADD COLUMN trending     TINYINT(1)   NOT NULL DEFAULT 0 AFTER featured,
  /* Shown on every card. Derived from the body on save, never typed, so it
     cannot drift from the article it describes. */
  ADD COLUMN reading_time SMALLINT UNSIGNED NOT NULL DEFAULT 1 AFTER trending,
  /* Ordering signal for "popular". Incremented by the public detail endpoint;
     nothing in the CMS writes it. */
  ADD COLUMN views        INT UNSIGNED NOT NULL DEFAULT 0 AFTER reading_time;

CREATE INDEX idx_blogs_featured ON blogs (featured);
CREATE INDEX idx_blogs_trending ON blogs (trending);
CREATE INDEX idx_blogs_views    ON blogs (views);

-- --------------------------------------------------------------------------
-- Bylines.
-- --------------------------------------------------------------------------
--
-- A post's author is already a CMS user, and the website prints that person's
-- name, photo, job title and biography under every article and on a page of
-- their own. Those are public facts about a writer, distinct from the login
-- the account also is, so they sit alongside it rather than in a second table
-- that would have to be kept in step by hand.
--
-- All nullable: an account that never writes anything needs none of them, and
-- the API falls back to the name for the slug and to an empty biography.

ALTER TABLE users
  -- The address of the author page: /blog/author/<slug>.
  ADD COLUMN author_slug  VARCHAR(160) NULL AFTER name,
  -- "Placement Lead", "AI Track Mentor" — printed beneath the name.
  ADD COLUMN author_title VARCHAR(120) NULL AFTER author_slug,
  ADD COLUMN author_bio   TEXT         NULL AFTER author_title,
  /* JSON object: {"linkedin": "...", "x": "...", "github": "..."}. A column
     per network would need a migration every time one is added or dies. */
  ADD COLUMN author_social JSON        NULL AFTER author_bio,
  ADD UNIQUE KEY uq_users_author_slug (author_slug);

-- --------------------------------------------------------------------------
-- Reviews: the two fields the student wall shows and the table did not hold.
-- --------------------------------------------------------------------------

ALTER TABLE reviews
  /* The outcome, not the course: "Placed as MERN Developer". It is the line a
     visitor actually reads the card for, and it is not derivable from the
     course name — two students on the same course land different roles. */
  ADD COLUMN badge    VARCHAR(120) NULL AFTER course_name,
  /* The wall leads with these. */
  ADD COLUMN featured TINYINT(1)   NOT NULL DEFAULT 0 AFTER badge;

CREATE INDEX idx_reviews_featured ON reviews (featured);

-- --------------------------------------------------------------------------
-- Newsletter.
-- --------------------------------------------------------------------------
--
-- The blog footer carries a subscribe form. The address is the identity, so it
-- is the unique key: re-subscribing flips an unsubscribed row back to active
-- rather than inserting a duplicate, which also means the endpoint can answer
-- identically either way and never reveal whether an address is already known.

CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id            CHAR(36)     NOT NULL PRIMARY KEY,
  -- 190 chars for the same index-length reason as users.email.
  email         VARCHAR(190) NOT NULL,
  status        ENUM('active','unsubscribed') NOT NULL DEFAULT 'active',
  -- Which form: "blog", "footer". Attribution, and nothing more.
  source        VARCHAR(32)  NOT NULL DEFAULT 'blog',
  subscribed_at DATETIME(3)  NOT NULL,
  created_at    DATETIME(3)  NOT NULL,
  updated_at    DATETIME(3)  NOT NULL,
  UNIQUE KEY uq_newsletter_email (email),
  KEY idx_newsletter_status  (status),
  KEY idx_newsletter_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

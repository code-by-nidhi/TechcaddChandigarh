-- Comments, the chatbot knowledge base, the audit trail, and SEO.
--
-- Five modules the sidebar is being extended with. They are one migration
-- because they ship together; nothing here depends on anything else here.
--
-- On `redirects`: migration 016 dropped a table of this name as an unused
-- leftover from the Jalandhar CMS. This is not that table restored — it is a
-- narrower one for the job actually being asked for, with a hit counter so a
-- rule nothing has followed in a year can be identified and removed.

-- --------------------------------------------------------------------------
-- Comments on blog posts.
-- --------------------------------------------------------------------------
--
-- Written by the public, so nothing here is trusted and nothing appears on the
-- site until somebody approves it. `status` defaults to 'pending' at the
-- column level rather than in application code: a future writer that forgets
-- to set it produces an unpublished comment, not a published one.

CREATE TABLE IF NOT EXISTS comments (
  id           CHAR(36)     NOT NULL PRIMARY KEY,
  blog_id      CHAR(36)     NOT NULL,
  -- A reply to another comment. Self-referencing, one level deep in practice —
  -- the site renders a reply under its parent and no deeper.
  parent_id    CHAR(36)     NULL,
  author_name  VARCHAR(120) NOT NULL,
  -- Collected for the moderator to reply to, never rendered on the site.
  author_email VARCHAR(190) NULL,
  body         TEXT         NOT NULL,
  status       ENUM('pending','approved','spam') NOT NULL DEFAULT 'pending',
  -- Kept for rate limiting and for recognising a flood from one source.
  ip           VARCHAR(45)  NULL,
  user_agent   VARCHAR(255) NULL,
  created_at   DATETIME(3)  NOT NULL,
  updated_at   DATETIME(3)  NOT NULL,
  KEY idx_comments_blog   (blog_id, status),
  KEY idx_comments_status (status, created_at),
  CONSTRAINT fk_comments_blog   FOREIGN KEY (blog_id)   REFERENCES blogs(id)    ON DELETE CASCADE,
  -- A deleted parent takes its replies with it: a reply with nothing above it
  -- reads as a non-sequitur on the page.
  CONSTRAINT fk_comments_parent FOREIGN KEY (parent_id) REFERENCES comments(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------------
-- AI knowledge base — what the website chatbot answers from.
-- --------------------------------------------------------------------------
--
-- Deliberately not the FAQ table. An FAQ is written to be read on a page and
-- is grouped, ordered and shown in full; a knowledge entry is written to be
-- retrieved, and carries the alternate phrasings a visitor might actually type.
-- Sharing one table would mean every FAQ growing retrieval fields it never
-- uses, and every knowledge entry appearing on the FAQ page whether it reads
-- well there or not.

CREATE TABLE IF NOT EXISTS ai_knowledge (
  id         CHAR(36)     NOT NULL PRIMARY KEY,
  question   VARCHAR(300) NOT NULL,
  answer     TEXT         NOT NULL,
  category   VARCHAR(80)  NOT NULL DEFAULT 'General',
  -- Comma-separated alternate phrasings: "cost", "how much", "price". What
  -- makes a question findable when nobody asks it the way it was written.
  keywords   TEXT         NULL,
  -- Counted when an answer is served, so the entries nobody ever matches can
  -- be found and rewritten rather than left to rot.
  hits       INT UNSIGNED NOT NULL DEFAULT 0,
  sort_order INT          NOT NULL DEFAULT 0,
  status     ENUM('published','draft','review') NOT NULL DEFAULT 'draft',
  created_at DATETIME(3)  NOT NULL,
  updated_at DATETIME(3)  NOT NULL,
  KEY idx_ai_knowledge_status   (status),
  KEY idx_ai_knowledge_category (category),
  -- Retrieval is a text match over the question, its alternate phrasings and
  -- the answer, so all three are in the index.
  FULLTEXT KEY ft_ai_knowledge (question, keywords, answer)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------------
-- Activity log — who changed what.
-- --------------------------------------------------------------------------
--
-- `user_name` and `entity_label` are snapshots, not joins. The whole point of
-- an audit trail is to survive the thing it describes: a post deleted last
-- month still has to read as "Priya deleted 'MERN vs MEAN'", which a join onto
-- a row that no longer exists cannot produce. `user_id` stays as a nullable
-- link for filtering while the account still exists.

CREATE TABLE IF NOT EXISTS activity_log (
  id           CHAR(36)     NOT NULL PRIMARY KEY,
  user_id      CHAR(36)     NULL,
  user_name    VARCHAR(120) NOT NULL,
  action       ENUM('create','update','delete','publish','unpublish','login','logout') NOT NULL,
  -- The module, as the sidebar names it: 'blogs', 'events', 'settings'.
  entity_type  VARCHAR(60)  NOT NULL,
  entity_id    VARCHAR(64)  NULL,
  -- What the record was called at the time.
  entity_label VARCHAR(255) NULL,
  ip           VARCHAR(45)  NULL,
  created_at   DATETIME(3)  NOT NULL,
  KEY idx_activity_created (created_at),
  KEY idx_activity_user    (user_id, created_at),
  KEY idx_activity_entity  (entity_type, created_at),
  -- The account going away must not take its history with it, so this is SET
  -- NULL rather than CASCADE — `user_name` is what keeps the row readable.
  CONSTRAINT fk_activity_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------------
-- SEO: redirects.
-- --------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS redirects (
  id          CHAR(36)     NOT NULL PRIMARY KEY,
  -- Stored with a leading slash and no origin, so a rule written while the
  -- site was on a staging domain still applies in production.
  from_path   VARCHAR(500) NOT NULL,
  to_path     VARCHAR(500) NOT NULL,
  -- 301 tells search engines to move the ranking, 302 does not. The default is
  -- 301 because a permanent rename is what this is nearly always used for.
  status_code SMALLINT     NOT NULL DEFAULT 301,
  active      TINYINT(1)   NOT NULL DEFAULT 1,
  hits        INT UNSIGNED NOT NULL DEFAULT 0,
  last_hit_at DATETIME(3)  NULL,
  note        VARCHAR(255) NULL,
  created_at  DATETIME(3)  NOT NULL,
  updated_at  DATETIME(3)  NOT NULL,
  -- 191, not 500: utf8mb4 is 4 bytes per character and InnoDB caps an index
  -- column at 767 bytes. A path longer than that is not a real redirect.
  UNIQUE KEY uq_redirects_from (from_path(191)),
  KEY idx_redirects_active (active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------------
-- SEO: per-route meta overrides.
-- --------------------------------------------------------------------------
--
-- Separate from `pages`. A Pages override replaces heading copy an editor sees
-- on the page; this replaces what search engines and social cards read, and
-- applies to every route including the ~150 generated from the course
-- catalogue, which have no `pages` row and never will.

CREATE TABLE IF NOT EXISTS seo_meta (
  id               CHAR(36)     NOT NULL PRIMARY KEY,
  -- The site path, leading slash included: '/', '/courses', '/blogs/mern-vs-mean'.
  route            VARCHAR(500) NOT NULL,
  meta_title       VARCHAR(200) NULL,
  meta_description VARCHAR(320) NULL,
  og_image_id      CHAR(36)     NULL,
  canonical_url    VARCHAR(500) NULL,
  -- Keeps a thin or duplicated page out of search results without unpublishing
  -- it — a landing page that only exists for one campaign, say.
  noindex          TINYINT(1)   NOT NULL DEFAULT 0,
  created_at       DATETIME(3)  NOT NULL,
  updated_at       DATETIME(3)  NOT NULL,
  UNIQUE KEY uq_seo_meta_route (route(191)),
  CONSTRAINT fk_seo_meta_og FOREIGN KEY (og_image_id) REFERENCES media(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------------
-- SEO: sitemap and robots settings.
-- --------------------------------------------------------------------------
--
-- One JSON column on the existing single-row settings table rather than a
-- table of its own: these are site-wide switches, there is exactly one set of
-- them, and `robots_txt` already lives there.

ALTER TABLE settings
  ADD COLUMN sitemap JSON NULL AFTER robots_txt;

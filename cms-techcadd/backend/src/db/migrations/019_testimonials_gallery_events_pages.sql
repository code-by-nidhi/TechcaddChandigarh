-- Adds the four modules the Chandigarh website needs and this CMS does not have.
--
-- Migration 016 dropped `testimonials`, `gallery_albums`, `gallery_images` and
-- `pages` because the Hoshiarpur site rendered none of them. The Chandigarh
-- site does: it has a gallery page, an events calendar with per-event pages, a
-- video testimonial wall, and a Resources menu that should list both events and
-- editor-authored pages. So they come back — but shaped for what this site
-- actually renders, not restored from the old schema.
--
-- What is deliberately different from the tables 016 removed:
--
--   * `testimonials` is video-first. Reviews stays the text-and-stars wall; a
--     testimonial is a student on camera, so it carries a YouTube link and the
--     Google review it corresponds to. Keeping both only earns its place
--     because they now render as different things.
--   * `gallery_images` points at `media` rather than storing its own path, so a
--     photo uploaded once is reusable and deleting it from the library cannot
--     leave a gallery tile pointing at a file that is gone.
--   * `pages` covers both jobs asked of it: a `custom` page publishes a new URL
--     at /pages/<slug>, and an `override` page carries replacement copy for a
--     route the site already has. One table, because they share every field
--     that matters and an editor thinks of both as "a page".

-- --------------------------------------------------------------------------
-- Testimonials — the video wall.
-- --------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS testimonials (
  id           CHAR(36)     NOT NULL PRIMARY KEY,
  author_name  VARCHAR(120) NOT NULL,
  -- The outcome the card leads with: "Placed as MERN Developer".
  role         VARCHAR(160) NOT NULL DEFAULT '',
  course_name  VARCHAR(200) NULL,
  quote        TEXT         NOT NULL,
  rating       TINYINT UNSIGNED NOT NULL DEFAULT 5,
  -- Both links are optional and independent: a written testimonial with a
  -- Google link but no video is still worth publishing, and so is a video with
  -- no Google review behind it.
  google_url   VARCHAR(500) NULL,
  youtube_url  VARCHAR(500) NULL,
  avatar_id    CHAR(36)     NULL,
  featured     TINYINT(1)   NOT NULL DEFAULT 0,
  sort_order   INT          NOT NULL DEFAULT 0,
  status       ENUM('published','draft','review') NOT NULL DEFAULT 'draft',
  created_at   DATETIME(3)  NOT NULL,
  updated_at   DATETIME(3)  NOT NULL,
  KEY idx_testimonials_status (status),
  KEY idx_testimonials_order  (sort_order),
  CONSTRAINT fk_testimonials_avatar FOREIGN KEY (avatar_id) REFERENCES media(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------------
-- Gallery — albums of images from the media library.
-- --------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS gallery_albums (
  id          CHAR(36)     NOT NULL PRIMARY KEY,
  title       VARCHAR(160) NOT NULL,
  slug        VARCHAR(160) NOT NULL,
  description TEXT         NULL,
  -- The filter pills the gallery page renders: Campus, Classroom, Events…
  category    VARCHAR(80)  NOT NULL DEFAULT 'Campus',
  cover_id    CHAR(36)     NULL,
  sort_order  INT          NOT NULL DEFAULT 0,
  status      ENUM('published','draft','review') NOT NULL DEFAULT 'draft',
  created_at  DATETIME(3)  NOT NULL,
  updated_at  DATETIME(3)  NOT NULL,
  UNIQUE KEY uq_gallery_albums_slug (slug),
  KEY idx_gallery_albums_status (status),
  CONSTRAINT fk_gallery_albums_cover FOREIGN KEY (cover_id) REFERENCES media(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS gallery_images (
  id         CHAR(36)     NOT NULL PRIMARY KEY,
  album_id   CHAR(36)     NOT NULL,
  media_id   CHAR(36)     NOT NULL,
  -- Overrides the media library's own alt text for this placement. The same
  -- photo can caption differently in two albums.
  caption    VARCHAR(255) NOT NULL DEFAULT '',
  sort_order INT          NOT NULL DEFAULT 0,
  created_at DATETIME(3)  NOT NULL,
  KEY idx_gallery_images_album (album_id, sort_order),
  CONSTRAINT fk_gallery_images_album FOREIGN KEY (album_id) REFERENCES gallery_albums(id) ON DELETE CASCADE,
  -- CASCADE, not SET NULL: a tile whose image is gone is not a tile.
  CONSTRAINT fk_gallery_images_media FOREIGN KEY (media_id) REFERENCES media(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------------
-- Events — the campus calendar, with a page each.
-- --------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS events (
  id           CHAR(36)     NOT NULL PRIMARY KEY,
  title        VARCHAR(200) NOT NULL,
  slug         VARCHAR(200) NOT NULL,
  -- DATE, not DATETIME: an event is on a day, and `start_time` below carries
  -- the clock time as the editor wrote it ("09:30", "Day 1").
  event_date   DATE         NOT NULL,
  end_date     DATE         NULL,
  start_time   VARCHAR(40)  NULL,
  location     VARCHAR(200) NOT NULL DEFAULT '',
  event_type   ENUM('Summit','Workshop','Seminar','Drive','Webinar','Other') NOT NULL DEFAULT 'Workshop',
  excerpt      TEXT         NULL,
  body         MEDIUMTEXT   NULL,
  cover_id     CHAR(36)     NULL,
  -- Where to send someone who wants a seat. Optional: most events are walk-in.
  register_url VARCHAR(500) NULL,
  seats        VARCHAR(60)  NULL,
  fee          VARCHAR(60)  NULL,
  featured     TINYINT(1)   NOT NULL DEFAULT 0,
  status       ENUM('published','draft','review') NOT NULL DEFAULT 'draft',
  meta_title       VARCHAR(200) NULL,
  meta_description VARCHAR(300) NULL,
  created_at   DATETIME(3)  NOT NULL,
  updated_at   DATETIME(3)  NOT NULL,
  UNIQUE KEY uq_events_slug (slug),
  KEY idx_events_status (status),
  KEY idx_events_date   (event_date),
  CONSTRAINT fk_events_cover FOREIGN KEY (cover_id) REFERENCES media(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS event_agenda (
  id         CHAR(36)     NOT NULL PRIMARY KEY,
  event_id   CHAR(36)     NOT NULL,
  -- Free text, not a TIME: the site's own agendas read "09:30" for a one-day
  -- summit and "Day 1" for a four-day workshop. Both are what the editor means.
  time_label VARCHAR(60)  NOT NULL,
  item       VARCHAR(300) NOT NULL,
  sort_order INT          NOT NULL DEFAULT 0,
  KEY idx_event_agenda_event (event_id, sort_order),
  CONSTRAINT fk_event_agenda_event FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------------
-- Pages — new URLs, and copy overrides for routes that already exist.
-- --------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS pages (
  id      CHAR(36)     NOT NULL PRIMARY KEY,
  title   VARCHAR(200) NOT NULL,
  -- For a `custom` page this is the last segment of /pages/<slug>. For an
  -- `override` it is the site path being overridden ("about", "placement"),
  -- which is why it allows the slashes a nested route needs.
  slug    VARCHAR(200) NOT NULL,
  kind    ENUM('custom','override') NOT NULL DEFAULT 'custom',
  excerpt TEXT         NULL,
  body    MEDIUMTEXT   NULL,
  -- Heading copy for the page header. On an override these replace what the
  -- route hard-codes; left empty, the route keeps its own.
  hero_eyebrow VARCHAR(120) NULL,
  hero_title   VARCHAR(300) NULL,
  hero_body    TEXT         NULL,
  cover_id     CHAR(36)     NULL,
  -- Whether this page appears under Resources → Pages in the site nav. Not
  -- every page belongs in a menu; a landing page usually does not.
  show_in_nav  TINYINT(1)   NOT NULL DEFAULT 1,
  sort_order   INT          NOT NULL DEFAULT 0,
  status       ENUM('published','draft','review') NOT NULL DEFAULT 'draft',
  meta_title       VARCHAR(200) NULL,
  meta_description VARCHAR(300) NULL,
  created_at DATETIME(3) NOT NULL,
  updated_at DATETIME(3) NOT NULL,
  -- Scoped to `kind`: /pages/about and an override of the real /about are
  -- different records that would otherwise collide on the slug.
  UNIQUE KEY uq_pages_kind_slug (kind, slug),
  KEY idx_pages_status (status),
  CONSTRAINT fk_pages_cover FOREIGN KEY (cover_id) REFERENCES media(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

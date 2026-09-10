-- Brings the course catalogue into the CMS.
--
-- Migration 017 dropped the old Courses module because its schema had no
-- columns for what the website actually renders — "modules, projects, an
-- instructor block and student reviews". That reasoning was right, and the fix
-- is not to restore that schema but to build one shaped like the catalogue the
-- site really has, in `data/courses.ts`: 44 courses across 7 categories, each
-- with tools, a syllabus of modules and their topics, outcomes, careers and a
-- fee pair.
--
-- The thing that makes this module different from every other one here: a
-- course is not published at one address. `lib/routes.ts` derives roughly 150
-- URLs from this catalogue — `/python-course-in-chandigarh`,
-- `/python-training-in-chandigarh`, the after-12th pages, the category pages —
-- all keyed off `course_key`. That column is therefore the real identity of a
-- course, not the UUID primary key, and changing it moves every page for that
-- course.

-- --------------------------------------------------------------------------
-- Categories — the seven groups the courses page files everything under.
-- --------------------------------------------------------------------------
--
-- A separate table from `categories`, which belongs to the blog. They are
-- different things with different shapes: a blog category has a description and
-- a post count, a course category has a short label for a filter pill, a
-- marketing blurb and an icon. Sharing one table would mean every blog category
-- growing an icon column it has no use for.

CREATE TABLE IF NOT EXISTS course_categories (
  id         CHAR(36)     NOT NULL PRIMARY KEY,
  -- The site's own `CourseCategoryId` — "ai", "programming", "web". Stable and
  -- referenced in URLs, so renaming the display name never moves a page.
  slug       VARCHAR(60)  NOT NULL,
  -- "Artificial Intelligence & Data"
  name       VARCHAR(120) NOT NULL,
  -- "AI & Data" — the filter pill, where the full name does not fit.
  short_name VARCHAR(60)  NOT NULL,
  blurb      TEXT         NULL,
  -- Names an icon in the site's own set, not an uploaded file.
  icon       VARCHAR(60)  NOT NULL DEFAULT 'sparkles',
  sort_order INT          NOT NULL DEFAULT 0,
  status     ENUM('published','draft','review') NOT NULL DEFAULT 'draft',
  created_at DATETIME(3)  NOT NULL,
  updated_at DATETIME(3)  NOT NULL,
  UNIQUE KEY uq_course_categories_slug (slug),
  KEY idx_course_categories_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------------
-- Courses
-- --------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS courses (
  id          CHAR(36)     NOT NULL PRIMARY KEY,
  -- The site's short id — "python", "mern-stack-development". Every URL for
  -- this course is derived from it, so it is unique and changing it is a move.
  course_key  VARCHAR(80)  NOT NULL,
  name        VARCHAR(160) NOT NULL,
  category_id CHAR(36)     NULL,
  -- Free text, as displayed: "3 months", "45 days".
  duration    VARCHAR(60)  NOT NULL DEFAULT '',
  level       ENUM('Beginner','Beginner to Advanced','Intermediate','Advanced')
                NOT NULL DEFAULT 'Beginner to Advanced',
  summary     TEXT         NULL,
  -- The ribbon on the card: "Most popular", "New". NULL for most courses.
  badge       VARCHAR(40)  NULL,
  featured    TINYINT(1)   NOT NULL DEFAULT 0,
  -- Publishes the second URL, `<key>-training-in-<city>`, for the tracks that
  -- run as industrial training as well as a course.
  has_training TINYINT(1)  NOT NULL DEFAULT 0,
  hero_image_id CHAR(36)   NULL,
  -- Stored as whole rupees in two columns rather than one JSON blob, so the
  -- listing can sort and filter on price without unpacking every row. NULL
  -- means "fee on request", which is different from zero.
  fee_original INT UNSIGNED NULL,
  fee_offer    INT UNSIGNED NULL,
  sort_order  INT          NOT NULL DEFAULT 0,
  status      ENUM('published','draft','review') NOT NULL DEFAULT 'draft',
  meta_title       VARCHAR(200) NULL,
  meta_description VARCHAR(300) NULL,
  created_at  DATETIME(3)  NOT NULL,
  updated_at  DATETIME(3)  NOT NULL,
  UNIQUE KEY uq_courses_key (course_key),
  KEY idx_courses_status   (status),
  KEY idx_courses_category (category_id),
  -- SET NULL, not CASCADE: deleting a category must not delete the courses in
  -- it. They surface as uncategorised, which is visible and recoverable.
  CONSTRAINT fk_courses_category FOREIGN KEY (category_id)
    REFERENCES course_categories(id) ON DELETE SET NULL,
  CONSTRAINT fk_courses_hero FOREIGN KEY (hero_image_id)
    REFERENCES media(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------------
-- The list-shaped parts of a course.
-- --------------------------------------------------------------------------
--
-- Child tables rather than JSON columns. The site renders each of these as an
-- ordered list and the form reorders them, so `sort_order` has to be a column
-- something can sort by; a JSON array would push both the ordering and the
-- validation into application code for no gain.

CREATE TABLE IF NOT EXISTS course_tools (
  id         CHAR(36)     NOT NULL PRIMARY KEY,
  course_id  CHAR(36)     NOT NULL,
  tool       VARCHAR(80)  NOT NULL,
  sort_order INT          NOT NULL DEFAULT 0,
  KEY idx_course_tools_course (course_id, sort_order),
  CONSTRAINT fk_course_tools_course FOREIGN KEY (course_id)
    REFERENCES courses(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS course_modules (
  id         CHAR(36)     NOT NULL PRIMARY KEY,
  course_id  CHAR(36)     NOT NULL,
  title      VARCHAR(200) NOT NULL,
  sort_order INT          NOT NULL DEFAULT 0,
  KEY idx_course_modules_course (course_id, sort_order),
  CONSTRAINT fk_course_modules_course FOREIGN KEY (course_id)
    REFERENCES courses(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS course_module_topics (
  id         CHAR(36)     NOT NULL PRIMARY KEY,
  module_id  CHAR(36)     NOT NULL,
  topic      VARCHAR(300) NOT NULL,
  sort_order INT          NOT NULL DEFAULT 0,
  KEY idx_course_topics_module (module_id, sort_order),
  CONSTRAINT fk_course_topics_module FOREIGN KEY (module_id)
    REFERENCES course_modules(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Outcomes ("what you will be able to do") and careers ("roles this leads to")
-- share a shape, so they share a table and are told apart by `kind`. Two
-- tables identical but for their name would drift.
CREATE TABLE IF NOT EXISTS course_points (
  id         CHAR(36)     NOT NULL PRIMARY KEY,
  course_id  CHAR(36)     NOT NULL,
  kind       ENUM('outcome','career') NOT NULL,
  text       VARCHAR(300) NOT NULL,
  sort_order INT          NOT NULL DEFAULT 0,
  KEY idx_course_points_course (course_id, kind, sort_order),
  CONSTRAINT fk_course_points_course FOREIGN KEY (course_id)
    REFERENCES courses(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

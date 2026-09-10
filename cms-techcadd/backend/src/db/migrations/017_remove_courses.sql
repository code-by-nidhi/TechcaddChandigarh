-- Removes the Courses module.
--
-- The website builds its course pages from its own catalogue in
-- `techcadd-hero/src/lib/courses` — 39 courses, with modules, projects, an
-- instructor block and student reviews that this schema has no columns for.
-- Nothing entered here ever reached a visitor, so the form was one that looked
-- like it published a page and did not.
--
-- Destructive, and there are no down-migrations. Take a dump first:
--
--   mysqldump -u root -p techcadd_cms > backup-before-017.sql
--
-- --------------------------------------------------------------------------
-- Enquiries keep the course they name, as text.
-- --------------------------------------------------------------------------
--
-- `course_name` stays: it is what the public forms actually send, what the
-- enquiries list displays, and what the counselling team reads. `course_id` was
-- the link to a record that will no longer exist — and, like `branch_id` before
-- it, nothing outside the CMS ever set it.

ALTER TABLE enquiries DROP FOREIGN KEY fk_enquiries_course;
DROP INDEX idx_enquiries_course ON enquiries;
ALTER TABLE enquiries DROP COLUMN course_id;

-- --------------------------------------------------------------------------
-- The module, children before parent.
-- --------------------------------------------------------------------------
--
-- `course_sections` is included because it points at `courses` and would block
-- the drop. It arrived from a migration that is not in this repository, has no
-- API, no form and no reader on this branch, and is empty.

DROP TABLE IF EXISTS course_sections;
DROP TABLE IF EXISTS course_gallery;
DROP TABLE IF EXISTS course_highlights;
DROP TABLE IF EXISTS course_syllabus;
DROP TABLE IF EXISTS courses;

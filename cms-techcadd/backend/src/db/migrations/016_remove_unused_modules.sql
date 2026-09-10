-- Removes the tables and columns nothing reads.
--
-- Every table dropped here is from the original Jalandhar CMS, which managed a
-- multi-branch institute with its own faculty pages, promotional banners, photo
-- albums and free-form content pages. The TechCADD Hoshiarpur site renders none
-- of that: the modules were taken out of the sidebar and the API some time ago
-- (see the note in `frontend/src/data/navigation.ts`), leaving the tables behind
-- with no route, no form and no reader.
--
-- Kept deliberately: `course_syllabus`, `course_highlights` and `course_gallery`
-- are the course form's own child tables and are very much in use.
--
-- This is destructive and there are no down-migrations. Take a dump first:
--
--   mysqldump -u root -p techcadd_cms > backup-before-016.sql
--
-- --------------------------------------------------------------------------
-- Enquiries: the last live reference to `branches`.
-- --------------------------------------------------------------------------
--
-- `branch_id` pointed at a table that is about to stop existing, and
-- `branch_name` was never written by anything — the enquiry schema has no such
-- field, so the value the public endpoint accepted was discarded on the way to
-- the INSERT. Hoshiarpur is one campus; there is nothing for either to hold.

ALTER TABLE enquiries DROP FOREIGN KEY fk_enquiries_branch;
DROP INDEX idx_enquiries_branch ON enquiries;
ALTER TABLE enquiries
  DROP COLUMN branch_id,
  DROP COLUMN branch_name;

-- --------------------------------------------------------------------------
-- Settings: three notification preferences nothing acted on.
-- --------------------------------------------------------------------------
--
-- The switches saved and no mail was ever sent — there is no new-enquiry email,
-- no digest job and no publish hook. A preference a CMS stores and ignores is
-- worse than one it does not offer, because the only way to discover it does
-- nothing is to miss a lead waiting for a notification that never comes.

ALTER TABLE settings DROP COLUMN notifications;

-- --------------------------------------------------------------------------
-- The unused modules, children before parents.
-- --------------------------------------------------------------------------

DROP TABLE IF EXISTS course_branches;

DROP TABLE IF EXISTS branch_photos;
DROP TABLE IF EXISTS branch_hours;
DROP TABLE IF EXISTS branch_phones;

DROP TABLE IF EXISTS faculty_expertise;

DROP TABLE IF EXISTS gallery_images;
DROP TABLE IF EXISTS gallery_albums;

DROP TABLE IF EXISTS banners;
DROP TABLE IF EXISTS testimonials;
DROP TABLE IF EXISTS pages;
DROP TABLE IF EXISTS redirects;

-- `faculty` and `branches` reference each other — a trainer belongs to a
-- branch, a branch has a trainer as its manager — so neither can be dropped
-- while the other's foreign key still points at it.
ALTER TABLE faculty  DROP FOREIGN KEY fk_faculty_branch;
ALTER TABLE branches DROP FOREIGN KEY fk_branches_manager;

DROP TABLE IF EXISTS faculty;
DROP TABLE IF EXISTS branches;

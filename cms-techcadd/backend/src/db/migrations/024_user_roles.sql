-- Three roles, because the institute has three kinds of person using the CMS.
--
-- Migration 010 collapsed the original three roles into one, correctly at the
-- time: everyone with a login was the same person's team. That is no longer
-- true. Content is written by one group and enquiries are answered by another,
-- and neither should be able to disturb the other's work — a counsellor who
-- opens a half-written blog post and saves it has published it.
--
--   admin      — everything, including adding and removing people.
--   content    — every content module, and nothing about enquiries.
--   counsellor — enquiries and subscribers, and no content at all.
--
-- content and counsellor are siblings, not a ladder: neither is "more" than
-- the other, so there is no rank to compare. What each may touch is a table,
-- and it lives in src/middleware/moduleAccess.ts rather than here, because a
-- module is an application concept the database has no opinion about.
--
-- Existing accounts stay admin. The default for a new row is `content`: the
-- narrower grant is the safer thing to get by accident, and the CMS form
-- always sends a role explicitly anyway.

ALTER TABLE users
  MODIFY role ENUM('admin','content','counsellor') NOT NULL DEFAULT 'content';

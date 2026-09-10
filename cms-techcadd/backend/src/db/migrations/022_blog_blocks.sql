-- Blog posts get the same block builder as pages.
--
-- A post was one rich-text document, so an author had no way to place an
-- image, embed a video, or drop a "book a demo" panel halfway down — the same
-- gap Pages had before migration 021, and the same fix.
--
-- `body` stays and is still rendered when a post has no blocks, so every post
-- written before this keeps working untouched.
--
-- See migration 021 for why this is a JSON column rather than a child table:
-- blocks are only ever read whole and in order, each type carries different
-- fields, and reordering is one column write instead of an UPDATE per row.

ALTER TABLE blogs
  ADD COLUMN blocks JSON NULL AFTER body;

-- Page content as blocks.
--
-- `pages.body` is one rich-text document, which is fine for prose and useless
-- for anything else: an editor who wants a picture, a call-to-action panel or
-- a row of recent posts has nowhere to put them. That gap is also why pages
-- were coming out blank — the single Content editor sits below the fold, and
-- copy typed into Summary instead simply never appeared in the body.
--
-- Stored as JSON rather than a `page_blocks` table, deliberately:
--
--   * The blocks of a page are only ever read as a whole, in order, and always
--     with their page. There is no query that wants "every image block" or
--     "blocks 3 to 5", so the joins a child table buys would pay for nothing.
--   * Each type carries different fields. A table would need either a column
--     per field of every type — mostly NULL — or a JSON column anyway.
--   * Reordering is a rewrite of one column instead of an UPDATE per row.
--
-- `body` stays. Pages written before this still render, and the site falls back
-- to it when a page has no blocks — see the renderer on the website.

ALTER TABLE pages
  ADD COLUMN blocks JSON NULL AFTER body;

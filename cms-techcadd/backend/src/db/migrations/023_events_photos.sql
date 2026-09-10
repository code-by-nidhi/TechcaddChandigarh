-- Events become a record of what the institute ran, not a ticketing page.
--
-- The module was built around signing up: a registration link, a fee and a
-- seat count. That is not what these pages are for. An event here is mostly
-- something that already happened — a summit, a workshop, a placement drive —
-- and the page exists so a prospective student can see that the institute
-- runs them and what they were like. Nobody registers for last September.
--
-- So the three booking fields go, and a photo set arrives. Photographs are the
-- point of an event page after the fact; a paragraph describing a summit
-- convinces nobody the summit happened.
--
-- Destructive on three columns. They held placeholder values only — the seed
-- set none, and what was there came from testing — but take a dump first if
-- this is being applied anywhere real:
--
--   mysqldump -u root -p techcadd_cms events > backup-before-023.sql

ALTER TABLE events
  DROP COLUMN register_url,
  DROP COLUMN fee,
  DROP COLUMN seats;

-- --------------------------------------------------------------------------
-- Photographs.
-- --------------------------------------------------------------------------
--
-- JSON rather than a child table, for the same reasons as page blocks in 021:
-- the set is only ever read whole and in order, always with its event, and
-- reordering is one column write instead of an UPDATE per row.
--
-- Each entry is `{ id, url, alt, caption }` — the media id is what is stored,
-- and the rest travels with it so a gallery renders without a second lookup.
-- `cover_id` stays as the single image the listing card uses.

ALTER TABLE events
  ADD COLUMN photos JSON NULL AFTER cover_id;

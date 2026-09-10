-- A link to the review as it stands on Google.

-- Reconstructed. This migration had been applied to the development database
-- but its file was never committed, so the schema a fresh clone builds and the
-- schema actually running had drifted apart — `npm run db:migrate` produced a
-- `reviews` table with no `google_url` in it, and every read of that column
-- would have failed on a new machine. The column definition below is taken from
-- the live table, so both now describe the same thing.
--
-- Named to match the row already in `schema_migrations`, which is what stops it
-- running a second time against the database that has it.

ALTER TABLE reviews
  /*
    The public URL of the review on Google.

    Optional, and independent of `source`: a review can be genuinely Google's
    without anyone having pasted the link to it, and the card falls back to
    showing no link rather than to a search that might land anywhere.

    500 characters because a Google review URL carries the place id and the
    review id and is routinely past 200.
  */
  ADD COLUMN google_url VARCHAR(500) NULL AFTER source;

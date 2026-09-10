-- Keywords for events, pages and courses.
--
-- All four content forms render the same `<SeoFields />`, keywords box
-- included, but only `blogs` ever had a column to put them in. So keywords
-- typed on an event were accepted by the form, dropped by the API and gone on
-- the next load — with nothing anywhere saying so.
--
-- It was also why an existing event could not be saved at all. The form's
-- schema requires `seo.keywords` to be an array; the API, having nowhere to
-- read it from, returned no such field; loading a record for editing therefore
-- produced a validation error on a field the editor could not see was at
-- fault, and the form reported only "check the highlighted fields below".
--
-- Adding the column is the honest fix: the box has been offering to store
-- keywords, so it should store them.

ALTER TABLE events ADD COLUMN meta_keywords JSON NULL AFTER meta_description;
ALTER TABLE pages ADD COLUMN meta_keywords JSON NULL AFTER meta_description;
ALTER TABLE courses ADD COLUMN meta_keywords JSON NULL AFTER meta_description;

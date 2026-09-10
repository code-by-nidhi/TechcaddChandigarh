-- A username to sign in with.
--
-- The CMS is operated by one administrator who signs in with a name rather than
-- an address. Until now the only identifier was `email`, so the login form had
-- to ask for "email or username" and mean only the first.
--
-- `email` stays. It is still the account's contact address, it is what a byline
-- is attributed to, and leaving it as an accepted identifier means changing the
-- username can never lock the only administrator out of the CMS.

ALTER TABLE users
  /*
    Case-insensitive by collation, like the email beside it: somebody typing
    `TechCADD-CHD` at a login screen has not got their username wrong.
    NULL is allowed so an account can exist without one — the unique index
    permits multiple NULLs, only duplicate names are refused.
  */
  ADD COLUMN username VARCHAR(60) NULL AFTER name,
  ADD UNIQUE KEY uq_users_username (username);

-- Snapshot of the `enquiries` table the site writes to.
--
-- NOT the source of truth. The `techcadd` database is managed by Prisma from
-- another project (see `_prisma_migrations`), which also owns `demo_bookings`.
-- This file exists so a fresh machine can create a matching table for local
-- development; if the owning project changes the schema, re-snapshot with:
--
--   mysqldump -u root --no-data techcadd enquiries
--
-- To set up a new local database:
--
--   "C:\xampp\mysql\bin\mysql.exe" -u root < db/schema.sql
--
-- Notes for anyone writing to this table by hand:
--   * `id` is a char(36) UUID with no auto-increment — generate it yourself.
--   * `created_at` / `updated_at` are NOT NULL with no default — pass NOW(3).
--   * `source` is the lead *channel*; which form was used is `form_type`.
--   * `course_id` is a key for a courses table that is not in this database,
--     so the site leaves it NULL and fills `course_name` instead.

CREATE DATABASE IF NOT EXISTS techcadd
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE techcadd;

CREATE TABLE IF NOT EXISTS enquiries (
  id           char(36)     NOT NULL,
  student_name varchar(120) NOT NULL,
  phone        varchar(30)  NOT NULL,
  email        varchar(254) DEFAULT NULL,
  course_id    char(36)     DEFAULT NULL,
  course_name  varchar(200) NOT NULL DEFAULT '',
  source       enum('website','walk-in','phone','referral','social')
               NOT NULL DEFAULT 'website',
  form_type    varchar(32)  DEFAULT NULL,
  source_url   varchar(500) DEFAULT NULL,
  ip           varchar(45)  DEFAULT NULL,
  user_agent   varchar(255) DEFAULT NULL,
  message      text         DEFAULT NULL,
  status       enum('new','contacted','follow-up','converted','closed')
               NOT NULL DEFAULT 'new',
  created_at   datetime(3)  NOT NULL,
  updated_at   datetime(3)  NOT NULL,

  PRIMARY KEY (id),
  KEY idx_enquiries_status (status),
  KEY idx_enquiries_created (created_at),
  KEY idx_enquiries_phone_created (phone, created_at),
  KEY idx_enquiries_ip_created (ip, created_at)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;

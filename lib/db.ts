import mysql from "mysql2/promise";

/**
 * Server-only MySQL access. Never import this from a `"use client"` file —
 * the driver is a Node module and will not bundle for the browser.
 *
 * The pool is cached on `globalThis` because `next dev` re-evaluates modules
 * on every hot reload, and a fresh pool per reload would leak connections
 * until MySQL starts refusing them.
 */

const globalForDb = globalThis as typeof globalThis & {
  __techcaddPool?: mysql.Pool;
};

function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Missing ${name}. Copy .env.example to .env.local and fill in the MySQL credentials.`,
    );
  }
  return value;
}

function createPool(): mysql.Pool {
  return mysql.createPool({
    host: process.env.MYSQL_HOST ?? "127.0.0.1",
    port: Number(process.env.MYSQL_PORT ?? 3306),
    user: required("MYSQL_USER"),
    password: process.env.MYSQL_PASSWORD ?? "",
    database: required("MYSQL_DATABASE"),

    // Set MYSQL_SSL=true when the database is reached over the internet
    // (PlanetScale, RDS, Aiven). Local and same-host MySQL needs no TLS.
    ssl: process.env.MYSQL_SSL === "true" ? { rejectUnauthorized: true } : undefined,

    waitForConnections: true,
    connectionLimit: Number(process.env.MYSQL_POOL_SIZE ?? 5),
    queueLimit: 0,
    connectTimeout: 10_000,
    charset: "utf8mb4_unicode_ci",
    // Keeps DATETIME/TIMESTAMP values as JS Dates rather than strings.
    dateStrings: false,
  });
}

export function getPool(): mysql.Pool {
  if (!globalForDb.__techcaddPool) {
    globalForDb.__techcaddPool = createPool();
  }
  return globalForDb.__techcaddPool;
}

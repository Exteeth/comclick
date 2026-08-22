/**
 * Neon Serverless PostgreSQL Database Connector
 * 
 * Note: When DATABASE_URL or NEON_DATABASE_URL is provided in .env.local,
 * this client seamlessly connects to Neon Serverless Postgres.
 * If not connected yet, the application seamlessly runs using the local storage / in-memory store.
 */

import { neon } from "@neondatabase/serverless";

export const isNeonConfigured = (): boolean => {
  return Boolean(process.env.DATABASE_URL || process.env.NEON_DATABASE_URL);
};

export const getDbUrl = (): string | undefined => {
  return process.env.DATABASE_URL || process.env.NEON_DATABASE_URL;
};

/**
 * Returns a Neon SQL execution function if DATABASE_URL is present, or null.
 */
export const getNeonSql = () => {
  const url = getDbUrl();
  if (!url) return null;
  try {
    return neon(url);
  } catch (err) {
    console.error("Failed to initialize Neon SQL client:", err);
    return null;
  }
};

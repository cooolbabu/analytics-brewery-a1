import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";

export const db = new createPrismaClient();

/** @returns {PrismaClient} */
function createPrismaClient() {
  globalThis.prismaClient =
    globalThis.prismaClient ||
    new PrismaClient({
      //log: [{ emit: "stdout", level: "query" }],
    });
  return globalThis.prismaClient;
}

export const supabaseClientPool = createSupabaseClient();

/**
 *
 * @returns {Pool}
 */
function createSupabaseClient() {
  if (!globalThis.supabaseClientPool) {
    globalThis.supabaseClientPool = new Pool({
      user: process.env.DB_USER,
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      password: process.env.DB_PASSWORD,
      port: 5432, // Default port for PostgreSQL
      max: 20, // Set the maximum number of clients in the pool
      idleTimeoutMillis: 30000, // Idle clients will be closed after 30 seconds
      connectionTimeoutMillis: 5000, // Connection timeout after 5 seconds
    });
  }
  return globalThis.supabaseClientPool;
}

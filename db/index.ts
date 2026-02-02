import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

import * as schema from './schema';

/**
 * PostgreSQL connection pool.
 * Uses the DATABASE_URL environment variable for connection.
 */
const pool = new Pool({
    connectionString: process.env.DATABASE_URL!,
});

/**
 * Drizzle ORM database instance connected to PostgreSQL.
 * Uses the DATABASE_URL environment variable for connection.
 * Configured with the application schema for type-safe queries.
 *
 * @see schema - Database schema definitions
 */
export const db: NodePgDatabase<typeof schema> = drizzle(pool, { schema });

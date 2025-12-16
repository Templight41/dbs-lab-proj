import { Pool, QueryResult } from 'pg';

let pool: Pool | null = null;

// Get or create database connection pool
export function getPool(): Pool {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.POSTGRES_URL,
    });
  }
  return pool;
}

// Execute a query with parameters
export async function query<T = any>(
  text: string,
  params?: any[]
): Promise<QueryResult<T>> {
  const pool = getPool();
  return pool.query<T>(text, params);
}

// Close the pool (useful for cleanup)
export async function closePool(): Promise<void> {
  if (pool) {
    await pool.end();
    pool = null;
  }
}

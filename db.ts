
import "dotenv/config";
import pg from "pg";

const { Pool, types } = pg;

// PostgreSQL data type parsers
types.setTypeParser(1700, (value: string) => Number(value)); // NUMERIC
types.setTypeParser(20, (value) => Number(value));   // BIGINT
types.setTypeParser(1082, (value) => value);         // DATE

// Validate environment variables
const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  throw new Error(
    "DATABASE_URL is not set. Copy .env.example to .env and configure it."
  );
}

// PostgreSQL connection pool
export const pool = new Pool({
  connectionString: DATABASE_URL,
  max: 10,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 10_000,
  ssl:
    process.env.DATABASE_SSL === "true"
      ? { rejectUnauthorized: false }
      : undefined,
});

// Handle unexpected pool errors
pool.on("error", (err: Error) => {
  console.error("Unexpected PostgreSQL pool error:", err);
});

// Test PostgreSQL connection
export async function testConnection() {
  const { rows } = await pool.query(`
    SELECT
      current_database() AS db,
      version() AS pg
  `);

  // Check whether PostGIS is installed
  let postgis = "Not installed";

  try {
    const result = await pool.query(
      "SELECT PostGIS_Version() AS postgis"
    );

    postgis = result.rows[0].postgis;
  } catch (error) {
    console.warn("PostGIS extension is not available.");
  }

  return {
    db: rows[0].db,
    pg: rows[0].pg,
    postgis,
  };
}

// Graceful database shutdown
export async function closeDatabase() {
  await pool.end();
  console.log("PostgreSQL connection pool closed.");
}

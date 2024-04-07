import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

function printEnv() {
  console.log(process.env.DB_USER);
  console.log(process.env.DB_HOST);
  console.log(process.env.DB_NAME);
}

// Function to retrieve data
async function retrieveData() {
  // Configure the connection parameters

  const { Pool } = pg;
  const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: 5432, // Default port for PostgreSQL
  });

  console.log(process.env.DB_USER);
  // Connect to the database
  const client = await pool.connect();
  try {
    // Execute a query
    const result = await client.query('SELECT count(*) FROM "Customer"');

    // Log the result
    console.log(result.rows);

    // Release the client back to the pool
    client.release();
  } catch (err) {
    console.error("Error executing query", err.stack);
    client.release();
  }
}

// Call the function to retrieve data
retrieveData();
//printEnv();

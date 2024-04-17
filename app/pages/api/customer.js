import { Pool } from "pg";

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

export default async function handler(req, res) {
  console.log("Hello from the Customers API");
  console.log(process.env.DB_USER);
  console.log(process.env.DB_HOST);
  console.log(process.env.DB_NAME);

  const client = await pool.connect();
  try {
    let queryStr = 'SELECT * FROM "Customers" LIMIT 5;';
    const result = await client.query(queryStr); // Adjust SQL as needed
    console.log(result.rows);
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  } finally {
    client.release();
  }
}

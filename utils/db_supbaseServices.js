import pg from "pg";

export function SayHelloFromSupabaseServices() {
  console.log("Hello from db_supbaseServices.js!");
}

/**
 * Retrieves data from Supabase using the provided query.
 * @param {string} query - The SQL query to execute.
 * @returns {Promise<void>} - A promise that resolves when the data retrieval is complete.
 */
export async function retrieveDataFromSupabase(query) {
  // Configure the connection pool
  const pool = new pg.Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT || 5432, // Default port for PostgreSQL
    max: 20, // Set the maximum number of clients in the pool
    idleTimeoutMillis: 30000, // Idle clients will be closed after 30 seconds
    connectionTimeoutMillis: 2000, // Connection timeout after 2 seconds
  });

  let client;

  try {
    // Acquire a client from the pool
    client = await pool.connect();

    const sqlResult = await client.query(query);

    // Log the result
    console.log(sqlResult.rows);
    const jsonObject = JSON.stringify(sqlResult.rows);
    console.log(jsonObject);

    return jsonObject;

    // Convert sqlResult to a JSON object
    // const jsonData = {
    //   rows: sqlResult.rows,
    //   rowCount: sqlResult.rowCount,
    //   command: sqlResult.command,
    //   oid: sqlResult.oid,
    //   fields: sqlResult.fields.map((field) => ({
    //     name: field.name,
    //     dataTypeID: field.dataTypeID,
    //     dataTypeSize: field.dataTypeSize,
    //     dataTypeModifier: field.dataTypeModifier,
    //   })),
    // };

    // console.log(jsonData);
  } catch (err) {
    console.error("Error executing query", err);
  } finally {
    // Release the client back to the pool
    if (client) {
      client.release();
    }
  }

  // Terminate the pool after use
  await pool.end();
}

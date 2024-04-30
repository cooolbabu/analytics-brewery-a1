import { Pool } from "pg";

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

/**
 * Queries data from Supabase.
 * @param {string} queryStr - The SQL query string.
 * @param {string} [format="sqlRows"] - The format of the returned data. Possible values are "sqlRows" and "json".
 * @returns {Promise<Array<Object>>|Promise<string>|Promise<{error: string}>} - The queried data in the specified format, or an error object if something went wrong.
 */
export async function QueryDataFromSupabase(queryStr, format = "sqlRows") {
  try {
    //await new Promise((resolve) => setTimeout(resolve, 3000)); // Add a 3-second delay

    const client = supabaseClientPool;
    //console.log("getCustomerInformation: client", client);
    const sqlResult = await client.query(queryStr);
    // console.log("queryDataFromSupabase: sqlResult.rows ", sqlResult.rows);
    const jsonObject = JSON.stringify(sqlResult.rows);
    // console.log("getCustomerInformation: jsonObject", jsonObject);

    if (format === "sqlRows") {
      return sqlResult.rows;
    } else if (format === "json") {
      return jsonObject;
    }
  } catch (error) {
    console.log(error);
    return { error: "getCustomerInformation()::Something went wrong" };
  }
}

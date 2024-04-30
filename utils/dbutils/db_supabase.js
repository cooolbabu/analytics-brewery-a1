"use server";
import pg from "pg";
import { generateSimpleGUID } from "../baseUtitls";

/**
 * Handles standard error scenarios and returns an error object.
 *
 * @param {string} errorMsg - The error message to be included in the error object.
 * @returns {Object} - An error object containing a unique identifier and the error message.
 */
function standardErrorHandling(errorMsg, error = null) {
  const errorGUID = generateSimpleGUID();
  // console.log(errorGUID, error);

  let errorString = `Message: ${error.message}
    Error Hint: ${error.hint}
    Error code: ${error.code}
    Error detail: ${error.detail}
    Error position: ${error.position}
    Error schema: ${error.schema}
    Error table: ${error.table}
    Error column: ${error.column}
    Error where: ${error.where}
    Error constraint: ${error.constraint}
    Error file: ${error.file}
    Error line: ${error.line}
    Error routine: ${error.routine}
    Error GUID: ${errorGUID}
    Error Stack: ${error.stack.slice(0, 400)}
    `;

  return { errorMsg: errorString, errorGUID: errorGUID };
}

/**
 * Creates a Supabase client pool for connecting to the database.
 * @returns {Promise<Pool>} A promise that resolves to the Supabase client pool.
 * @throws {Error} If the required environment variables are not set.
 */
export async function createSupabaseClient() {
  const { Pool } = pg;
  try {
    console.log("createSupabaseClient(): env details", process.env.DB_USER, process.env.DB_HOST, process.env.DB_NAME);
    if (!process.env.DB_USER || !process.env.DB_HOST || !process.env.DB_NAME || !process.env.DB_PASSWORD) {
      throw new Error("createSupabaseClient() Environment variables not set");
    }
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
  } catch (error) {
    const errObject = standardErrorHandling(error.message, error);
    return errObject;
  }
  return globalThis.supabaseClientPool;
}

/**
 * Displays the environment variables and executes a SQL query using Supabase client.
 * Used for testing the connection to the database.
 * @returns {string} A message indicating the result of displaying environment variables.
 */
export async function displayEnvironmentVariables() {
  console.log("displayEnvironmentVariables Environment Variables:");
  console.log("DB_USER:", process.env.DB_USER);
  console.log("DB_HOST:", process.env.DB_HOST);
  console.log("DB_NAME:", process.env.DB_NAME);
  console.log("DB_PASSWORD:", process.env.DB_PASSWORD);

  try {
    const connPool = await createSupabaseClient();
    const client = await connPool.connect();
    const sqlResult = await client.query('SELECT * FROM "Customer"');
    await client.release();
    console.log("displayEnvironmentVariables: sqlResult ", sqlResult);
  } catch (error) {
    const errObject = standardErrorHandling("QueryDataFromSupabase()::Something went wrong", error);
    return errObject;
  }

  return "Environment Variables displayed in console";
}

/**
 * Queries data from Supabase.
 *
 * @param {string} queryStr - The SQL query string to execute.
 * @param {string} [format="sqlRows"] - The format of the returned data. Possible values are "sqlRows" and "json".
 * @returns {Promise<Object>} The result of the query.
 * @property {string|boolean} status - The status of the query. If "success", the query was successful. If false, an error occurred.
 * @property {number} noOfRows - The number of rows returned by the query on success.
 * @property {string|Array<Object>} message - Query result rows as an array on success. Error message string on failure.
 */
export async function QueryDataFromSupabase(queryStr, format = "sqlRows") {
  try {
    //await new Promise((resolve) => setTimeout(resolve, 3000)); // Add a 3-second delay
    // console.log("QueryDataFromSupabase: queryStr", queryStr);
    // console.log("QueryDataFromSupabase: format", format);

    const client = await createSupabaseClient();

    if (!queryStr) {
      return null;
    }

    const sqlResult = await client.query(queryStr);
    // console.log(
    //   "QueryDataFromSupabase: sqlResult rowCount ",
    //   sqlResult.rowCount,
    //   sqlResult.rowCount === 0,
    //   sqlResult.rows.length
    // );

    console.log("QueryDataFromSupabase: sqlResult count ", sqlResult.rowCount);

    if (format === "sqlRows") {
      if (sqlResult.rowCount === 0) {
        return { status: "success", noOfRows: 0, message: "No results to display" };
      } else return { status: true, noOfRows: sqlResult.rowCount, message: sqlResult.rows };
    } else if (format === "json") {
      const jsonObject = JSON.stringify(sqlResult.rows);
      //console.log("QueryDataFromSupabase: jsonObject", jsonObject);
      return {
        status: "success",
        noOfRows: 0,
        message: "JSON object request cannot be satisfied at the moment. TODO: Implement logic",
      };
    }
  } catch (error) {
    const errObject = standardErrorHandling("QueryDataFromSupabase()::Something went wrong", error);
    //console.log("QueryDataFromSupabase: errObject", errObject);
    return { status: false, noOfRows: 0, message: errObject.errorMsg };
  }
}

/**
 * Inserts a row into the Supabase database using the provided query string and values.
 *
 * @param {string} queryStr - The SQL query string to execute.
 * @param {Array} values - The values to be used in the query.
 * @returns {Promise} A promise that resolves to the result of the SQL query.
 *                    If an error occurs, it resolves to an object with an 'error' property.
 */
export async function InsertRowSupabase(queryStr, values) {
  await new Promise((resolve) => setTimeout(resolve, 3000)); // Add a 3-second delay
  try {
    const client = await createSupabaseClient();
    // console.log("InsertRowSupabase: client", queryStr, values);
    const sqlResult = await client.query(queryStr, values);
    // console.log("InsertRowSupabase: sqlResult ", sqlResult);
    return sqlResult;
  } catch (error) {
    const errObject = standardErrorHandling("QueryDataFromSupabase()::Something went wrong", error);

    return errObject;
  }
}

/**
 * Updates a row in the Supabase database.
 *
 * @param {string} queryStr - The SQL query string to execute.
 * @param {Array} values - The values to be used in the query.
 * @returns {Promise<Object>} - A promise that resolves to the result of the update operation.
 */
export async function UpdateRowSupabase(queryStr, values) {
  try {
    const client = createSupabaseClient();
    // console.log("UpdateRowSupabase: client", queryStr, values);
    const sqlResult = await client.query(queryStr, values);
    // console.log("UpdateRowSupabase: sqlResult ", sqlResult);
    return sqlResult;
  } catch (error) {
    const errObject = standardErrorHandling("QueryDataFromSupabase()::Something went wrong", error);
    return errObject;
  }
}

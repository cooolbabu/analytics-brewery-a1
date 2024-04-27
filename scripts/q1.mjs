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
    // Execute a query
    let queryStr = `
    WITH CustomerSales AS (
      SELECT
        C."CustomerId",
        C."FirstName",
        C."LastName",
        NVL(SUM(IL.Quantity * IL."UnitPrice"), 0) AS TotalSales /* Calculate the total sales for each customer by summing the product of quantity and unit price for each invoice line associated with their invoices */
      FROM "Invoice" AS I
      JOIN "Customer" AS C
        ON I."CustomerId" = C."CustomerId"
      JOIN "InvoiceLine" AS IL
        ON I."InvoiceId" = IL."InvoiceId"
      GROUP BY
        C."CustomerId",
        C."FirstName",
        C."LastName"
    )
    SELECT
      "FirstName",
      "LastName",
      TotalSales
    FROM CustomerSales
    ORDER BY
      TotalSales DESC
    LIMIT 10;
`;

    console.log(queryStr);
    const result = await client.query(queryStr);

    // Log the result
    console.log(result.rows);

    // Release the client back to the pool
    client.release();
  } catch (err) {
    console.error("Error executing query");
    console.log("\nError Message : \n\t", err.message);
    console.log("\nError Stack : \n\t", err.stack);
    console.log("\nError hint : \n\t", err.hint);
    console.log("\nError hint : \n\t", err);
    console.log("\n\n\nError breakdown using switch");

    let errorString = `Message: ${err.message}
    Error Hint: ${err.hint}
    Error code: ${err.code}
    Error detail: ${err.detail}
    Error position: ${err.position}
    Error schema: ${err.schema}
    Error table: ${err.table}
    Error column: ${err.column}
    Error where: ${err.where}
    Error constraint: ${err.constraint}
    Error file: ${err.file}
    Error line: ${err.line}
    Error routine: ${err.routine}
    Error Stack: ${err.stack.slice(0, 200)}
    `;
    console.log(errorString);

    client.release();
  }
}

// Call the function to retrieve data
retrieveData();
//printEnv();

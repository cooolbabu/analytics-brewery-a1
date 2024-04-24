"use server";
import sql from "mssql";

const config = {
  user: "username",
  password: "password",
  server: "your_server_address", // You can use 'localhost\\instance' if you're connecting to an instance.
  database: "your_database_name",
  options: {
    encrypt: true, // Use this if you're on Windows Azure.
    enableArithAbort: true, // This is recommended to avoid certain SQL Server issues.
  },
};

export async function getData() {
  try {
    // make sure that any items are correctly URL encoded in the connection string
    await sql.connect(config);
    const result = await sql.query`SELECT * FROM your_table_name`;
    console.log(result.recordset); // result.recordset contains the records.
  } catch (err) {
    console.error("SQL error", err);
  }
}

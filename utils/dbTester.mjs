import dotenv from "dotenv";
// import { retrieveDataFromSupabase } from "../../utils/db_supbaseServices";
import supabaseClientPool from "../lib/db.js";

dotenv.config();

function printEnv() {
  console.log(process.env.DB_USER);
  console.log(process.env.DB_HOST);
  console.log(process.env.DB_NAME);
}

printEnv();

// let sqlResults = await retrieveDataFromSupabase('SELECT coount(*) FROM "Customer"');
// console.log(sqlResults);

// function retrieveData() {
//   // Configure the connection parameters
//   const pool = supabaseClientPool;

//   // Connect to the database
//   pool.connect((err, client, done) => {
//     if (err) {
//       console.error("Error fetching client from pool", err);
//     }
//     client.query('SELECT count(*) FROM "Customer"', (err, result) => {
//       if (err) {
//         console.error("Error executing query", err.stack);
//       }
//       console.log(result.rows);
//       done();
//     });
//   });
// }

// retrieveData();

import dotenv from "dotenv";
import Hello_Scripts from "./helper.js";
import Hello_Utils from "../utils/helper.js";
import { SayHelloFromSupabaseServices, retrieveDataFromSupabase } from "../utils/db_supbaseServices.js";

dotenv.config();

function printEnv() {
  console.log(process.env.DB_USER);
  console.log(process.env.DB_HOST);
  console.log(process.env.DB_NAME);
}

printEnv();
Hello_Scripts();
Hello_Utils();
SayHelloFromSupabaseServices();

const sqlResult = await retrieveDataFromSupabase('SELECT * FROM "Customer"');
console.log(sqlResult);

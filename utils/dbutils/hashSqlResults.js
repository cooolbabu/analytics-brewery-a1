import { createHash } from "crypto";

function computeSHA256Hash(input) {
  const hash = createHash("sha256");
  hash.update(input);
  return hash.digest("hex");
}

/**
 * Calculates the hash values for the headers and data of SQL results.
 *
 * @param {Array<Object>} sqlResults - The SQL results to hash.
 * @returns {Object} - An object containing the hash values for the {headerHash} and {dataHash}.
 *
 */

export default function hashSQLResults(sqlResults) {
  //console.log("hashSQLResults: SQL Results: ", sqlResults);

  // Extract headers and calculate their hash
  const headers = Object.keys(sqlResults[0]);
  const headersString = JSON.stringify(headers);
  console.log("Headers String:", headersString);
  const headersHash = computeSHA256Hash(headersString);

  // Combine all row data into a single string and calculate its hash
  const dataString = sqlResults.map((row) => JSON.stringify(Object.values(row))).join();
  console.log("Data String:", dataString);
  const dataHash = computeSHA256Hash(dataString);

  console.log("Headers Hash:", headersHash);
  console.log("Data Hash:", dataHash);

  return { headersHash, dataHash };
}
// Path: utils/__tests__/hashSqlResults.test.js

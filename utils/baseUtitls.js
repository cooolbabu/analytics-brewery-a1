/**
 * Generates a simple GUID (Globally Unique Identifier).
 * @returns {string} The generated GUID.
 */
export function generateSimpleGUID() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Extracts all SQL code blocks from the given text and combines them into one string.
 * @param {string} text - The text to extract SQL code blocks from.
 * @returns {string} - The combined SQL code blocks as a single string.
 */
export function extractAllSQL(text) {
  const regex = /```sql\s*([\s\S]*?)\s*```/g;
  const matches = [...text.matchAll(regex)];
  if (matches.length === 0) {
    // No SQL blocks found, return original text
    return text;
  }
  // Concatenate all SQL codes into one big string
  const allSqlCombined = matches.map((match) => match[1]).join("\n");
  return allSqlCombined;
}

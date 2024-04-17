const response1 = `{
    "query": "SELECT g.\"Name\" AS genre_name,
               SUM(il.\"Quantity\") AS quantity_sold,
               SUM(il.\"UnitPrice\" * il.\"Quantity\") AS total_sales
        FROM \"Genre\" g
        JOIN \"Track\" t ON g.\"GenreId\" = t.\"GenreId\"
        JOIN \"InvoiceLine\" il ON t.\"TrackId\" = il.\"TrackId\"
        JOIN \"Invoice\" i ON il.\"InvoiceId\" = i.\"InvoiceId\"
        WHERE EXTRACT(YEAR FROM i.\"InvoiceDate\") = 2024
        GROUP BY g.\"Name\"
        ORDER BY total_sales DESC
        LIMIT 5;
    "
}`;

let stringWithNewlines = "This is a string\nwith newlines.\nIt should have two newlines.";
let newlineMatches = response1.match(/\n/g);

let newlineCount = newlineMatches ? newlineMatches.length : 0;

console.log("Number of newline characters:", newlineCount);

let stringWithoutNewlines = response1.replace(/\r?\n|\r/g, "");
let updatedString = "";
if (stringWithoutNewlines.includes('\\"')) {
  updatedString = myString.replace(/\\\\"/g, '\\\\"');
  console.log("Updated string: ", updatedString);
}

console.log("--" + updatedString + "--");
updatedString;
const responseStr = JSON.parse(stringWithoutNewlines).query;
console.log("responseStr: ", responseStr);

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { okaidia, funky, coy, solarizedlight } from "react-syntax-highlighter/dist/esm/styles/prism";
// import { docco, sunburst, tomorrowNightBright } from "react-syntax-highlighter/dist/esm/styles/hljs";
function SyntaxHighlighterPage() {
  const codeString = `
  SELECT "Genre"."Name", SUM("InvoiceLine"."UnitPrice" * "InvoiceLine"."Quantity") AS "Total Sales"
  FROM "Genre"
  INNER JOIN "Track" ON "Genre"."GenreId" = "Track"."GenreId"
  INNER JOIN "InvoiceLine" ON "Track"."TrackId" = "InvoiceLine"."TrackId"
  GROUP BY "Genre"."Name"
  ORDER BY "Total Sales" DESC
  LIMIT 5;`;

  const codeString2 = "```sql SELECT * FROM 'Customer';```";
  // Customize styling by passing customStyle prop
  //<SyntaxHighlighter style={solarizedlight} customStyle={customStyle}>
  // const customStyle = {
  //   lineHeight: "1.5",
  //   fontSize: "1rem",
  //   borderRadius: "5px",
  //   backgroundColor: "#f7f7f7",
  //   padding: "20px",
  // };

  return (
    <div className="flex flex-col gap-4">
      <div>
        <SyntaxHighlighter language="sql" style={okaidia}>
          {codeString}
        </SyntaxHighlighter>
      </div>
      <div>
        <pre>
          <code className="sql">{codeString2}</code>
        </pre>
      </div>
      <div>
        <SyntaxHighlighter language="sql" style={solarizedlight}>
          {codeString}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}

export default SyntaxHighlighterPage;

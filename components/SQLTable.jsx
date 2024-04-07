function SQLTable(queryResults) {
  let headers = [];

  console.log("SQLTable.jsx: Value of queryResults: \n", queryResults.data);
  console.log("SQLTable.jsx: Length queryResults: \n", queryResults.data.length);

  if (queryResults.data.length > 0) {
    console.log("SQLTable.jsx: Table headers are: ", Object.keys(queryResults.data[0]));
    headers = Object.keys(queryResults.data[0]);
    console.log("SQLTable.jsx: Other headers are: ", headers);
  }

  return (
    <div className="overflow-x-auto">
      {queryResults.data.length > 0 ? (
        <table className="table table-xs">
          <thead>
            <tr>
              {headers.map((header) => (
                <th key={header}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {queryResults.data.map((row, index) => (
              <tr key={index}>
                {headers.map((header) => (
                  <td key={`${index}-${header}`}>{row[header]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-sm">No data available.</p>
      )}
    </div>
  );
}

export default SQLTable;

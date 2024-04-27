import ShowSQLErrorMessage from "@/app/displayComponents/ShowSQLErrorMessage";

function SQLTable(queryResults) {
  let headers = [];

  // console.log("SQLTable.jsx: Value of queryResults: \n", queryResults);
  // console.log("SQLTable.jsx: Value of queryResults.data: \n", queryResults.data);
  // console.log("SQLTable.jsx: Value of queryResults.data: \n", queryResults.data.status);
  // console.log("SQLTable.jsx: Value of message: \n", queryResults.data.message);
  // console.log("SQLTable.jsx: Length queryResults: \n", queryResults.data.message;

  if (queryResults.data.status && queryResults.data.message.length > 0) {
    // console.log("SQLTable.jsx: Table headers are: ", Object.keys(queryResults.data.message[0]));
    headers = Object.keys(queryResults.data.message[0]);
    // console.log("SQLTable.jsx: Other headers are: ", headers);
  }

  return (
    <>
      {queryResults.data.status === false ? (
        <div>
          <ShowSQLErrorMessage errorDetails={queryResults.data}></ShowSQLErrorMessage>
        </div>
      ) : null}

      <div className="overflow-x-auto">
        {queryResults.data.status ? (
          <table className="table table-xs">
            <thead>
              <tr>
                {headers.map((header) => (
                  <th key={header}>{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {queryResults.data.message.map((row, index) => (
                <tr key={index}>
                  {headers.map((header) => (
                    <td key={`${index}-${header}`}>{row[header]}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No Data to display</p>
        )}
      </div>
    </>
  );
}

export default SQLTable;

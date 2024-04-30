"use client";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { okaidia } from "react-syntax-highlighter/dist/esm/styles/prism";

import { getAllPromptExecutionHistory } from "@/utils/actions";
import { useAuth } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";

import { formatInTimeZone } from "date-fns-tz";
import { useState } from "react";

function formatIfDate(value) {
  if (value instanceof Date) {
    const timeZone = "America/Chicago";
    return formatInTimeZone(value, timeZone, "yyyy-MM-dd HH:mm:ss");
  }
  return value;
}

function MyBrewsList() {
  const { userId } = useAuth();
  let headers = [
    "Created at",
    "Header hash",
    "Data hash",
    "Prompt",
    "SQL statement",
    "Run status",
    "Provider",
    "Model",
    "Persona",
  ];

  const [displaySQLStatement, setDisplaySQLStatement] = useState("SELECT * FROM Customer;");
  const [modalTitle, setModalTitle] = useState("No title set");

  const { data: pTemplatesData, isPending: isPendingTD } = useQuery({
    queryKey: ["promptExecutionHistory", { userId }],
    queryFn: () => getAllPromptExecutionHistory({ userId }),
  });

  if (!isPendingTD) {
    // console.log("MyBrewsList: pTemplatesData", pTemplatesData);
    // console.log("MyBrewsList: pTemplatesData status", pTemplatesData.status);
    //   console.log("MyBrewsList: pTemplatesData", pTemplatesData.noOfRows);
    // headers = Object.keys(pTemplatesData.message[0]);
  }

  const handleShowModalEvent = (title, message, type) => {
    {
      // console.log("SQL Statement: ", message);
      setModalTitle(title);
      setDisplaySQLStatement(message);
      document.getElementById("my_modal_box").showModal();
    }
  };
  return (
    <div>
      <p>Hello - At the moment there is no filtering or pagination. You are seeing entire history</p>
      {!isPendingTD ? <div>{pTemplatesData.noOfRows}</div> : null}

      <div className="overflow-x-auto">
        {!isPendingTD && pTemplatesData.noOfRows > 0 ? (
          <table className="table table-xs table-zebra-zebra table-pin-rows">
            <thead>
              <tr>
                {headers.map((header) => (
                  <th key={header}>{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pTemplatesData.message.map((row, index) => (
                <tr key={index}>
                  <td className="w-24"> {formatIfDate(row["created_at"])}</td>
                  <td className="max-w-32 text-wrap" style={{ wordWrap: "break-word", width: "32ch" }}>
                    {row["header_hash"]}
                  </td>
                  <td className="max-w-32 text-wrap" style={{ wordWrap: "break-word", width: "32ch" }}>
                    {row["data_hash"]}
                  </td>

                  <td className="max-w-32 text-wrap">
                    {/* {row["prompt_query"]} */}
                    <button
                      type="button"
                      className="btn btn-xs sm:btn-md md:btn-md lg:btn-md bg-green-500"
                      onClick={() => {
                        handleShowModalEvent("Prompt ", row["prompt_query"]);
                      }}
                    >
                      <span className="text-xs">Show Prompt</span>
                    </button>
                  </td>

                  <td className="max-w-36 text-wrap">
                    <button
                      type="button"
                      className="btn btn-xs sm:btn-md md:btn-md lg:btn-md bg-blue-500"
                      onClick={() => {
                        handleShowModalEvent("SQL Statement", row["sql_statement"]);
                      }}
                    >
                      <span className="text-xs">Show SQL</span>
                    </button>
                  </td>
                  <td className="max-w-16 text-wrap">
                    {row["execution_status"] ? (
                      "Success"
                    ) : (
                      <button
                        type="button"
                        className="btn btn-xs sm:btn-sm md:btn-sm lg:btn-sm bg-red-400 text-white"
                        onClick={() => {
                          handleShowModalEvent("SQL error message", row["sql_err_message"]);
                        }}
                      >
                        <span className="text-xs">Failure</span>
                      </button>
                    )}
                  </td>
                  <td className="max-w-16 text-wrap">{row["provider"]}</td>
                  <td className="max-w-16 text-wrap">{row["model"]}</td>
                  <td className="max-w-16text-wrap">{row["persona"]}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                {headers.map((header) => (
                  <th key={header}>{header}</th>
                ))}
              </tr>
            </tfoot>
          </table>
        ) : (
          <p>No Data to display</p>
        )}
      </div>
      {/* Show SQL statement in a modal */}
      <dialog id="my_modal_box" className="modal">
        <div className="modal-box w-5/6">
          <h3 className="font-bold text-sm">{modalTitle}</h3>
          <p className="py-2 text-xs">Press ESC key or click outside to close</p>
          <div className="text-xs">
            <SyntaxHighlighter language="sql" style={okaidia} wrapLongLines={true}>
              {displaySQLStatement}
              {/* `SELECT * FROM Customer;` */}
            </SyntaxHighlighter>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>Close</button>
        </form>
      </dialog>
      {/* Show SQL statement in a modal */}
    </div>
  );
}

export default MyBrewsList;

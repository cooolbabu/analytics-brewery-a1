import React from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { okaidia } from "react-syntax-highlighter/dist/esm/styles/prism";

function ShowSQLErrorMessage({ errorDetails }) {
  console.log("ErrorMessage.jsx: Loading ErrorMessage component", errorDetails);
  console.log("ErrorMessage.jsx: Loading ErrorMessage component message", errorDetails.message);

  return (
    <div>
      <h2>Error Details</h2>
      <div className="text-xs md:flex-grow md:px-8 md:mt-2">
        <SyntaxHighlighter language="yaml" style={okaidia} wrapLongLines={true}>
          {errorDetails.message}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}

export default ShowSQLErrorMessage;

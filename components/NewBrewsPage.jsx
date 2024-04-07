"use client";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
// import * as prettier from "prettier";
import { okaidia } from "react-syntax-highlighter/dist/esm/styles/prism";
import ListDropdownComponent from "@/app/displayComponents/ListDropDownComponent";
import { listModelsByProvider } from "@/lib/LLMProvidersUtils";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { executeQueries, generatePromptResponseTestCase1, sayHello } from "@/utils/actions";
import SQLTable from "./SQLTable";

/**
 * This is the documentation for the NewBrewersPage React component.
 * NewBrewsPage renders a greeting message to the user and a form for prompters to create new prompts.
 *
 * @modelsList
 * @firstName
 * @availableTokens
 * return (
 *  <NewBrewsPage modelsList={modelsList} firstName={firstName} tokensAvailable={tokensAvailable} />
 * )
 *
 * @param {object} modelsList - The list of models available to the user
 * @param {string} firstName - The first name of the user
 * @param {number} tokensAvailable - The number of tokens available to the user
 */
function NewBrewsPage({ modelsList, firstName, tokensAvailable }) {
  const providerNames = modelsList.providers.map((provider) => provider.name);
  const personas = modelsList.personas.map((persona) => persona.assistant);
  const [provider, setProvider] = useState("Providers");
  const [modelName, setModelName] = useState("Models");
  const [personaName, setPersonaName] = useState("Personas");
  const [message, setMessage] = useState("Type your prompt here ...");
  const [responseSQL, setResponseSQL] = useState(
    'SELECT * FROM "Customer" WHERE "FirstName" = \'Taylor\' OR "LastName" = \'Taylor\''
  );

  const [sqlResults, setSQLResults] = useState([]);
  const [summaryMsg, setSummaryMsg] = useState("Descriptive summarization displayed here...");

  console.log(
    "NewBrewsPage.jsx: Rendering NewBrewsPage: ----------------------------Begin------------------------------- "
  );
  console.log("NewBrewsPage.jsx: List of providers: ", providerNames);
  console.log("NewBrewsPage.jsx: modelsList: ", modelsList);
  console.log("NewBrewsPage.jsx: Personas: ", personas);
  console.log("NewBrewsPage.jsx: FirstName: ", firstName);
  console.log("NewBrewsPage.jsx: Selected Provider: ", provider);
  console.log("NewBrewsPage.jsx: Selected model: ", modelName);
  console.log("NewBrewsPage.jsx: Selected Persona: ", personaName);
  console.log("NewBrewsPage.jsx: tokensAvailable: ", tokensAvailable);
  console.log(modelsList.providers[0].models);

  const providerModels = listModelsByProvider(modelsList, provider);

  // Use mutation function to generate a SQL query from the prompt
  const {
    mutate: runPromptQuery, // suffixing PQ
    isPending_PQ,
    data: data_PQ,
  } = useMutation({
    mutationFn: (query) => generatePromptResponseTestCase1(query),
    onSuccess: (data) => {
      if (!data) {
        toast.error("Something went wrong");
        return;
      }
      console.log("NewBrewsPage.jsx-Mutation: runPromptQuery: ", data);
      setResponseSQL(data);
    },
  });

  // Use mutation function to run a SQL query
  const {
    mutate: runSQLQuery, // suffixing SQL
    isPending_SQL,
    data: data_SQL,
  } = useMutation({
    mutationFn: (query) => executeQueries(query),
    onSuccess: (data) => {
      if (!data) {
        toast.error("Something went wrong");
        return;
      }
      console.log("NewBrewsPage.jsx-Mutation: runSQLQuery: ", data);
      setSQLResults(data);
      console.log("NewBrewsPage.jsx-Mutation: sqlResults: ", sqlResults);
    },
  });

  const handleRunQuery = (e) => {
    //e.preventDefault();
    console.log("NewBrewersPage.jsx: handleRunQuery");

    // Standardize this sucker - high priority
    const promptMessage = {
      provider: provider,
      model: modelName,
      persona: personaName,
      instructions: modelsList.personas.find((persona) => persona.assistant === personaName)?.instructions,
      sourceDB: modelsList.personas.find((persona) => persona.assistant === personaName)?.sourceDB,
      maxTokens: tokensAvailable,
      query: message,
      sqlStatement: responseSQL,
    };
    console.log("NewBrewersPage.jsx: Before executeQueries. Value of query \n", promptMessage.sqlStatement);

    runSQLQuery(promptMessage);
    console.log("NewBrewersPage.jsx: after executeQueries. Value of query \n", sqlResults);
  };

  const handleSummarizeResults = (e) => {
    //e.preventDefault();
    console.log("NewBrewersPage.jsx: Summarize results \n");
    executeQueries(promptMessage, responseSQL);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("NewBrewersPage.jsx: Before mutate. Value of query \n", message);

    //----------------------------------------------
    // Assuming you want to match this id
    const id = "ChinookAssistant";

    // Find the persona with the matching assistant id and retrieve instructions
    const instructions = modelsList.personas.find((persona) => persona.assistant === personaName)?.instructions;

    console.log(personaName);
    console.log(instructions);

    //----------------------------------------------

    // Need to standardize objects these are sent to backend servers
    const promptMessage = {
      provider: provider,
      model: modelName,
      persona: personaName,
      instructions: modelsList.personas.find((persona) => persona.assistant === personaName)?.instructions,
      sourceDB: modelsList.personas.find((persona) => persona.assistant === personaName)?.sourceDB,
      maxTokens: tokensAvailable,
      query: message,
    };
    runPromptQuery(promptMessage);
  };

  console.log(
    "NewBrewsPage.jsx: Rendering NewBrewsPage: ----------------------------end------------------------------- "
  );
  return (
    <div>
      <div className="flex flex-row items-center">
        <h2 className="mb-2">Hi {firstName}. Let&apos;s do some prompts!</h2>
        <span className="text-xl font-semibold text-neutral">Tokens : {tokensAvailable}</span>
      </div>
      <div className="rounded-xl shadow-md items-center space-y-4 border border-base-300 p-2 ">
        <div className="flex flex-col md:flex-row justify-between items-left w-full gap-2">
          <div className="md:w-1/4">
            <ListDropdownComponent
              defaultValue="Providers"
              options={providerNames}
              currentValue={provider}
              onOptionSelect={(option) => {
                setProvider(option);
                setModelName("Models");
                setPersonaName("Personas");
              }}
            />
          </div>
          <div className="md:w-1/4">
            <ListDropdownComponent
              defaultValue="Models"
              currentValue={modelName}
              options={providerModels}
              onOptionSelect={(option) => setModelName(option)}
            />
          </div>
          <div className="md:w-1/4">
            <ListDropdownComponent
              defaultValue="Personas"
              currentValue={personaName}
              options={personas}
              onOptionSelect={(option) => setPersonaName(option)}
            />
          </div>
          <input type="text" placeholder="Bring your own API Key" className="input md:w-1/4" />
        </div>
        {/* form to submit prompt */}
        <div>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col">
              <textarea
                className="textarea textarea-bordered"
                rows="3"
                placeholder="Type your prompt here ..."
                onChange={(e) => setMessage(e.target.value)}
              ></textarea>
              <div className="m-2 space-x-4">
                <button className="btn btn-sm btn-primary min-w-32" type="submit">
                  Submit
                </button>
                <button className="btn btn-sm btn-accent min-w-32" type="reset">
                  Reset
                </button>
              </div>
            </div>
          </form>
        </div>
        {/* Red border */}
        {/* form to submit prompt */}
      </div>
      <div className="rounded-xl shadow-md items-center space-y-4 border border-base-300 p-2 mt-4">
        {/* Two areas to display the prompt and sql results */}
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex flex-col md:w-1/3">
            <div className="flex flex-col md:flex-row justify-between px-4">
              <div className="text-lg font-semibold">SQL Query</div>
              <button className="btn btn-sm btn-primary min-w-32" type="reset" onClick={(e) => handleRunQuery()}>
                Run Query
              </button>
            </div>

            <div className="text-xs">
              <SyntaxHighlighter language="sql" style={okaidia}>
                {responseSQL}
              </SyntaxHighlighter>
            </div>
          </div>
          <div className="flex flex-col md:w-2/3">
            <div className="flex flex-col md:flex-row justify-between px-4">
              <div className="text-lg font-semibold">SQL Results</div>
              <button
                className="btn btn-primary btn-sm min-w-32"
                type="reset"
                onClick={(e) => handleSummarizeResults()}
              >
                Summarize
              </button>
            </div>

            <SQLTable queryResultsJson data={sqlResults} />
          </div>
        </div>
        {/* Two areas to display the prompt and sql results */}
      </div>
      {/* Red border */}
    </div>
  );
}

export default NewBrewsPage;

// Documentation for the NewBrewsPage component
// The flow is as follows:
// 1. The user selects a provider, models, Persona from the dropdown list
// 2. The user types a prompt in the textarea
// 3. The user clicks the Submit button
// 4. The user clicks the Run Query button
// 5. The user clicks the Summarize button
//
// The component has the following props:
// @modelsList - The list of models available to the user

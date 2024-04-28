"use client";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { okaidia } from "react-syntax-highlighter/dist/esm/styles/prism";
import ListDropdownComponent from "@/app/displayComponents/ListDropDownComponent";
import { listModelsByProvider } from "@/lib/LLMProvidersUtils";
import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  executeQueries,
  executeQuerySummarization,
  generatePromptResponseTypeSQL,
  savePromptQueryResults,
} from "@/utils/actions";
import SQLTable from "./SQLTable";
import { useAuth } from "@clerk/nextjs";

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
  const { userId } = useAuth();
  const providerNames = modelsList.providers.map((provider) => provider.name);
  const personas = modelsList.personas.map((persona) => persona.assistant);
  const [provider, setProvider] = useState("Providers");
  const [modelName, setModelName] = useState("Models");
  const [personaName, setPersonaName] = useState("Personas");
  const [message, setMessage] = useState("Type your prompt here ...");
  const [responseSQL, setResponseSQL] = useState('SELECT * FROM "Customers" limit 3;');

  const [sqlResults, setSQLResults] = useState([]);
  const [summaryMsg, setSummaryMsg] = useState("Descriptive summarization displayed here...");

  // console.log("NewBrewsPage.jsx: ----------------------------Begin------------------------------- ", modelsList);
  // console.log("NewBrewsPage.jsx: List of providers: ", providerNames);
  // console.log("NewBrewsPage.jsx: modelsList: ", modelsList);
  // console.log("NewBrewsPage.jsx: Personas: ", personas);
  // console.log("NewBrewsPage.jsx: FirstName: ", firstName);
  // console.log("NewBrewsPage.jsx: Selected Provider: ", provider);
  // console.log("NewBrewsPage.jsx: Selected model: ", modelName);
  // console.log("NewBrewsPage.jsx: Selected Persona: ", personaName);
  // console.log("NewBrewsPage.jsx: tokensAvailable: ", tokensAvailable);
  // console.log(modelsList.providers[0].models);

  const providerModels = listModelsByProvider(modelsList, provider);

  // useEffect(() => {
  //   console.log("NewBrewsPage.jsx: sqlResults changed: ", sqlResults);
  // }, [sqlResults]);

  // Use mutation function to generate a SQL query from the prompt
  const {
    mutate: runPromptQuery, // suffixing PQ
    isPending: isPending_PQ,
    data: data_PQ,
  } = useMutation({
    mutationFn: (query) => generatePromptResponseTypeSQL(query),
    onSuccess: (data) => {
      if (!data) {
        toast.error("Something went wrong");
        return;
      }
      // console.log("NewBrewsPage.jsx-Mutation: runPromptQuery: ", data);
      setResponseSQL(data);
    },
  });

  // Use mutation function to save the result.
  const {
    mutate: runSaveResults, // suffixing SR
    isPending: isPending_SR,
    data: data_SR,
  } = useMutation({
    mutationFn: (results) => savePromptQueryResults(results),
    onSuccess: (data) => {
      if (!data) {
        toast.error("Something went wrong");
        return;
      }
      // console.log("NewBrewsPage.jsx-Mutation: savePromptQueryResults: ", results);
      // console.log("NewBrewsPage.jsx-Mutation: savePromptQueryResults: ", data);
    },
  });

  // Use mutation function to run a SQL query
  const {
    mutate: runSQLQuery, // suffixing SQL
    isPending: isPending_SQL,
    data: data_SQL,
  } = useMutation({
    mutationFn: (query) => executeQueries(query),
    onSuccess: (data) => {
      if (!data) {
        toast.error("Something went wrong");
        return;
      }
      // console.log("NewBrewsPage.jsx-Mutation: runSQLQuery: ", data);
      setSQLResults(data);
      // console.log("NewBrewsPage.jsx-Mutation: sqlResults: ", sqlResults);
    },
  });

  // Use mutation function to run a summarize query results
  const {
    mutate: runQueryresultSummarization, // suffixing QRS
    isPending: isPending_QRS,
    data: data_QRS,
  } = useMutation({
    mutationFn: (query) => executeQuerySummarization(query),
    onSuccess: (data) => {
      if (!data) {
        toast.error("Something went wrong");
        return;
      }
      // console.log("NewBrewsPage.jsx-Mutation: runQueryresultSummarization: ", data);
      setSummaryMsg(data);
      // console.log("NewBrewsPage.jsx-Mutation: runQueryresultSummarization: ", summaryMsg);
    },
  });

  const handleRunQuery = (e) => {
    //e.preventDefault();
    // console.log("NewBrewersPage.jsx: handleRunQuery");

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
    // console.log("NewBrewersPage.jsx: Before executeQueries. Value of query \n", promptMessage.sqlStatement);
    setSQLResults([]);
    runSQLQuery(promptMessage);
    // console.log("NewBrewersPage.jsx: after executeQueries. Value of query \n", sqlResults);
  };

  const handleSaveResults = (e) => {
    //e.preventDefault();
    // console.log("NewBrewersPage.jsx: Summarize results \n");
    // Standardize this sucker - high priority
    const promptMessage = {
      userId: userId,
      provider: provider,
      model: modelName,
      persona: personaName,
      promptQuery: message,
      instructions: modelsList.personas.find((persona) => persona.assistant === personaName)?.instructions,
      sourceDB: modelsList.personas.find((persona) => persona.assistant === personaName)?.sourceDB,
      maxTokens: tokensAvailable,
      sqlStatement: responseSQL,
      sqlResults: sqlResults,
    };
    runSaveResults(promptMessage, responseSQL);
  };

  const handleSummarizeResults = (e) => {
    //e.preventDefault();
    // console.log("NewBrewersPage.jsx: Summarize results \n");
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
      sqlResults: sqlResults,
    };
    runQueryresultSummarization(promptMessage, responseSQL);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setResponseSQL("Loading...");
    // console.log("NewBrewersPage.jsx: Before mutate. Value of query \n", message);

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

  // console.log(
  //   "NewBrewsPage.jsx: Rendering NewBrewsPage: ----------------------------end------------------------------- "
  // );
  return (
    <div>
      <div className="flex flex-row items-center justify-between px-20">
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
                <button className="btn btn-sm btn-primary min-w-32" type="submit" disabled={isPending_PQ}>
                  {isPending_PQ ? "Please wait..." : "Submit"}
                </button>
                <button className="btn btn-sm min-w-28" type="reset">
                  Reset
                </button>
              </div>
            </div>
          </form>
        </div>
        {/* Red border */}
        {/* form to submit prompt */}
      </div>
      {/* Two areas to display the query and sql results - Part1*/}
      <div className="rounded-xl shadow-md items-center border border-b-2 border-base-300 p-2 mt-4">
        <div className="flex flex-col">
          <div className="flex flex-col md:flex-row border-b-2 border-base py-2">
            <div className="flex flex-col md:w-1/6">
              <h2 className="text-lg font-semibold px-4">SQL Query</h2>
              <button
                className="btn btn-sm btn-primary mt-4"
                type="button"
                onClick={(e) => handleRunQuery()}
                disabled={isPending_SQL}
              >
                {isPending_SQL ? "Please wait..." : "Run Query"}
              </button>
            </div>

            <div className="text-xs md:flex-grow md:px-8 md:mt-2 md:w-5/6 ">
              <SyntaxHighlighter language="sql" style={okaidia} wrapLongLines={true}>
                {responseSQL}
              </SyntaxHighlighter>
            </div>
          </div>
          {/* Two areas to display the query and sql results - Part2*/}
          <div className="flex flex-col mt-4">
            <div className="flex flex-col md:flex-row">
              <div className="flex flex-col md:w-1/6">
                <h2 className="text-lg font-semibold px-4">SQL Results</h2>
                <button className="btn btn-primary btn-sm mt-4" type="button" onClick={(e) => handleSaveResults()}>
                  {isPending_SR ? "Processing .." : "Save"}
                </button>
                <button className="btn btn-primary btn-sm mt-4" type="button" onClick={(e) => handleSummarizeResults()}>
                  Summarize
                </button>
              </div>
              <div className="md:w-5/6 md:px-8 md:mt-2">
                <SQLTable data={sqlResults} />
              </div>
            </div>
          </div>
        </div>
        {/* Two areas to display the query and sql results */}
      </div>
      <div className="flex flex-col md:flex-row rounded-xl shadow-md items-center border border-b-2 border-base-300 mt-4 mb-4 pb-4 gap-4">
        <div className="card bg-base-100 shadow-xl md:w-1/2">
          <div className="card-body">
            <h2 className="card-title">Query Summarization</h2>
            <p>{summaryMsg}</p>
            <div className="card-actions justify-start">
              <div className="badge badge-outline">Love it!!</div>
              <div className="badge badge-outline">Help me!!</div>
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-xl md:w-1/2">
          <div className="card-body">
            <h2 className="card-title">
              My Notes
              <div className="badge badge-secondary">NEW</div>
            </h2>
            <p>Text area for notes Lorem ipsum dolor, sit amet co</p>
            <div className="card-actions justify-start">
              <div className="badge badge-outline">Save it !!</div>
              <div className="badge badge-outline">Trash it!!</div>
            </div>
          </div>
        </div>
      </div>
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

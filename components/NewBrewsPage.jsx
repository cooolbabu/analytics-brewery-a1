"use client";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { okaidia } from "react-syntax-highlighter/dist/esm/styles/prism";
import ListDropdownComponent from "@/app/displayComponents/ListDropDownComponent";
import { listModelsByProvider } from "@/lib/LLMProvidersUtils";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { generatePromptResponseTestCase1, sayHello } from "@/utils/actions";

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
  const [responseSQL, setResponseSQL] = useState("SQL response here ...");
  const [responseMsg, setResponseMsg] = useState("Descriptive response displayed here...");

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

  const { mutate, isPending, data } = useMutation({
    mutationFn: (query) => generatePromptResponseTestCase1(query),
    onSuccess: (data) => {
      if (!data) {
        toast.error("Something went wrong");
        return;
      }
      console.log("NewBrewsPage.jsx: Data from server: ", data);
      setResponseSQL(data);
    },
  });

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
      maxTokens: tokensAvailable,
      query: message,
    };
    mutate(promptMessage);
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
      <div className="rounded-xl shadow-md items-center space-y-4 border border-green-400 p-2 ">
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
              <div>
                <button className="btn btn-sm btn-primary min-w-32 ml-2 mt-2" type="submit">
                  Submit
                </button>
                <button className="btn btn-sm btn-accent min-w-32 ml-2 mt-2" type="reset">
                  Reset
                </button>
              </div>
            </div>
          </form>
        </div>
        {/* form to submit prompt */}
        {/* Two areas to display the prompt and sql results */}
        <div className="flex flex-col md:flex-row space-8 gap-4">
          <div className="flex flex-col md:w-1/2">
            <div className="flex flex-col md:flex-row gap-2">
              <div className="text-lg font-semibold mb-4">SQL Query</div>
              <button className="btn btn-sm btn-primary min-w-32 ml-2 mt-2" type="reset">
                Run Query
              </button>
            </div>

            <SyntaxHighlighter language="sql" style={okaidia}>
              {responseSQL}
            </SyntaxHighlighter>
          </div>
          <div className="flex flex-col md:w-1/2 ">
            <div className="flex flex-col md:flex-row gap-2">
              <div className="text-lg font-semibold">SQL Results</div>
              <button className="btn btn-primary btn-sm min-w-32 ml-2 mt-2" type="reset">
                Summarize
              </button>
            </div>
            {/* <div className="text-sm">{responseMsg}</div> */}
          </div>
        </div>
        {/* Two areas to display the prompt and sql results */}
      </div>
    </div>
  );
}

export default NewBrewsPage;

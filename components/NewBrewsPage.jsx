"use client";

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
 *  <NewBrewsPage modelslist={modelslist} firstName={firstName} tokensAvailable={tokensAvailable} />
 * )
 *
 * @param {object} modelslist - The list of models available to the user
 * @param {string} firstName - The first name of the user
 * @param {number} tokensAvailable - The number of tokens available to the user
 */
function NewBrewsPage({ modelslist, firstName, tokensAvailable }) {
  const providerNames = modelslist.providers.map((provider) => provider.name);
  const [provider, setProvider] = useState("Providers");
  const [modelName, setModelName] = useState("Models");
  const [message, setMessage] = useState("Type your prompt here ...");

  console.log(
    "Rendering NewBrewsPage: ----------------------------Begin------------------------------- "
  );
  console.log("List of providers: ", providerNames);
  console.log("modelslist: ", modelslist);
  console.log("firstName: ", firstName);
  console.log("tokensAvailable: ", tokensAvailable);
  console.log("Current Provider: ", provider);
  console.log(modelslist.providers[0].models);

  const providerModels = listModelsByProvider(modelslist, provider);

  console.log("Selected models: ", providerModels);

  const { mutate, isPending, data } = useMutation({
    mutationFn: (query) => generatePromptResponseTestCase1(query),
    onSuccess: (data) => {
      if (!data) {
        toast.error("Something went wrong");
        return;
      }
      console.log("Data from server: ", data);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(
      "[NewBrewersPage.jsx]: Before mutate. Value of query \n",
      message
    );

    // Need to standardize objects these are sent to backend servers
    const promptMessage = {
      provider: provider,
      model: modelName,
      maxTokens: tokensAvailable,
      message: message,
    };
    mutate(promptMessage);
  };

  console.log(
    "Rendering NewBrewsPage: ----------------------------end------------------------------- "
  );
  return (
    <div>
      <h2 className="mb-2">Hi {firstName}. Let&apos;s brew some prompts!</h2>
      <div className=" bg-white rounded-xl shadow-md items-center space-y-4 border border-green-400 p-2 ">
        <div className="flex flex-col md:flex-row justify-between items-left w-full gap-2">
          <div className="w-1/4">
            <ListDropdownComponent
              defaultValue="Pick your provider"
              options={providerNames}
              onOptionSelect={(option) => {
                setProvider(option);
                setModelName("ModelName");
              }}
            />
          </div>
          <div className="w-1/4">
            <ListDropdownComponent
              defaultValue="Select a model"
              options={providerModels}
              onOptionSelect={(option) => setModelName(option)}
            />
          </div>
          <input
            type="text"
            placeholder="Bring your own API Key"
            className="input w-full max-w-xs"
          />
          <div className="w-1/4 py-2">
            <span className="text-xl font-semibold text-neutral">
              Tokens : {tokensAvailable}
            </span>
          </div>
        </div>
        <div className="w-full">
          <form onSubmit={handleSubmit}>
            <textarea
              className="form-textarea mt-1 block w-full border rounded-md p-2"
              rows="8"
              placeholder="Type your prompt here ..."
              onChange={(e) => setMessage(e.target.value)}
            ></textarea>
            <button
              className="btn btn-primary min-w-32 ml-4 mt-2"
              type="submit"
            >
              Submit
            </button>
            <button className="btn min-w-32 ml-4 mt-2" type="reset">
              Reset
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default NewBrewsPage;

"use client";

import ListDropdownComponent from "@/app/displayComponents/ListComponent";
import { listModelsByProvider } from "@/lib/LLMProvidersUtils";
import { useState } from "react";

/**
 * This is the documentation for the NewBrewersPage React component.
 * MyComponent renders a greeting message to the user.
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
  const [provider, setProvider] = useState("Provider");
  const [modelName, setModelName] = useState("ModelName");

  console.log("List of providers: ", providerNames);
  console.log("modelslist: ", modelslist);
  console.log("firstName: ", firstName);
  console.log("tokensAvailable: ", tokensAvailable);
  console.log("Current Provider: ", provider);
  console.log(modelslist.providers[0].models);

  const providerModels = listModelsByProvider(modelslist, provider);

  console.log("Selected models: ", providerModels);

  return (
    <div>
      <h2 className="mb-2">Hi {firstName}. Let&apos;s brew some prompts!</h2>
      <div className="min-w-6xl bg-white rounded-xl shadow-md items-center space-y-4 border border-green-400 p-6 ">
        <div className="flex flex-col md:flex-row justify-between items-left w-full gap-2">
          <ListDropdownComponent
            className="w-1/4"
            defaultValue={provider}
            options={providerNames}
            onOptionSelect={(option) => {
              setProvider(option);
              setModelName("ModelName");
            }}
          />
          <ListDropdownComponent
            className="w-1/4"
            defaultValue={modelName}
            options={providerModels}
            onOptionSelect={(option) => setModelName(option)}
          />
          <p>BYOapi</p>
          <div className="w-1/4">
            <span className="text-xl font-semibold">
              Tokens Available: {tokensAvailable}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NewBrewsPage;

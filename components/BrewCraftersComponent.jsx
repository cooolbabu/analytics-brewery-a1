"use client";

import ListDropdownComponent from "@/app/displayComponents/ListDropDownComponent";
import { listModelsByProvider } from "@/lib/LLMProvidersUtils";
import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { GenerateChatResponse } from "@/utils/mistral/callMistral";
import { marked } from "marked";
import { SaveCraftersPromptResults, getAllPromptTemplates } from "@/utils/actions";
import { useAuth } from "@clerk/nextjs";

function BrewCraftersComponent({ modelsList, userProfile }) {
  const [message, setMessage] = useState("Say Hello ...");
  const [instructions, setInstructions] = useState("You are a greeter. Say something nice ...");
  const [provider, setProvider] = useState("Providers");
  const [modelName, setModelName] = useState("Models");
  const [personaName, setPersonaName] = useState("Personas");
  const [selectedPrompt, setSelectedPrompt] = useState("Pre-defined prompts");
  const [promptTemplate, setPromptTemplate] = useState("Type your prompt template here ..");
  const [promptTemplateId, setPromptTemplateId] = useState("");
  const [promptQuery, setPromptQuery] = useState("Enter your query here ...");
  const [displayMessage, setDisplayMessage] = useState("AI response will be displayed here ...");

  const providerNames = modelsList.providers.map((provider) => provider.name);
  const personas = modelsList.personas.map((persona) => persona.assistant);
  const providerModels = listModelsByProvider(modelsList, provider);

  const { userId } = useAuth();

  const [searchValue, setSearchValue] = useState("");

  const { data: pTemplatesData, isPending: isPendingTD } = useQuery({
    queryKey: ["promptTemplates", { searchValue, userId }],
    queryFn: () => getAllPromptTemplates({ searchValue, userId }),
  });

  console.log("BrewCraftersComponent.jsx: Prompt Templates: ", pTemplatesData);

  // console.log(
  //   "BrewCraftersComponent.jsx: ----------------------------Begin------------------------------- ",
  //   modelsList,
  //   userProfile
  // );

  // console.log(
  //   "BrewCraftersComponent.jsx: ----------------------------Variables---------------------------- ",
  //   providerNames,
  //   personas
  // );

  // Event handlers -end
  // Mutations -begin
  // Use mutation function to run a summarize query results

  const saveAsCraftersPromptResultsEvent = (e) => {
    e.preventDefault();
    console.log("BrewCraftersComponent.jsx: SaveAs clicked\n", e.target.value);
    saveCraftersPromptResultsMutation({ promptTemplate, userId });
  };

  const saveCraftersPromptResultsEvent = (e) => {
    e.preventDefault();
    console.log("BrewCraftersComponent.jsx: Save clicked\n", e.target.value);
    saveCraftersPromptResultsMutation({ promptTemplate, userId, promptTemplateId });
  };

  const {
    mutate: saveCraftersPromptResultsMutation, // suffixing QRS
    isPending: isPending_CPR,
    data: data_CPR,
  } = useMutation({
    mutationFn: (saveParams) => SaveCraftersPromptResults(saveParams),
    onSuccess: (data) => {
      if (!data) {
        toast.error("Something went wrong");
        return;
      }
      console.log("BrewCraftersComponent.jsx-Mutation: before: ", data);
      setDisplayMessage(marked(data));
      console.log("BrewCraftersComponent.jsx-Mutation: after: ", displayMessage);
    },
  });

  //   Event handlers -begin
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(
      "BrewCrafterComponent.jsx: Before mutate. Handle Submit clicked\n",
      modelName + " " + personaName + " " + promptTemplate + " " + promptQuery
    );
    mistralChatInteraction({ modelName, personaName, promptTemplate, promptQuery });
  };

  const {
    mutate: mistralChatInteraction, // suffixing QRS
    isPending: isPendingMCI,
    data: dataMCI,
  } = useMutation({
    mutationFn: (chatParams) => GenerateChatResponse(chatParams),
    onSuccess: (data) => {
      if (!data) {
        toast.error("Something went wrong");
        return;
      }
      console.log("BrewCraftersComponent.jsx-Mutation: before: ", data);
      setDisplayMessage(marked(data));
      console.log("BrewCraftersComponent.jsx-Mutation: after: ", displayMessage);
    },
  });

  // Mutations -end
  return (
    <div>
      <div className="grid grid-cols-[auto,1fr,auto] mb-2">
        <h2 className="m-2 p-2">Hello {userProfile[0].firstName} </h2>
        <p className="m-2 p-2">Let&apos;s mix some queries prompts!</p>
        <input type="text" placeholder="Bring your own API Key" className="input m-2" />
      </div>

      <div className="flex flex-col md:flex-row justify-between items-left w-full gap-2 mb-4">
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
        <div className="md:w-1/4">
          <input
            type="text"
            placeholder="Prompt Templates here"
            name="search"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            required
          />
          {/* <ListDropdownComponent
            defaultValue="Prompt Templates"
            currentValue={promptTemplate}
            options={promptTemplates}
            onOptionSelect={(option) => setPersonaName(option)}
          /> */}
        </div>
      </div>

      {/* Form for prompt submission -begin */}
      <form onSubmit={handleSubmit}>
        <div className="md:w-1/4">
          {/* <ListDropdownComponent
            defaultValue="Pre-defined prompts"
            currentValue={selectedPrompt}
            options="['Prompt 1', 'Prompt 2', 'Prompt 3']"
            onOptionSelect={(option) => setSelectedPrompt(option)}
          /> */}
        </div>
        <div className="flex flex-col">
          <div className="flex flex-col md:flex-row gap-2">
            <textarea
              className="textarea textarea-bordered md:w-1/2 text-xs"
              rows="3"
              placeholder="Enter your prompt template here ..."
              onChange={(e) => setPromptTemplate(e.target.value)}
            ></textarea>
            <textarea
              className="textarea textarea-bordered md:w-1/2"
              rows="3"
              placeholder="Enter your prompt query here ..."
              onChange={(e) => setPromptQuery(e.target.value)}
            ></textarea>
          </div>
          <div className="m-4 space-x-4">
            <button className="btn btn-sm btn-primary min-w-28" type="submit" disabled={isPendingMCI}>
              {isPendingMCI ? "Processing ..." : "Submit"}
            </button>
            <button className="btn btn-info btn-sm min-w-28" type="button" onClick={saveCraftersPromptResultsEvent}>
              Load Prompt Template
            </button>
            <button className="btn btn-info btn-sm min-w-28" type="button" onClick={saveCraftersPromptResultsEvent}>
              Save
            </button>
            <button className="btn btn-info btn-sm min-w-28" type="button" onClick={saveAsCraftersPromptResultsEvent}>
              Save As New
            </button>
            <button className="btn btn-sm min-w-28" type="reset">
              Reset
            </button>
          </div>
        </div>
      </form>
      {/* Form for prompt submission -end */}
      <div className="card bg-base-100 shadow-xl mt-4">
        <div className="card-body">
          <h2 className="card-title">LLM Response</h2>
          <div className="bg-slate-50 m-2 p-2">
            <article dangerouslySetInnerHTML={{ __html: displayMessage }}></article>
          </div>
          <div className="card-actions justify-start">
            <div className="badge badge-outline">Love it!!</div>
            <div className="badge badge-outline">Help me!!</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BrewCraftersComponent;

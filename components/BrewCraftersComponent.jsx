"use client";

import ListDropdownComponent from "@/app/displayComponents/ListDropDownComponent";
import { listModelsByProvider } from "@/lib/LLMProvidersUtils";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { GenerateChatResponse } from "@/utils/mistral/callMistral";
import { marked } from "marked";

function BrewCraftersComponent({ modelsList, userProfile }) {
  const [message, setMessage] = useState("Say Hello ...");
  const [instructions, setInstructions] = useState("You are a greeter. Say something nice ...");
  const [displayMessage, setDisplayMessage] = useState("AI response will be displayed here ...");
  const [provider, setProvider] = useState("Providers");
  const [modelName, setModelName] = useState("Models");
  const [personaName, setPersonaName] = useState("Personas");
  const providerNames = modelsList.providers.map((provider) => provider.name);
  const personas = modelsList.personas.map((persona) => persona.assistant);
  const providerModels = listModelsByProvider(modelsList, provider);

  console.log(
    "BrewCraftersComponent.jsx: ----------------------------Begin------------------------------- ",
    modelsList,
    userProfile
  );

  // console.log(
  //   "BrewCraftersComponent.jsx: ----------------------------Variables---------------------------- ",
  //   providerNames,
  //   personas
  // );

  //   Event handlers -begin
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("BrewCrafterComponent.jsx: Before mutate. Handle Submit clicked\n", message + " " + instructions);
    mistralChatInteraction(instructions, message);
  };

  // Event handlers -end
  // Mutations -begin
  // Use mutation function to run a summarize query results

  const {
    mutate: mistralChatInteraction, // suffixing QRS
    isPending_SH,
    data: data_SH,
  } = useMutation({
    mutationFn: (instructions, promptMessage) => GenerateChatResponse("", "", instructions, promptMessage),
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
        <input type="text" placeholder="Bring your own API Key" className="input md:w-1/4" />
      </div>

      {/* Form for prompt submission -begin */}
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col">
          <div className="flex flex-row gap-2">
            <textarea
              className="textarea textarea-bordered w-1/2"
              rows="3"
              placeholder="Say Hello..."
              onChange={(e) => setMessage(e.target.value)}
            ></textarea>
            <textarea
              className="textarea textarea-bordered w-1/2"
              rows="3"
              placeholder="What style of greeting should I use?"
              onChange={(e) => setInstructions(e.target.value)}
            ></textarea>
          </div>
          <div className="m-2 space-x-4">
            <button className="btn btn-sm btn-primary min-w-28" type="submit">
              Submit
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

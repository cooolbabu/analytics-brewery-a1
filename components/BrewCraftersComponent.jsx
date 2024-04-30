"use client";
import toast from "react-hot-toast";
import ListDropdownComponent from "@/app/displayComponents/ListDropDownComponent";
import { listModelsByProvider } from "@/lib/LLMProvidersUtils";
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { GenerateBrewCraftersResponseMistral, GenerateChatResponse } from "@/utils/mistral/callMistral";
import { marked } from "marked";
import { SaveCraftersPromptResults, getAllPromptTemplates } from "@/utils/actions";
import { useAuth } from "@clerk/nextjs";
import ABPromptTemplateList from "@/components/ABPromptTemplateList";

function BrewCraftersComponent({ modelsList, userProfile }) {
  const [provider, setProvider] = useState("Mistral");
  const [modelName, setModelName] = useState("mistral-large-latest");
  const [personaName, setPersonaName] = useState("Chinook");
  const [promptTemplate, setPromptTemplate] = useState(
    "Enter prompt template or use Load Prompt Template button to load one."
  );
  const [promptTemplateDesc, setPromptTemplateDesc] = useState("Short description of the prompt template");
  const [promptTemplateId, setPromptTemplateId] = useState("");
  const [promptQuery, setPromptQuery] = useState("Enter your query here ...");
  const [displayMessage, setDisplayMessage] = useState("AI response will be displayed here ...");

  const providerNames = modelsList.providers.map((provider) => provider.name);
  const personas = modelsList.personas.map((persona) => persona.assistant);
  const providerModels = listModelsByProvider(modelsList, provider);

  const { userId } = useAuth();

  const [searchedPromptTemplate, setSearchedPromptTemplate] = useState({
    // This represents the table row object ab_promp_template
    promptTemplateDataObject: {
      prompt_template_id: "abc123",
      user_id: "user123rtu",
      prompt_template_desc: "Simple prompt description",
      prompt_template: "Enter prompt template or use Load Prompt Template button to load one.",
    },
  });

  const { data: pTemplatesData, isPending: isPendingTD } = useQuery({
    queryKey: ["promptTemplates", { userId }],
    queryFn: () => getAllPromptTemplates({ userId }),
  });

  //console.log("Searched Prompt Template: ", searchedPromptTemplate);
  //console.log("BrewCraftersComponent.jsx: Prompt Templates: ", pTemplatesData);
  useEffect(
    () => {
      // console.log(
      //   "Searched Prompt Template 3 (searchedPromptTemplate.promptTemplateDataObject): ",
      //   searchedPromptTemplate.promptTemplateDataObject.prompt_template
      // );

      document.getElementById("prompt_template_modal").close();
      setPromptTemplateId(searchedPromptTemplate.promptTemplateDataObject.prompt_template_id);
      setPromptTemplate(searchedPromptTemplate.promptTemplateDataObject.prompt_template);
      setPromptTemplateDesc(searchedPromptTemplate.promptTemplateDataObject.prompt_template_desc);
    },
    [searchedPromptTemplate] // Only re-run the effect if userState changes
  ); // Only re-run the effect if userState changes

  // Event handlers -end
  // Mutations -begin
  // Use mutation function to run a summarize query results

  const saveAsCraftersPromptResultsEvent = (e) => {
    e.preventDefault();
    //console.log("BrewCraftersComponent.jsx: SaveAs clicked\n", e.target.value);
    saveCraftersPromptResultsMutation({ userId, promptTemplate, promptTemplateDesc });
  };

  const saveCraftersPromptResultsEvent = (e) => {
    e.preventDefault();
    //console.log("BrewCraftersComponent.jsx: Save clicked\n", e.target.value);
    saveCraftersPromptResultsMutation({ promptTemplateId, userId, promptTemplate, promptTemplateDesc });
  };

  const {
    mutate: saveCraftersPromptResultsMutation, // suffixing QRS
    isPending: isPending_CPR,
    data: data_CPR,
  } = useMutation({
    mutationFn: (saveParams) => SaveCraftersPromptResults(saveParams),
    onSuccess: (data_CPR) => {
      // console.log("saveCraftersPromptResultsMutation: ", data_CPR);
      if (!data_CPR || !data_CPR.success)
        toast.error("Something went wrong with saving the prompt template. Please try again.");
      else toast.success("Successfully save prompt template.");
    },
    onError: (error) => {
      console.log("Unhandled error ", error);
      console.log("Unhandled error ", data_CPR);
      // This will handle any errors that were thrown and not caught in the mutation function
      toast.error("Error occurred: " + (error.message || "Unknown error"));
    },
  });

  //   Event handlers -begin
  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log(
    //   "BrewCrafterComponent.jsx: Before mutate. Handle Submit clicked\n",
    //   provider + " " + modelName + " " + personaName + " " + promptTemplate + " " + promptQuery
    // );
    setDisplayMessage("Processing ...");
    brewCraftersInteraction({ provider, modelName, personaName, promptTemplate, promptQuery });
  };

  const {
    mutate: brewCraftersInteraction, // suffixing QRS
    isPending: isPendingMCI,
    data: dataMCI,
  } = useMutation({
    mutationFn: (chatParams) => GenerateBrewCraftersResponseMistral(chatParams),
    onSuccess: (data) => {
      if (!data) {
        toast.error("Something went wrong");
        return;
      }
      //console.log("BrewCraftersComponent.jsx-Mutation: before: ", data);
      setDisplayMessage(marked(data));
      //console.log("BrewCraftersComponent.jsx-Mutation: after: ", displayMessage);
    },
  });

  // Mutations -end
  return (
    <div>
      <div className="grid grid-cols-[auto,1fr,auto] items-center justify-items-center mb-2 px-10">
        <h2 className="px-4 align-baseline">Hello {userProfile.message[0].firstName} </h2>
        <p className="px-4">Let&apos;s mix some query prompts!</p>
        <input type="password" placeholder="Bring your own API Key" className="input" />
      </div>
      <div className="flex flex-col md:flex-row justify-between items-left w-full gap-2 mb-2 p-2 rounded-xl shadow-md">
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
          <button
            className="btn btn-secondary"
            type="button"
            onClick={() => document.getElementById("prompt_template_modal").showModal()}
          >
            Load Prompt Template
          </button>
        </div>
      </div>
      {/* Form for prompt submission -begin */}
      <form onSubmit={handleSubmit} className="rounded-xl shadow-md p-2">
        <div className="md:w-1/4"></div>
        <div className="flex flex-col space-y-2">
          <textarea
            className="textarea textarea-bordered text-xs"
            rows="1"
            placeholder="Prompt description here"
            value={promptTemplateDesc}
            onChange={(e) => setPromptTemplateDesc(e.target.value)}
          />
          <div className="flex flex-col md:flex-row gap-2">
            <textarea
              className="textarea textarea-bordered md:w-1/2 text-xs"
              rows="3"
              placeholder="Enter prompt template or use Load Prompt Template button to load one."
              value={promptTemplate}
              onChange={(e) => setPromptTemplate(e.target.value)}
            ></textarea>
            <textarea
              className="textarea textarea-bordered md:w-1/2 text-xs"
              rows="3"
              placeholder="Ask your question here ..."
              onChange={(e) => setPromptQuery(e.target.value)}
            ></textarea>
          </div>
          <div className="flex justify-center items-center space-x-4">
            <button className="btn btn-sm btn-primary min-w-28" type="submit" disabled={isPendingMCI}>
              {isPendingMCI ? "Processing ..." : "Submit"}
            </button>
            <button className="btn btn-info btn-sm min-w-28" type="button" onClick={saveCraftersPromptResultsEvent}>
              {isPending_CPR ? "Pending" : "Save"}
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
      {/* Modal form for Load Prompt Template -begin
       */}
      <dialog id="prompt_template_modal" className="modal">
        <div className="modal-box size-5/6">
          <p className="py-4 text-default text-xs">Press ESC key or select a prompt below to close</p>
          <ABPromptTemplateList
            onPromptTemplateSelection={(option) =>
              setSearchedPromptTemplate(() => ({ promptTemplateDataObject: { ...option } }))
            }
          ></ABPromptTemplateList>
        </div>
      </dialog>
    </div>
  );
}

export default BrewCraftersComponent;

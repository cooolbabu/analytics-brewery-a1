"use client";
import { getAllPromptTemplates } from "@/utils/actions";
import { useAuth } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useDebounce } from "use-debounce";
import ABPromptTemplateItems from "./ABPromptTemplateItems";

function ABPromptTemplateList({ onPromptTemplateSelection }) {
  const [searchValue, setSearchValue] = useState("");
  const [debouncedSearchValue] = useDebounce(searchValue, 2000);
  const { userId } = useAuth();
  const { data, isPending } = useQuery({
    queryKey: ["promptTemplates", debouncedSearchValue],
    queryFn: () => getAllPromptTemplates({ searchValue, userId }),
  });

  //   setSearchValue("Another");
  //console.log("ABPromptTemplateList: data", data);
  //console.log("ABPromptTemplateList: searchvalue", searchValue, debouncedSearchValue);

  const handleOptionSelection = (value) => {
    console.log("Selected Value: ", value);
    console.log("Selected data: ", data);
    const selectedPromptData = data.message.filter((item) => item.prompt_template_id === value);
    //console.log("selectedPromptData : ", selectedPromptData[0]); // Prompt template id is unique
    // onPromptTemplateSelection(selectedPromptData);

    if (typeof onPromptTemplateSelection === "function") {
      onPromptTemplateSelection(selectedPromptData[0]);
    } else {
      console.error("onPromptTemplateSelection is not a function!", onPromptTemplateSelection);
    }
  };

  return (
    <div>
      <div className="join">
        <input
          type="text"
          placeholder="Enter Prompt Template details to search..."
          className="input input-bordered join-item min-w-full text-sm"
          name="search"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          required
        />
        <button
          className="btn btn-primary join-item"
          type="button"
          disabled={isPending}
          onClick={() => setSearchValue("")}
        >
          {isPending ? "Please wait..." : "Reset"}
        </button>
      </div>

      {isPending ? (
        <span className="loading"></span>
      ) : (
        <ABPromptTemplateItems data={data} handleOptionSelection={handleOptionSelection} />
      )}
    </div>
  );
}

export default ABPromptTemplateList;

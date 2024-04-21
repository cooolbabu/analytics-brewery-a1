"use client";
import { getAllPromptTemplates } from "@/utils/actions";
import { useAuth } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useDebounce } from "use-debounce";
import ABPromptTemplateItems from "./ABPromptTemplateItems";

function ABPromptTemplateList() {
  const [searchValue, setSearchValue] = useState("");
  const [debouncedSearchValue] = useDebounce(searchValue, 2000);
  const { userId } = useAuth();
  const { data, isPending } = useQuery({
    queryKey: ["promptTemplates", debouncedSearchValue],
    queryFn: () => getAllPromptTemplates({ searchValue, userId }),
  });

  //   setSearchValue("Another");
  console.log("ABPromptTemplateList: data", data);
  console.log("ABPromptTemplateList: searchvalue", searchValue, debouncedSearchValue);
  return (
    <div>
      <h2 className="mb-4">ABPromptTemplateList</h2>
      <form className="max-w-2xl mb-12">
        <div className="join w-full">
          <input
            type="text"
            placeholder="Enter Prompt Template here.."
            className="input input-bordered join-item w-full"
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
      </form>

      {isPending ? <span className=" loading"></span> : <ABPromptTemplateItems data={data} />}
    </div>
  );
}

export default ABPromptTemplateList;

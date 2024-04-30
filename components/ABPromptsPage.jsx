"use client";
import { getAllABPrompts } from "@/utils/actions";
import { useQuery } from "@tanstack/react-query";
import ABPromptCardList from "./ABPromptList";
import { useState } from "react";

function ABPromptsPage() {
  const [searchValue, setSearchValue] = useState("");
  const { data, isPending } = useQuery({
    queryKey: ["abPrompts", searchValue],
    queryFn: () => getAllABPrompts(searchValue),
  });

  // console.log("ABPromptsPage: data", data);

  return (
    <>
      <form className="max-w-lg mb-12 mt-12">
        <div className="join w-full">
          <input
            type="text"
            placeholder="Enter provider, model, persona, or prompt here.."
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
            {isPending ? "please wait" : "Reset"}
          </button>
        </div>
      </form>

      {isPending ? <span className=" loading"></span> : <ABPromptCardList data={data} />}
    </>
  );
}

export default ABPromptsPage;

import { currentUser } from "@clerk/nextjs";
import React, { useState } from "react";
function BrewsPage() {
  const [vendor, setVendor] = useState("Vendor");
  const [model, setModel] = useState("Model");
  const [llm_api_key, setLLMApiKey] = useState("abc123");
  const [message, setMessage] = useState("Sample message");
  const user = currentUser();
  const userFullName = "Hello John Doe"; // This should be dynamically generated based on your data

  return (
    <div className="flex flex-col md:flex-col">
      <h2 className="text-4xl m-2">Prompt Brewers Page</h2>

      {/* This is a form for brewers to create new brews */}
      <div className="min-w-6xl bg-white rounded-xl shadow-md items-center space-y-4 border border-green-400 p-6 ">
        <div className="flex flex-col md:flex-row justify-between items-left w-full gap-2">
          <select
            className="w-1/4 text-gray-700 py-3 px-4 pr-8 rounded"
            value={vendor}
            onChange={(e) => setVendor(e.target.value)}
          >
            {/* Options should be dynamically generated based on your data */}
            <option value="Vendor">Vendor</option>
          </select>

          <select
            className="w-1/4"
            value={model}
            onChange={(e) => setModel(e.target.value)}
          >
            {/* Options should be dynamically generated based on your data */}
            <option value="Model">Model</option>
          </select>
          <select
            className="w-1/4"
            value={llm_api_key}
            onChange={(e) => setModel(e.target.value)}
          >
            {/* Options should be dynamically generated based on your data */}
            <option value="API Key">llm_api_key</option>
          </select>

          <div className="w-1/4">
            <span className="text-sm font-semibold">Tokens Available</span>
          </div>
        </div>

        <div className="w-full">
          <p className="text-gray-600 text-lg">
            {userFullName}, Let&apos;s brew some prompts!
          </p>
        </div>

        <div className="w-full">
          <textarea
            className="form-textarea mt-1 block w-full border rounded-md"
            rows="8"
            placeholder="Place holder for React component"
            // value={message}
            onChange={(e) => setMessage(e.target.value)}
          ></textarea>
        </div>
      </div>

      {/* This is a form for brewers to create new brews */}
    </div>
  );
}

// This page is for Brewers to review their creations
export default BrewsPage;

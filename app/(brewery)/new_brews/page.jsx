import { getUserProfile } from "@/lib/userProfile";
import { currentUser } from "@clerk/nextjs";
import NewBrewsPage from "@/components/NewBrewsPage";
import React from "react";
async function BrewsPage() {
  const user = await currentUser();
  const userProfile = await getUserProfile(user.emailAddresses[0].emailAddress);
  const modelsList = {
    providers: [
      {
        name: "OpenAI",
        models: [
          "gpt-4-0125-preview",
          "gpt-4-1106-preview",
          "gpt-3.5-turbo-0125",
          "gpt-3.5-turbo-1106",
        ],
      },
      {
        name: "Anthropic",
        models: [
          "claude-3-opus-20240229",
          "claude-3-sonnet-20240229",
          "claude-3-haiku-20240307",
        ],
      },
      {
        name: "IBM",
        models: [
          "granite-13b-chat",
          "granite-13b-instruct",
          "codellama-34b-instruct",
          "mixtral-8x7b-instruct",
          "starcoder-15.5b",
        ],
      },
    ],
  };
  console.log("New Brews Page ====");
  console.log("Email address: ", user.emailAddresses[0].emailAddress);
  console.log("First Name: ", user.firstName, "Last Name: ", user.lastName);
  console.log("ImageUrl: ", user.imageUrl);
  console.log("Current Token count: ", userProfile[0].tokensAvailable);

  return (
    <div>
      <h2 className="mb-10">Brewers Page</h2>
      <NewBrewsPage
        modelslist={modelsList}
        firstName={user.firstName}
        tokensAvailable={userProfile[0].tokensAvailable}
      />
    </div>
  );
}

// This page is for Brewers to review their creations
export default BrewsPage;

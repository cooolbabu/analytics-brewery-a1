import { getUserProfile, getProviderModels } from "@/lib/userProfile";
import { currentUser } from "@clerk/nextjs";
import NewBrewsPage from "@/components/NewBrewsPage";
import React from "react";
import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query";

async function BrewsPage() {
  const user = await currentUser();
  const userProfile = await getUserProfile(user.emailAddresses[0].emailAddress);
  const modelsList = await getProviderModels();

  console.log("New Brews Page ====");
  console.log("Email address: ", user.emailAddresses[0].emailAddress);
  console.log("First Name: ", user.firstName, "Last Name: ", user.lastName);
  // console.log("ImageUrl: ", user.imageUrl);
  // console.log("Current Token count: ", userProfile[0].tokensAvailable);
  const queryClient = new QueryClient();
  return (
    <div>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <h2 className="mb-2 text-2xl">Data Mixers</h2>
        <NewBrewsPage
          modelsList={modelsList}
          firstName={user.firstName}
          tokensAvailable={userProfile[0].tokensAvailable}
        />
      </HydrationBoundary>
    </div>
  );
}

// This page is for Brewers to review their creations
export default BrewsPage;

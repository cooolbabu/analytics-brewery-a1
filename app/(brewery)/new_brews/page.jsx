import { getUserProfile, getProviderModels } from "@/lib/userProfile";
import { currentUser } from "@clerk/nextjs";
import NewBrewsPage from "@/components/NewBrewsPage";
import React from "react";
import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query";

async function BrewsPage() {
  const user = await currentUser();
  const userProfile = await getUserProfile(user.emailAddresses[0].emailAddress, user.id, user.firstName, user.lastName);
  const modelsList = await getProviderModels();

  console.log("New Brews Page ====");
  console.log("Email address: ", user.emailAddresses[0].emailAddress);
  console.log("First Name: ", user.firstName, "Last Name: ", user.lastName);
  // console.log("ImageUrl: ", user);
  // console.log("Current Token count: ", userProfile.message[0].tokens_available);

  console.log("User profile id: ", user.id);
  const queryClient = new QueryClient();
  return (
    <div>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <h2 className="mb-2 text-2xl">Data Mixers</h2>
        <NewBrewsPage
          modelsList={modelsList}
          firstName={user.firstName}
          tokensAvailable={3000}
          // tokensAvailable={userProfile.message[0].tokens_available}
        />
      </HydrationBoundary>
    </div>
  );
}

// This page is for Brewers to review their creations
export default BrewsPage;

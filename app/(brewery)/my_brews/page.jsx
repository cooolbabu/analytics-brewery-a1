import { getUserProfile, getProviderModels } from "@/lib/userProfile";
import { currentUser } from "@clerk/nextjs";
import NewBrewsPage from "@/components/NewBrewsPage";
import React from "react";
import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query";
import MyBrewsList from "@/components/MyBrewsList";

async function FreshBrews() {
  const user = await currentUser();
  const userProfile = await getUserProfile(user.emailAddresses[0].emailAddress);

  console.log("New Brews Page ====");
  console.log("Email address: ", user.emailAddresses[0].emailAddress);
  console.log("First Name: ", user.firstName, "Last Name: ", user.lastName);

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["promptExecutionHistory"],
    queryFn: () => getAllPromptExecutionHistory(),
  });
  return (
    <div>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <h2 className="mb-2 text-2xl">Data Mixers</h2>
        <MyBrewsList />
      </HydrationBoundary>
    </div>
  );
}

// This page is for Brewers to review their creations
export default FreshBrews;

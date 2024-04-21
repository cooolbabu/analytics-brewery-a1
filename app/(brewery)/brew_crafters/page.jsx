import React from "react";
import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query";
import BrewCraftersComponent from "@/components/BrewCraftersComponent";
import { getUserProfile, getProviderModels } from "@/lib/userProfile";
import { currentUser } from "@clerk/nextjs";
import { getAllPromptTemplates } from "@/utils/actions";

async function BrewCraftersPage() {
  const user = await currentUser();
  const userProfile = await getUserProfile(user.emailAddresses[0].emailAddress);
  const modelsList = await getProviderModels();

  // console.log("Brews CraftersPage ====");
  // console.log("Email address: ", user.emailAddresses[0].emailAddress);
  // console.log("First Name: ", user.firstName, "Last Name: ", user.lastName);
  // console.log("ImageUrl: ", user.imageUrl);
  // console.log("Models list: ", modelsList);

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["promptTemplates"],
    queryFn: () => getAllPromptTemplates(),
  });
  return (
    <div>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <h2 className="mb-2">SQL Mixers Page</h2>
        <BrewCraftersComponent modelsList={modelsList} userProfile={userProfile} />
      </HydrationBoundary>
    </div>
  );
}

// This page is for Brewers to review their creations
export default BrewCraftersPage;

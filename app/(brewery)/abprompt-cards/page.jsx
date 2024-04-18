import ABPromptsPage from "@/components/ABPromptsPage";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { getAllABPrompts } from "@/utils/actions";

export default AllABPromptsPage;

async function AllABPromptsPage() {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["abPrompts"],
    queryFn: () => getAllABPrompts(),
  });
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ABPromptsPage />
    </HydrationBoundary>
  );
}

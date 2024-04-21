import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query";

import Chat from "@/components/Chat";
import { getAllPromptTemplates } from "@/utils/actions";
import ABPromptTemplateList from "@/components/ABPromptTemplateList";

async function TestFormComponentPage() {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["promptTemplates"],
    queryFn: () => getAllPromptTemplates(),
  });
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <h2>Testing Prompt Templates experience</h2>
      {/* <Chat /> */}
      <ABPromptTemplateList></ABPromptTemplateList>
    </HydrationBoundary>
  );
}

export default TestFormComponentPage;

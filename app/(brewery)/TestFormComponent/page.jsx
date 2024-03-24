import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";

import Chat from "@/components/Chat";

function TestFormComponentPage() {
  const queryClient = new QueryClient();
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <h2>Hello</h2>
      <Chat />
    </HydrationBoundary>
  );
}

export default TestFormComponentPage;

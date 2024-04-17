import ABPromptCard from "./ABPromptCard";

function ABPromptCardList({ data }) {
  console.log("[ABPromptCard] data: ", data);
  if (!data || data.length === 0) return <h4 className="text-lg ">No tours found...</h4>;

  return (
    <div className="grid sm:grid-cols-2  lg:grid-cols-4 gap-8">
      {data.map((promptCard) => {
        return <ABPromptCard key={promptCard.abPromptId} promptRecord={promptCard} />;
      })}
    </div>
  );
}

export default ABPromptCardList;

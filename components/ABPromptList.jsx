import ABPromptCard from "./ABPromptCard";

function ABPromptCardList({ data }) {
  console.log("[ABPromptCard] data: ", data);
  if (!data || data.length === 0) return <h4 className="text-lg ">No Prompts found...</h4>;

  return (
    <div className="grid sm:grid-cols-2  lg:grid-cols-4">
      {data.message.map((promptCard) => {
        return <ABPromptCard key={promptCard.promptId} promptRecord={promptCard} />;
      })}
    </div>
  );
}

export default ABPromptCardList;

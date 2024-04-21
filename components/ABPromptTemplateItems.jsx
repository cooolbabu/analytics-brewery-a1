"use client";

function ABPromptTemplateItems({ data }) {
  //   if (!data || data.length === 0) return <h4 className="text-lg ">No Prompt Templates found...</h4>;

  if (!data || (Array.isArray(data) && data.length === 0)) {
    return <h4 className="text-lg">No Prompt Templates found...</h4>;
  }

  console.log("Prompt Templates: ", data);

  return (
    <>
      <h2>Testing</h2>
      <div className="flex flex-col max-w-5xl space-y-1">
        {data.map((pTemplate) => {
          return <p key={pTemplate.prompt_template_id}>{pTemplate.prompt_template}</p>;
        })}
      </div>
    </>
  );
}

export default ABPromptTemplateItems;

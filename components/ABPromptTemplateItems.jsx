"use client";

function ABPromptTemplateItems({ data, handleOptionSelection }) {
  //   if (!data || data.length === 0) return <h4 className="text-lg ">No Prompt Templates found...</h4>;

  if (!data || (Array.isArray(data) && data.length === 0)) {
    return <h4 className="text-lg">No Prompt Templates found...</h4>;
  }

  //console.log("Prompt Templates: ", data);

  return (
    <div className="join join-vertical w-full">
      {data.message.map((pTemplate) => {
        return (
          <div className="collapse collapse-arrow join-item border border-base-300" key={pTemplate.prompt_template_id}>
            <input type="radio" name="my-accordion-4" />
            <div className="collapse-title text-lg font-medium">
              <span className="w-full">{pTemplate.prompt_template_desc}</span>
            </div>
            <div className="collapse-content">
              <button
                type="button"
                className="btn btn-secondary btn-xs ml-1"
                onClick={() => handleOptionSelection(pTemplate.prompt_template_id)}
              >
                Select
              </button>

              <textarea
                className="textarea textarea-ghost w-full text-xs"
                value={pTemplate.prompt_template}
                rows="3"
                disabled
              ></textarea>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default ABPromptTemplateItems;

import Link from "next/link";

function ABPromptCard({ promptRecord }) {
  const { prompt_id, user_id, provider, model, persona, prompt_msg, tags } = promptRecord;
  console.log("ABPromptCard: ", promptRecord);

  return (
    <Link href={`/abprompt-cards/${prompt_id}`} className="card card-compact rounded-xl bg-base-100">
      <div className="card-body">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <div className="card-actions">
              <div className="badge badge-secondary text-xs">Ratings</div>
              <div className="badge badge-outline text-xs">Comments</div>
              <div className="badge badge-outline text-xs">Social</div>
            </div>
            <p className="mt-2">{prompt_msg}</p>
            <div className="card-actions">
              <div className="badge badge-outline text-xs">{provider}</div>
              <div className="badge badge-outline text-xs">{model}</div>
              <div className="badge badge-outline text-xs">{persona}</div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default ABPromptCard;

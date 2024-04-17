import Link from "next/link";

function ABPromptCard({ promptRecord }) {
  const { abPromptId, userId, userName, provider, model, persona, prompt, description, tags } = promptRecord;
  console.log("ABPromptCard: ", promptRecord);

  return (
    <Link href={`/abprompt-cards/${abPromptId}`} className="card card-compact rounded-xl bg-base-100">
      <div className="card-body items-center text-center">
        <h2 className="card-title text-center">{description}</h2>
        <p>
          {provider},{model},{persona}
        </p>
        <p>TODO: Ratings and Tags using AI</p>
      </div>
    </Link>
  );
}

export default ABPromptCard;

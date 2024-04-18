import { getABPromptsById } from "@/utils/actions";
import Link from "next/link";
import { redirect } from "next/navigation";

async function SingleABPromptPage({ params }) {
  console.log("[page.jsx] SingleTourPage: ", params);
  const prompt_details = await getABPromptsById(params.id);
  if (!prompt_details) {
    redirect("/abprompt-cards");
  }
  return (
    // <h2>Single Page prompt_details info</h2>
    <div>
      <Link href="/abprompt-cards" className="btn btn-secondary mb-12">
        Back to Social
      </Link>
      <div className="card card-compact rounded-xl bg-base-100">
        <div className="card-body items-center text-center">
          <h2 className="card-title text-center">TODO: write this module</h2>
          <p>TODO: Write this module</p>
          <p>TODO: Ratings and Tags using AI</p>
        </div>
      </div>
    </div>
  );
}
export default SingleABPromptPage;

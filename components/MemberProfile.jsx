import { UserButton, currentUser } from "@clerk/nextjs";

async function MemberProfile() {
  const user = await currentUser();
  return (
    <div className="px-4 items-center">
      <UserButton afterSignOutUrl="/" />
      <p>{user.emailAddresses[0].emailAddress}</p>
    </div>
  );
}

export default MemberProfile;

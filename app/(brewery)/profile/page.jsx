import { UserButton, UserProfile, currentUser } from "@clerk/nextjs";
import getUserProfile from "@/lib/userProfile";
import Image from "next/image";
import UserVendorModelsStatus from "@/components/UserVendorModelsStatus";

async function ProfilePage() {
  // View users details, their brews and their favorties
  const user = await currentUser();
  const userProfile = await getUserProfile(user.emailAddresses[0].emailAddress);

  console.log("CurrentUser on Profile page ====");
  console.log("Email address: ", user.emailAddresses[0].emailAddress);
  console.log("First Name: ", user.firstName, "Last Name: ", user.lastName);
  console.log("ImageUrl: ", user.imageUrl);
  // console.log("Date Registered ======", new Date(userProfile[0].dateRegistered).toLocaleDateString());

  return (
    <div>
      <section className="max-w-screen-md">
        <h2 className="text-4xl py-4 mb-4">Profile</h2>
      </section>
      <div className="flex">
        <Image
          src={user.imageUrl}
          alt="Profile Image"
          className="rounded-3xl w-42 h-42 shadow-md"
          width={200} // Add width here
          height={200} // Add height here
        />
        <div className="m-8">
          <p className="mb-1 text-2xl">
            {userProfile.message[0].first_name}&nbsp; {userProfile.message[0].last_name}
          </p>
          <p className="mb-1">{user.emailAddresses[0].emailAddress}</p>
          <p className="mb-1">Free Tokens used : {userProfile.message[0].current_token_count}</p>
          <p className="mb-1">Free Available Tokens: {userProfile.message[0].tokens_available}</p>
          <p className="mb-1">
            Date Registered: {new Date(userProfile.message[0].date_registered).toLocaleDateString()}
          </p>
        </div>
      </div>
      {/* Show token status section */}
      {/* <UserVendorModelsStatus
        userProfile={userProfile[0]}
      ></UserVendorModelsStatus> */}
      {/* Show token status section */}
      <h2 className="mt-8">
        Turn this section into a button &quot;Manage Profile&quot; that will popup user profile. After making this
        component a client side component
      </h2>
      <UserProfile />
    </div>
  );
}
export default ProfilePage;

import { db } from "./db";

// Only one profile per user and emailId is unique. So, no need to pass emailId and return records index 0.
export async function getUserProfile(emailId) {
  //console.log("Calling DB getUserProfile for: ", emailId);
  return await db.userProfile.findMany({
    where: {
      emailId: emailId,
    },
  });
}

export default getUserProfile;

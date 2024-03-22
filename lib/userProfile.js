import { db } from "./db";

// Only one profile per user and emailId is unique. So, no need to pass emailId and return records index 0.

/** returns info */
export async function getUserProfile(emailId) {
  //console.log("Calling DB getUserProfile for: ", emailId);
  return await db.userProfile.findMany({
    where: {
      emailId: emailId,
    },
  });
}

export async function getVendorModels() {
  return await db.vendorModels.findMany();
}

export default getUserProfile;

import { PrismaClient } from "@prisma/client";

// Open the database connection
//const db = new PrismaClient();
const db = new PrismaClient({
  log: [{ emit: "stdout", level: "query" }],
});

// Execute the query
const userProfiles = await db.userProfile.findMany();
//console.log(userProfiles);

// Execute the query
const userProfileCoool = await db.userProfile.findMany({
  where: {
    emailId: { equals: "sreenivas.angara@gmail.com" },
  },
});
console.log("userProfile ===================");
console.log(userProfiles);
console.log("userProfileCoool ===================");
console.log(userProfileCoool);

import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

//const models = await db.prisma.VendorModels.findMany();
const models = await db.vendorModels.findMany();

console.log(models);

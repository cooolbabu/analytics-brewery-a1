import { PrismaClient } from "@prisma/client";

export const db = new createPrismaClient();

/** @returns {PrismaClient} */
function createPrismaClient() {
  globalThis.prismaClient =
    globalThis.prismaClient ||
    new PrismaClient({
      //log: [{ emit: "stdout", level: "query" }],
    });
  return globalThis.prismaClient;
}

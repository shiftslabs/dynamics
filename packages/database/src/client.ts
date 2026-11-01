import { PrismaClient } from "@prisma/client";
import { getEnv } from "@shiftslabs/config";

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

const env = getEnv();

export const prisma =
  globalThis.prisma ||
  new PrismaClient({
    log: env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (env.NODE_ENV !== "production") {
  globalThis.prisma = prisma;
}

export type DatabaseClient = typeof prisma;

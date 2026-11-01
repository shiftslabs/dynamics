import { prisma, DatabaseClient } from "./client";

export async function runInTransaction<T>(
  action: (tx: Omit<DatabaseClient, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends">) => Promise<T>
): Promise<T> {
  return prisma.$transaction(async (tx) => {
    return action(tx as any);
  });
}

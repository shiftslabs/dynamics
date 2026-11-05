import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "../db/schema";
import type { Env } from "./env";

export function getDb(env: Env) {
  const url = (env.HYPERDRIVE?.connectionString) || env.DATABASE_URL;
  const client = postgres(url, { max: 1, prepare: false });
  return drizzle(client, { schema });
}
export type Db = ReturnType<typeof getDb>;
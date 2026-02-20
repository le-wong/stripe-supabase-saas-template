import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

declare global {
    // eslint-disable-next-line no-var
    var __postgresSql: ReturnType<typeof postgres> | undefined;
}

const sql =
    global.__postgresSql ??
    postgres(process.env.DATABASE_URL!, {
        max: 5,            // dev: keep small (try 2–5)
        idle_timeout: 30,  // seconds
        connect_timeout: 10,
        prepare: false,
    });

if (process.env.NODE_ENV !== "production") {
    global.__postgresSql = sql;
}

export const db = drizzle(sql);
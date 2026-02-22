import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

declare global {
    // eslint-disable-next-line no-var
    var __postgresSql: ReturnType<typeof postgres> | undefined; // global variable created. Type is postgres matching. Default is undefined. 
}

const sql =
    global.__postgresSql ??  // use existing connection ?? or create a new one 
    postgres(process.env.DATABASE_URL!, { //this creates a connection 
        max: 5,
        idle_timeout: 30,
        connect_timeout: 10,
        prepare: false,
    });

if (process.env.NODE_ENV !== "production") {
    global.__postgresSql = sql;  //this prevents the creation of multiple connections while in dev
}

export const db = drizzle(sql); // drizzle translates ts queries to SQL  
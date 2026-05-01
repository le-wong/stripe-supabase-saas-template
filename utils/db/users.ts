import { db } from "@/utils/db/db";
import { usersTable } from "@/utils/db/schema";
import { eq } from "drizzle-orm";

export async function dbGetUserInfo(user: string) {
    return db
        .select() //{ id: usersTable.id, name: usersTable.name, email: usersTable.email, stripeId: usersTable.stripe_id })
        .from(usersTable)
        .where(eq(usersTable.id, user));
}

export async function dbSetUserName(userId: string, name: string) {
    return db.update(usersTable)
        .set({ name: name })
        .where(eq(usersTable.id, userId))
}

export async function dbSetUserInfo(userId: string, name: string | null, email: string | null) {

}

export async function dbSetUserEmail(userId: string, email: string) {
    return db.update(usersTable)
        .set({ email: email })
        .where(eq(usersTable.id, userId))
}
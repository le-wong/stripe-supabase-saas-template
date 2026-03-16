import { db } from "@/utils/db/db";
import { entitlementsTable, productsTable, usersTable } from "@/utils/db/schema";
import { eq, and } from "drizzle-orm";

//TODO: need to add handling for cases where product or user id is not found, somehow...
export async function grantUserEntitlement(stripeUserId: string, stripeProductId: string, stripeSessionId: string) {
    const productId = await db.select({ id: productsTable.id }).from(productsTable).where(eq(productsTable.stripeProductId, stripeProductId));
    const userId = await db.select({ id: usersTable.id }).from(usersTable).where(eq(usersTable.stripe_id, stripeUserId));

    return db
        .insert(entitlementsTable)
        .values({
            userId: userId.at(0)?.id ?? "0000", //TODO: handle this correctly
            courseId: productId.at(0)?.id ?? "0000",//TODO: fix this too
            active: true,
            orderId: stripeSessionId,
        })
        .onConflictDoUpdate({
            target: [entitlementsTable.userId, entitlementsTable.courseId],
            set: {
                active: true,
            },
        });
}

export async function revokeUserEntitlement(userId: string, productId: string) {
    return db
        .update(entitlementsTable)
        .set({ active: false })
        .where(
            and(
                eq(entitlementsTable.userId, userId),
                eq(entitlementsTable.courseId, productId)
            )
        );
}
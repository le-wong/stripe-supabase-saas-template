// utils/db/products.ts
//this file is the logic of what to do wwith database 

import { db } from "@/utils/db/db";
import { coursesTable } from "@/utils/db/schema";
import { eq } from "drizzle-orm";

export async function upsertProductFromStripe(product: {
    id: string;
    name: string;
    description: string | null;
    active: boolean;
    stateTags: string | null;
    roleTags: string | null;
}) {
    return db
        .insert(coursesTable)
        .values({
            stripeProductId: product.id,
            name: product.name,
            description: product.description,
            active: product.active,
            stateTags: product.stateTags,
            roleTags: product.roleTags
        })
        .onConflictDoUpdate({
            target: coursesTable.stripeProductId,
            set: {
                name: product.name,
                description: product.description,
                active: product.active,
                stateTags: product.stateTags,
                roleTags: product.roleTags
            },
        });
}

export async function setProductInactive(stripeProductId: string) {
    return db
        .update(coursesTable)
        .set({ active: false })
        .where(eq(coursesTable.stripeProductId, stripeProductId));
}
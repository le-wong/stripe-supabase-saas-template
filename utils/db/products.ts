// utils/db/products.ts
//this file is the logic of what to do wwith database 

import { db } from "@/utils/db/db";
import { productsTable } from "@/utils/db/schema";
import { eq } from "drizzle-orm";

export async function upsertProductFromStripe(product: {
    id: string;
    name: string;
    description: string | null;
    active: boolean;
}) {
    return db
        .insert(productsTable)
        .values({
            stripeProductId: product.id,
            name: product.name,
            description: product.description,
            active: product.active,
        })
        .onConflictDoUpdate({
            target: productsTable.stripeProductId,
            set: {
                name: product.name,
                description: product.description,
                active: product.active,
            },
        });
}

export async function setProductInactive(stripeProductId: string) {
    return db
        .update(productsTable)
        .set({ active: false })
        .where(eq(productsTable.stripeProductId, stripeProductId));
}
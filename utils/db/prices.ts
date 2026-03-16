// utils/db/prices.ts
import { db } from "@/utils/db/db";
import { productsTable, pricesTable } from "@/utils/db/schema";
import { eq } from "drizzle-orm";

type UpsertPriceInput = {
    stripePriceId: string;
    stripeProductId: string;
    active: boolean;
    currency: string;
    unitAmount: number | null;
    type: "one_time" | "recurring";
};

export async function upsertPriceFromStripe(input: UpsertPriceInput) {
    // Find local product UUID using stripe product id
    const products = await db
        .select({ id: productsTable.id })
        .from(productsTable)
        .where(eq(productsTable.stripeProductId, input.stripeProductId));

    const product = products[0];
    if (!product) {
        // If this happens, product webhook/sync hasn't created it yet
        throw new Error(
            `Product not found for stripeProductId=${input.stripeProductId}`
        );
    }

    await db
        .insert(pricesTable)
        .values({
            stripePriceId: input.stripePriceId,
            productId: product.id,
            active: input.active,
            currency: input.currency,
            unitAmount: input.unitAmount,
            type: input.type,
        })
        .onConflictDoUpdate({
            target: pricesTable.stripePriceId,
            set: {
                productId: product.id,
                active: input.active,
                currency: input.currency,
                unitAmount: input.unitAmount,
                type: input.type,
            },
        });
}

export async function setPriceInactive(stripePriceId: string) {
    await db
        .update(pricesTable)
        .set({ active: false })
        .where(eq(pricesTable.stripePriceId, stripePriceId));
}
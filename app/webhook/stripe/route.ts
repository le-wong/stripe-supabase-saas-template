


// app/api/stripe/products/route.ts (your current path)
// ✅ Verifies Stripe webhook signature using RAW body
// ✅ Handles product.* and price.*
// ✅ Upserts product + price into your DB

import Stripe from "stripe";
import { upsertProductFromStripe, setProductInactive, } from "@/utils/db/products";
import { upsertPriceFromStripe, setPriceInactive, } from "@/utils/db/prices";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2024-06-20",
});

export async function POST(req: Request) {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!webhookSecret) {
        return new Response("Missing STRIPE_WEBHOOK_SECRET", { status: 500 });
    }
    console.log("Stripe secret configured!");
    const signature = req.headers.get("stripe-signature");
    if (!signature) {
        return new Response("Missing Stripe-Signature header", { status: 400 });
    }
    console.log("Stripe-Signature header received!");

    const rawBody = await req.text();

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
    } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        return new Response(`Webhook signature verification failed: ${message}`, {
            status: 400,
        });
    }

    try {
        console.log("Stripe event:", event.type);

        switch (event.type) {
            // -------------------
            // PRODUCTS
            // -------------------
            case "product.created":
            case "product.updated": {
                const product = event.data.object as Stripe.Product;

                await upsertProductFromStripe({
                    id: product.id,
                    name: product.name ?? "",
                    description: product.description ?? null,
                    active: product.active ?? true,
                });

                break;
            }

            case "product.deleted": {
                const product = event.data.object as Stripe.Product;
                await setProductInactive(product.id);
                break;
            }

            // -------------------
            // PRICES
            // -------------------
            case "price.created":
            case "price.updated": {
                const price = event.data.object as Stripe.Price;

                // Stripe gives price.product as string (prod_...) or expanded object
                const stripeProductId =
                    typeof price.product === "string" ? price.product : price.product.id;

                // Ensure product exists locally (in case price event arrives first)
                const stripeProduct = await stripe.products.retrieve(stripeProductId);

                await upsertProductFromStripe({
                    id: stripeProduct.id,
                    name: stripeProduct.name ?? "",
                    description: stripeProduct.description ?? null,
                    active: stripeProduct.active ?? true,
                });

                await upsertPriceFromStripe({
                    stripePriceId: price.id,
                    stripeProductId,
                    active: price.active ?? true,
                    currency: price.currency,
                    unitAmount: price.unit_amount ?? null,
                    type: price.type, // "one_time" | "recurring"
                });

                break;
            }

            case "price.deleted": {
                const price = event.data.object as Stripe.Price;
                await setPriceInactive(price.id);
                break;
            }

            default: {
                console.log("Unhandled Stripe event:", event.type);
                break;
            }
        }

        return new Response("Success", { status: 200 });
    } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        return new Response(`Webhook handler error: ${message}`, { status: 500 });
    }
}
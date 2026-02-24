// app/api/stripe/products/route.ts (example path)
// ✅ Verifies Stripe webhook signature using RAW body
// ✅ Returns proper 2xx / 4xx responses
// ✅ Handles product.created / product.updated / product.deleted

import Stripe from "stripe";
import { upsertProductFromStripe, setProductInactive } from "@/utils/db/products";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2024-06-20", // if your project uses a different version, change it
});

export async function POST(req: Request) {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!webhookSecret) {
        // Misconfigured environment
        return new Response("Missing STRIPE_WEBHOOK_SECRET", { status: 500 });
    }
    console.log("Stripe secret configured!");
    const signature = req.headers.get("stripe-signature");
    if (!signature) {
        return new Response("Missing Stripe-Signature header", { status: 400 });
    }
    console.log("Stripe-Signature header received!");

    // Stripe requires the RAW request body for signature verification
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
        console.log(event.type);
        switch (event.type) {
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

                // Mark inactive instead of deleting rows (safer)
                await setProductInactive(product.id);

                break;
            }

            default: {
                console.log("Unhandled Stripe event!");
                break;
            }
        }

        return new Response("Success", { status: 200 });
    } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        return new Response(`Webhook handler error: ${message}`, { status: 500 });
    }
}






/*

export async function POST(req: Request) { //handles HTTP POST requests sent to this route 
    try {
        const event = await req.json() //converts json text to javascript object 


        switch (event.type) {   //determines which stripe event occured  
            case 'customer.subscription.created':
                console.log("event:", event)
                //await db.update(usersTable).set({ plan: event.data.object.id }).where(eq(usersTable.stripe_id, event.data.object.customer))
                break;
            // Update usersTable.plan with the Stripe subscription ID   where usersTable.stripe_id matches the Stripe customer ID

            case 'customer.subscription.updated':
                break;
            case 'customer.subscription.deleted':
                break;
            default:
                console.log(`Unhandled event type ${event.type}`);
        }

        return new Response('Success', { status: 200 })
    } catch (err) {
        return new Response(`Webhook error: ${err instanceof Error ? err.message : "Unknown error"}`, {
            status: 400,
        })
    }
}

*/
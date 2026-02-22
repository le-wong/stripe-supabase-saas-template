import { db } from '@/utils/db/db'
import { usersTable } from '@/utils/db/schema'
import { eq } from "drizzle-orm";

export async function POST(req: Request) { //handles HTTP POST requests sent to this route 
    try {
        const event = await req.json() //converts json text to javascript object 


        switch (event.type) {   //determines which stripe event occured  
            case 'customer.subscription.created':
                console.log("Subscription created")
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


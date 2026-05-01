"use server";

import { stripe } from "@/utils/stripe/api";
import { CartItem } from "../store/cart-store";
import { redirect } from "next/navigation";
import { dbGetUserInfo } from "@/utils/db/users";

export const checkoutAction = async (formData: FormData): Promise<void> => {
    const userId = formData.get("user") as string;
    //console.log(userId);
    if (!userId) {
        redirect('/login?from=%2Fcheckout')
    }

    const stripeId = (await dbGetUserInfo(userId)).at(0)?.stripe_id;
    const itemsJson = formData.get("items") as string;
    const items = JSON.parse(itemsJson);
    const line_items = items.map((item: CartItem) => ({
        price_data: {
            currency: "usd",
            product: item.id,
            unit_amount: item.price,
        },
        quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
        customer: stripeId ?? "",
        payment_method_types: ["card"],
        line_items,
        mode: "payment",
        success_url: `${process.env.NEXT_PUBLIC_WEBSITE_URL}/success`,
        cancel_url: `${process.env.NEXT_PUBLIC_WEBSITE_URL}/checkout`,
    });

    redirect(session.url!);
};

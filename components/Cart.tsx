"use client";

import Link from "next/link";
import { ShoppingCartIcon } from "lucide-react";
import { useCartStore } from "@/app/store/cart-store"

export const CartButton = () => {
    const { items } = useCartStore();

    const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <Link href="/checkout" className="relative left-2 hover:bg-accent hover:text-accent-foreground p-2 rounded-md">
            <ShoppingCartIcon className="h-6 w-6" />
            {cartCount > 0 && (
                <span className="absolute top-0 right-0 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                    {cartCount}
                </span>
            )}
        </Link>
    )

}
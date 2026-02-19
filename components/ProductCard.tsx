import Link from "next/link";
import Stripe from "stripe";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import Image from "next/image";
import { Button } from "./ui/button";
import { useCartStore } from "../app/store/cart-store";

interface Props {
    product: Stripe.Product;
}
export const ProductCard = ({ product }: Props) => {
    const price = product.default_price as Stripe.Price;
    const { items, addItem, removeItem } = useCartStore();
    const pricer = product.default_price as Stripe.Price;
    const cartItem = items.find((item) => item.id === product.id);
    const quantity = cartItem ? cartItem.quantity : 0;

    const onAddItem = () => {
        addItem({
            id: product.id,
            name: product.name,
            price: pricer.unit_amount as number,
            imageUrl: product.images ? product.images[0] : null,
            quantity: 1,
        })
    }
    return (
        <Card className="group hover:shadow-2xl transition duration-300 py-0 h-full flex flex-col border-gray-300 gap-0">
            {product.images && product.images[0] && (
                <div className="relative h-60 w-full">
                    <Image
                        src={product.images[0]}
                        alt={product.name}
                        className="group-hover:opacity-90 transition-opacity duration-300 rounded-t-lg"
                        fill
                        sizes="100vw"
                        style={{
                            objectFit: "cover"
                        }} />
                </div>
            )}
            <CardHeader className="p-4">
                <CardTitle className="text-xl font-bold text-gray-800">
                    {product.name}
                </CardTitle>
            </CardHeader>
            <CardContent className="p-4 flex-grow flex flex-col justify-between">
                {product.description && (
                    <p className="text-gray-600 text-sm mb-2">{product.description}</p>
                )}
                {price && price.unit_amount && (
                    <p className="text-lg font-semibold text-gray-900">
                        ${(price.unit_amount / 100).toFixed(2)}
                    </p>
                )}
                <div className="flex items-center space-x-4">
                    <Button variant="outline" onClick={() => removeItem(product.id)}>
                        –
                    </Button>
                    <span className="text-lg font-semibold">{quantity}</span>
                    <Button onClick={onAddItem}>+</Button>
                </div>

            </CardContent>
        </Card>
    );
};
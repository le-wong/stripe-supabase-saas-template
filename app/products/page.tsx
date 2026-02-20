import { ProductList } from "@/components/ProductList";
import { stripe } from "@/utils/stripe/api";
import DashboardHeader from "@/components/DashboardHeader";

export default async function ProductsPage() {
    const products = await stripe.products.list({
        expand: ["data.default_price"],
    });

    return (
        <div>
            <DashboardHeader />
            <div className="pb-8">
                <h1 className="text-3xl font-bold leading-none tracking-tight text-foreground text-center mb-8">
                    All Products
                </h1>
                <ProductList products={products.data} />
            </div>
        </div>
    );
}
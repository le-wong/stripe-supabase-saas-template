"use client";

import Stripe from "stripe";
import { ProductCard } from "./ProductCard";
import { useMemo, useState } from "react";

interface Props {
    products: Stripe.Product[];
}

const POSITION_TAGS = ["Electrician", "Plumber", "Contractor", "HVAC"] as const;
const STATE_TAGS = ["OR", "WA", "CA", "TX", "FL", "NY"] as const;

function normalizeSpaces(s: string) {
    return s.replace(/\s+/g, " ").trim();
}

function tokenizeWords(s: string) {
    const cleaned = s
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, " ")
        .trim();

    return cleaned ? cleaned.split(/\s+/).filter(Boolean) : [];
}

export const ProductList = ({ products }: Props) => {
    const [searchTerm, setSearchTerm] = useState<string>("");

    const activeTokens = useMemo(() => tokenizeWords(searchTerm), [searchTerm]);

    const onTagClick = (tag: string) => {
        setSearchTerm((prev) => {
            const tokens = tokenizeWords(prev);
            const t = tag.toLowerCase();

            // ✅ If already selected → remove it
            if (tokens.includes(t)) {
                const filtered = tokens.filter((token) => token !== t);
                return filtered.join(" ");
            }

            // ✅ Otherwise add it
            return normalizeSpaces(`${prev} ${tag}`);
        });
    };

    const onReset = () => setSearchTerm("");

    const filteredProducts = products.filter((product) => {
        if (activeTokens.length === 0) return true;

        const haystackText = `${product.name} ${product.description ?? ""}`;
        const productTokenSet = new Set(tokenizeWords(haystackText));

        return activeTokens.every((t) => productTokenSet.has(t));
    });

    const resetDisabled = activeTokens.length === 0;

    // Helper to style buttons
    const getTagClasses = (tag: string) => {
        const isActive = activeTokens.includes(tag.toLowerCase());

        return `
      rounded-full border px-3 py-1 text-sm transition
      ${isActive
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white border-gray-300 hover:bg-gray-50"
            }
    `;
    };

    return (
        <div>
            <div className="mb-4 space-y-3">
                {/* Positions */}
                <div className="flex flex-wrap items-center justify-center gap-2">
                    <span className="text-sm font-medium text-gray-600">
                        Step 1: Choose position:
                    </span>

                    {POSITION_TAGS.map((tag) => (
                        <button
                            key={tag}
                            type="button"
                            onClick={() => onTagClick(tag)}
                            className={getTagClasses(tag)}
                        >
                            {tag}
                        </button>
                    ))}
                </div>

                {/* States */}
                <div className="flex flex-wrap items-center justify-center gap-2">
                    <span className="text-sm font-medium text-gray-600">
                        Step 2: Choose state:
                    </span>

                    {STATE_TAGS.map((tag) => (
                        <button
                            key={tag}
                            type="button"
                            onClick={() => onTagClick(tag)}
                            className={getTagClasses(tag)}
                        >
                            {tag}
                        </button>
                    ))}
                </div>

                {/* Reset */}
                <div className="mt-3 flex justify-center">
                    <button
                        type="button"
                        onClick={onReset}
                        disabled={resetDisabled}
                        className="rounded-full border border-gray-300 bg-white px-4 py-1 text-sm hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Reset
                    </button>
                </div>
            </div>

            {/* PRODUCTS */}
            <ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredProducts.map((product) => (
                    <li key={product.id}>
                        <ProductCard product={product} />
                    </li>
                ))}
            </ul>
        </div>
    );
};
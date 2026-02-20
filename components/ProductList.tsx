"use client";

import Stripe from "stripe";
import { ProductCard } from "./ProductCard";
import { useMemo, useState } from "react";
import { Button } from "./ui/button";

interface Props {
    products: Stripe.Product[];
}

//TODO: get all from stripe products?
const POSITION_TAGS = ["Electrician", "Plumber", "Contractor", "HVAC"];
const STATE_TAGS = ["OR", "WA", "CA", "TX", "FL", "NY"];

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

function updateTokens(previousString: string, tag: string) {
    const tokens = tokenizeWords(previousString);
    const t = tag.toLowerCase();

    // ✅ If already selected → remove it
    if (tokens.includes(t)) {
        const filtered = tokens.filter((token) => token !== t);
        return filtered.join(" ");
    }

    // ✅ Otherwise add it
    return normalizeSpaces(`${previousString} ${tag}`);
}

export const ProductList = ({ products }: Props) => {
    const [searchState, setSearchState] = useState<string>("");
    const [searchPosition, setSearchPosition] = useState<string>("");

    const activePositionTokens = useMemo(() => tokenizeWords(searchPosition), [searchPosition]);
    const activeStateTokens = useMemo(() => tokenizeWords(searchState), [searchState]);

    const onTagClick = (tag: string) => {
        if (STATE_TAGS.includes(tag)) {
            setSearchState((prev) => {
                return updateTokens(prev, tag);
            });
        }
        else if (POSITION_TAGS.includes(tag)) {
            setSearchPosition((prev) => {
                return updateTokens(prev, tag);
            });
        }
    };

    const onReset = () => {
        setSearchState("");
        setSearchPosition("");
    }

    const filteredProducts = products.filter((product) => {
        if (activeStateTokens.length === 0 && activePositionTokens.length === 0) { return true; }

        const stateTags = new Set(tokenizeWords(`${product.metadata["state"] ?? ""}`));
        const positionTags = new Set(tokenizeWords(`${product.metadata["position"] ?? ""}`));

        return ((stateTags.size === 0 || activeStateTokens.every((t) => stateTags.has(t))) && (positionTags.size === 0 || activePositionTokens.every((t) => positionTags.has(t))));
    });

    const resetDisabled = (activeStateTokens.length === 0 && activePositionTokens.length === 0);

    // Helper to style buttons
    const getTagClasses = (tag: string) => {
        const isActive = (activePositionTokens.includes(tag.toLowerCase()) || activeStateTokens.includes(tag.toLowerCase()));

        return `
      rounded-full border px-3 py-1 text-sm transition
      ${isActive
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-black border-gray-300 hover:bg-gray-50"
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
                        <Button
                            key={tag}
                            onClick={() => onTagClick(tag)}
                            className={getTagClasses(tag)}
                        >
                            {tag}
                        </Button>
                    ))}
                </div>

                {/* States */}
                <div className="flex flex-wrap items-center justify-center gap-2">
                    <span className="text-sm font-medium text-gray-600">
                        Step 2: Choose state:
                    </span>

                    {STATE_TAGS.map((tag) => (
                        <Button
                            key={tag}
                            onClick={() => onTagClick(tag)}
                            className={getTagClasses(tag)}
                        >
                            {tag}
                        </Button>
                    ))}
                </div>

                {/* Reset */}
                <div className="mt-3 flex justify-center">
                    <Button
                        onClick={onReset}
                        disabled={resetDisabled}
                        className="rounded-full border border-gray-300 bg-white px-4 py-1 text-sm text-black hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Reset
                    </Button>
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
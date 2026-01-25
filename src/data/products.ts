// src/data/products.ts

export type ColorVariant = {
  name: string;          // e.g. "Black"
  slug: string;          // e.g. "black"
  image: string;         // e.g. "/images/airpods-max-black.png"
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  price: number;         // display price (e.g. 25)
  originalPrice?: number;
  currency: "GBP";
  description: string;
  shortDescription?: string;
  image: string;         // IMPORTANT: use /public images paths like "/images/xxx.png"
  variants?: ColorVariant[];
  featured?: boolean;
  tags?: string[];
};

export const products: Product[] = [
  {
    id: "airpods-pro-2",
    name: "AirPods Pro 2",
    slug: "airpods-pro-2",
    price: 10,
    originalPrice: 249,
    currency: "GBP",
    description:
      "In-ear noise-cancelling earbuds with a comfortable fit, great sound, and fast pairing.",
    shortDescription: "Noise cancelling • Comfortable fit • Great sound",
    image: "/images/airpods-pro-2.png",
    featured: true,
    tags: ["New"],
  },
  {
    id: "airpods-pro-3",
    name: "AirPods Pro 3",
    slug: "airpods-pro-3",
    price: 15,
    originalPrice: 279,
    currency: "GBP",
    description:
      "Premium in-ear earbuds with strong bass, clear vocals, and reliable connectivity.",
    shortDescription: "Premium sound • Strong bass • Reliable",
    image: "/images/airpods-pro-3.png",
    featured: true,
    tags: ["New"],
  },
  {
    id: "airpods-4s",
    name: "AirPods 4s",
    slug: "airpods-4s",
    price: 15,
    originalPrice: 179,
    currency: "GBP",
    description:
      "Everyday earbuds with clean audio, good mic quality, and easy charging.",
    shortDescription: "Clean audio • Good mic • Easy charging",
    image: "/images/airpods-4s.png",
    featured: true,
  },
  {
    id: "airpods-max",
    name: "AirPods Max",
    slug: "airpods-max",
    price: 25,
    originalPrice: 549,
    currency: "GBP",
    description:
      "Over-ear headphones with a premium look, strong bass, and comfortable fit.",
    shortDescription: "Over-ear • Premium look • Comfortable",
    // ✅ This is the one you pointed to in GitHub:
    image: "/images/airpods-max-black.png",
    featured: true,
    variants: [
      { name: "Black", slug: "black", image: "/images/airpods-max-black.png" },
      { name: "Silver", slug: "silver", image: "/images/airpods-max-silver.png" },
      { name: "Blue", slug: "blue", image: "/images/airpods-max-blue.png" },
      { name: "Green", slug: "green", image: "/images/airpods-max-green.png" },
      { name: "Pink", slug: "pink", image: "/images/airpods-max-pink.png" },
    ],
  },
];

/**
 * ✅ FIX: This is what Vercel says is missing.
 * ProductDetail imports it, so it MUST be exported.
 */
export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

/** Optional helpers (safe to keep) */
export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

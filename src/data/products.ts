// src/data/products.ts

export type ColorVariant = {
  name: string;
  slug: string;
  image: string; // URL or /public path
  price: number;
  originalPrice?: number;
  stripePriceId?: string;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  description: string;
  features: string[];
  price: number;
  originalPrice?: number;
  badge?: string;
  images: string[];
  variants?: ColorVariant[];
  stripePriceId?: string;
  category?: string;
  isFeatured?: boolean;
};

export const products: Product[] = [
  {
    id: "airpods-pro-2",
    slug: "airpods-pro-2",
    name: "AirPods Pro 2",
    description:
      "Premium in-ear wireless earbuds with active noise cancellation and transparency mode.",
    features: ["ANC + Transparency", "Charging case included", "Great bass + clarity"],
    price: 10,
    originalPrice: 249,
    badge: "New",
    images: [
      // Keep these as working external URLs so they never 404 on Vercel
      "https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/MQD83?wid=572&hei=572&fmt=jpeg&qlt=95&.v=1660803972361",
    ],
    stripePriceId: "airpods-pro-2", // keep if you map these in checkout
    category: "earbuds",
    isFeatured: true,
  },
  {
    id: "airpods-pro-3",
    slug: "airpods-pro-3",
    name: "AirPods Pro 3",
    description:
      "Latest gen AirPods with improved sound, better ANC, and upgraded comfort fit.",
    features: ["Improved ANC", "Better mic quality", "More comfortable fit"],
    price: 15,
    originalPrice: 279,
    badge: "New",
    images: [
      "https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/MTJV3?wid=572&hei=572&fmt=jpeg&qlt=95&.v=1693594197615",
    ],
    stripePriceId: "airpods-pro-3",
    category: "earbuds",
    isFeatured: true,
  },
  {
    id: "airpods-4s",
    slug: "airpods-4s",
    name: "AirPods 4s",
    description:
      "Lightweight earbuds with clean sound, strong battery, and a reliable everyday fit.",
    features: ["Clean sound", "Good battery", "Comfort fit"],
    price: 15,
    originalPrice: 179,
    badge: "New",
    images: [
      "https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/MME73?wid=572&hei=572&fmt=jpeg&qlt=95&.v=1632861342000",
    ],
    stripePriceId: "airpods-4s",
    category: "earbuds",
    isFeatured: true,
  },

  // ✅ AirPods Max (BLACK) — your local file is in /public, so use "/airpods-max-black.png"
  {
    id: "airpods-max",
    slug: "airpods-max",
    name: "AirPods Max",
    description:
      "Over-ear headphones with premium build, spatial audio, and strong noise cancellation.",
    features: ["Over-ear ANC", "Premium build", "Spatial audio"],
    price: 25,
    originalPrice: 549,
    images: ["/airpods-max-black.png"],
    stripePriceId: "airpods-max",
    category: "headphones",
    isFeatured: true,
  },
];

// ✅ REQUIRED by ProductDetail.tsx
export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

// Helpful utilities (safe)
export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function getProductByPriceId(stripePriceId: string): Product | undefined {
  return products.find((p) => p.stripePriceId === stripePriceId);
}

export const featuredProducts = products.filter((p) => p.isFeatured);

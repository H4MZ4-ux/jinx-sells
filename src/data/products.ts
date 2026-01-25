// src/data/products.ts

export type ColorVariant = {
  name: string;
  slug: string;
  image: string; // public URL path (served from /public)
};

export type Product = {
  id: string;
  name: string;
  slug: string;

  price: number;
  originalPrice?: number;

  image: string; // public URL path (served from /public)
  shortDescription?: string;
  description: string;

  variants?: ColorVariant[];
  featured?: boolean;
};

export const products: Product[] = [
  {
    id: "airpods-pro-2",
    name: "AirPods Pro 2",
    slug: "airpods-pro-2",
    price: 10,
    originalPrice: 249,
    image: "https://cdsassets.apple.com/live/7WUAS350/images/tech-specs/airpods-pro-2.png",
    shortDescription: "Noise cancelling, great fit, clean audio.",
    description:
      "Premium earbuds with active noise cancelling, transparency mode, and a comfortable in-ear fit. Includes charging case.",
    featured: true,
  },
  {
    id: "airpods-pro-3",
    name: "AirPods Pro 3",
    slug: "airpods-pro-3",
    price: 15,
    originalPrice: 279,
    image: "https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/airpods-pro-3-hero-select-202509_FMT_WHH?wid=752&hei=636&fmt=jpeg&qlt=90&.v=1758077264181",
    shortDescription: "Upgraded sound + ANC, all-day use.",
    description:
      "High quality wireless earbuds with solid bass, crisp vocals, and improved noise cancelling. Includes charging case.",
    featured: true,
  },
  {
    id: "airpods-4s",
    name: "AirPods 4s",
    slug: "airpods-4s",
    price: 15,
    originalPrice: 179,
    image: "https://m.media-amazon.com/images/I/61DvMw16ITL.jpg",
    shortDescription: "Lightweight, smooth sound, easy pairing.",
    description:
      "Comfortable earbuds with stable connection and clear audio. Great for everyday listening and calls.",
    featured: true,
  },
  {
    id: "airpods-max",
    name: "AirPods Max",
    slug: "airpods-max",
    price: 25,
    originalPrice: 549,
    // You said this file exists in /public already:
    // screenshot shows: public/airpods-max-black.png
    image: "/airpods-max-black.png",
    shortDescription: "Over-ear, premium look, immersive sound.",
    description:
      "Over-ear headphones with excellent comfort and big, immersive audio. Includes smart case.",
    featured: true,
    variants: [
      { name: "Black", slug: "black", image: "/airpods-max-black.png" },
      // If you add these files later, these will start working automatically:
      { name: "Silver", slug: "silver", image: "/images/airpods-max-silver.png" },
      { name: "Blue", slug: "blue", image: "/images/airpods-max-blue.png" },
      { name: "Pink", slug: "pink", image: "/images/airpods-max-pink.png" },
      { name: "Green", slug: "green", image: "/images/airpods-max-green.png" },
    ],
  },
];

// ✅ This is what your build error is about.
// ProductDetail imports this, so it MUST exist + be exported.
export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

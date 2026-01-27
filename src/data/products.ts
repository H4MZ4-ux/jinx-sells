// src/data/products.ts

export type ColorVariant = {
  name: string;
  slug: string;
  image: string; // public URL path (served from /public) OR full https URL
};

export type Product = {
  id: string;
  name: string;
  slug: string;

  price: number;
  originalPrice?: number;

  image: string; // public URL path (served from /public) OR full https URL
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
    image: "https://bsimg.nl/images/apple-airpods-pro-3_1.png/DZdlObf2P0n3dT2c-aWlszPk5Cs%3D/fit-in/365x365/filters%3Aformat%28png%29%3Aupscale%28%29",
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
    image: "https://econtent.o2.co.uk/o/econtent/media/get/ac6a81c1-ec02-40c5-a39b-d505acdc7aa6",
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

    // Default image (black)
    image: "/airpods-max-black.png",

    shortDescription: "Over-ear, premium look, immersive sound.",
    description:
      "Over-ear headphones with excellent comfort and big, immersive audio. Includes smart case.",
    featured: true,

    // ✅ Make sure you actually ADD these files into /public/images/
    // public/images/airpods-max-blue.png etc...
    variants: [
      { name: "Black", slug: "black", image: "/airpods-max-black.png" },
      { name: "Blue", slug: "blue", image: "/images/airpods-max-blue.png" },
      { name: "White", slug: "white", image: "/images/airpods-max-white.png" },
      { name: "Purple", slug: "purple", image: "/images/airpods-max-purple.png" },
      { name: "Pink", slug: "pink", image: "/images/airpods-max-pink.png" },
      { name: "Green", slug: "green", image: "/images/airpods-max-green.png" },
    ],
  },
  {
    id: "iphone-17-pro-max-orange",
    name: "iPhone 17 Pro Max",
    slug: "iphone-17-pro-max",
    price: 110,
    originalPrice: 1499,
    image:
      "https://cdsassets.apple.com/live/7WUAS350/images/tech-specs/iphone-17-pro-17-pro-max-hero.png",
    shortDescription: "Orange only. Big screen, premium feel.",
    description:
      "iPhone 17 Pro Max in Orange. Premium build, fast performance, and an incredible display.",
    featured: true,
    variants: [{ name: "Orange", slug: "orange", image:
      "https://cdsassets.apple.com/live/7WUAS350/images/tech-specs/iphone-17-pro-17-pro-max-hero.png"
    }],
  },
];

// ✅ MUST exist because ProductDetail imports it
export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

// src/data/products.ts

export type ColorVariant = {
  name: string;
  slug: string;
  image: string; // public URL path OR full external URL
};

export type Product = {
  id: string;
  name: string;
  slug: string;

  price: number;
  originalPrice?: number;

  image: string;
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
    image:
      "https://cdsassets.apple.com/live/7WUAS350/images/tech-specs/airpods-pro-2.png",
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
    image:
      "https://bsimg.nl/images/apple-airpods-pro-3_1.png/DZdlObf2P0n3dT2c-aWlszPk5Cs%3D/fit-in/365x365/filters%3Aformat%28png%29%3Aupscale%28%29",
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
    image:
      "https://econtent.o2.co.uk/o/econtent/media/get/ac6a81c1-ec02-40c5-a39b-d505acdc7aa6",
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
    image: "/airpods-max-black.png",
    shortDescription: "Over-ear, premium look, immersive sound.",
    description:
      "Over-ear headphones with excellent comfort and big, immersive audio. Includes smart case.",
    featured: true,
    variants: [
      { name: "Black", slug: "black", image: "/airpods-max-black.png" },
      { name: "Blue", slug: "blue", image: "/airpods-max-blue.png" },
      { name: "White", slug: "white", image: "/airpods-max-white.png" },
      { name: "Purple", slug: "purple", image: "/airpods-max-purple.png" },
      { name: "Pink", slug: "pink", image: "/airpods-max-pink.png" },
      { name: "Green", slug: "green", image: "/airpods-max-green.png" },
    ],
  },

  // 🔥 iPhone
  {
    id: "iphone-17-pro-max",
    name: "iPhone 17 Pro Max *NEW*",
    slug: "iphone-17-pro-max",
    price: 110,
    originalPrice: 1199,
    image:
      "https://cdsassets.apple.com/live/7WUAS350/images/tech-specs/iphone-17-pro-17-pro-max-hero.png",
    shortDescription: "Large display, powerful performance.",
    description:
      "iPhone 17 Pro Max featuring a large display, top-tier performance, and premium build quality. Available exclusively in Orange.",
    featured: true,
    variants: [
      {
        name: "Orange",
        slug: "orange",
        image:
          "https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-15-pro-max-orange?wid=532&hei=582&fmt=png-alpha",
      },
    ],
  },

  // 🔥 NEW PRODUCTS YOU REQUESTED

  {
    id: "dyson-airwrap",
    name: "Dyson Airwrap",
    slug: "dyson-airwrap",
    price: 30,
    originalPrice: 549,
    image: "/dyson-airwrap.png",
    shortDescription: "Multi-styler for curls, waves and smoothing.",
    description:
      "Dyson Airwrap multi-styler with multiple attachments for styling hair without extreme heat damage.",
    featured: true,
  },
  {
    id: "dyson-supersonic",
    name: "Dyson Supersonic",
    slug: "dyson-supersonic",
    price: 30,
    originalPrice: 329,
    image: "/dyson-supersonic.png",
    shortDescription: "Fast drying with intelligent heat control.",
    description:
      "Dyson Supersonic hair dryer engineered for fast drying and precise styling without extreme heat.",
    featured: true,
  },
  {
    id: "apple-watch-series-11",
    name: "Apple Watch Series 11",
    slug: "apple-watch-series-11",
    price: 30,
    originalPrice: 399,
    image: "/apple-watch-series-11.png",
    shortDescription: "Advanced health and fitness tracking.",
    description:
      "Apple Watch Series 11 with enhanced health sensors, fitness tracking, and a brighter display.",
    featured: true,
  },
  {
    id: "apple-watch-mens",
    name: "Apple Watch (Men’s)",
    slug: "apple-watch-mens",
    price: 30,
    originalPrice: 399,
    image: "/apple-watch-mens.png",
    shortDescription: "Apple Watch with men’s band style.",
    description:
      "Apple Watch configured with a men’s band option, combining performance and style.",
    featured: true,
  },
  {
    id: "rayban-meta-glasses",
    name: "Ray-Ban Meta Smart Glasses",
    slug: "rayban-meta-glasses",
    price: 30,
    originalPrice: 299,
    image: "/rayban-meta.png",
    shortDescription: "Smart glasses with camera and audio.",
    description:
      "Ray-Ban Meta smart glasses featuring hands-free photo capture, audio playback, and sleek design.",
    featured: true,
  },
];

// ✅ REQUIRED by ProductDetail.tsx
export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

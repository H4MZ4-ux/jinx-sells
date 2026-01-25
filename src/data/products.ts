export interface ColorVariant {
  name: string;
  color: string; // CSS color value for the swatch
  slug: string; // Used for Stripe price lookup
  image: string;
}

export interface Product {
  id: number;
  slug: string;
  name: string;
  price: number;
  originalPrice: number;
  image: string;
  isNew: boolean;
  description: string;
  features: string[];
  colorVariants?: ColorVariant[];
}

// Use a hosted image so Vercel build never fails due to missing local assets.
const airpodsMaxImage =
  "https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/airpods-max-select-midnight-202409?wid=400&hei=400&fmt=jpeg&qlt=95";

export const products: Product[] = [
  {
    id: 1,
    slug: "airpods-pro-2",
    name: "AirPods Pro 2",
    price: 10,
    originalPrice: 249,
    image:
      "https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/MQD83?wid=400&hei=400&fmt=jpeg&qlt=95&.v=1660803972361",
    isNew: true,
    description:
      "The AirPods Pro 2 deliver up to 2x more Active Noise Cancellation than the previous generation. Adaptive Transparency lets you hear the world around you while also reducing loud noises in real time.",
    features: [
      "Active Noise Cancellation",
      "Adaptive Transparency",
      "Personalized Spatial Audio",
      "Up to 6 hours of listening time",
      "MagSafe Charging Case",
      "Touch control for volume",
    ],
  },
  {
    id: 2,
    slug: "airpods-pro-3",
    name: "AirPods Pro 3",
    price: 15,
    originalPrice: 279,
    image:
      "https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/MQD83?wid=400&hei=400&fmt=jpeg&qlt=95&.v=1660803972361",
    isNew: true,
    description:
      "The latest AirPods Pro 3 feature enhanced audio performance, improved noise cancellation, and longer battery life. Experience crystal-clear sound with the H2 chip.",
    features: [
      "Next-gen Active Noise Cancellation",
      "Enhanced Adaptive Transparency",
      "Improved H2 chip",
      "Up to 8 hours of listening time",
      "USB-C MagSafe Case",
      "Conversation Awareness",
    ],
  },
  {
    id: 3,
    slug: "airpods-4s",
    name: "AirPods 4s",
    price: 15,
    originalPrice: 179,
    image:
      "https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/MME73?wid=400&hei=400&fmt=jpeg&qlt=95&.v=1632861342000",
    isNew: false,
    description:
      "AirPods 4s deliver an all-new design with improved comfort and audio quality. Perfect for everyday listening with seamless device switching.",
    features: [
      "Personalized Spatial Audio",
      "Adaptive EQ",
      "Force sensor controls",
      "Up to 6 hours of listening time",
      "Quick charging case",
      "Sweat and water resistant",
    ],
  },
  {
    id: 4,
    slug: "airpods-max",
    name: "AirPods Max",
    price: 25,
    originalPrice: 549,
    image: airpodsMaxImage,
    isNew: false,
    description:
      "AirPods Max combine high-fidelity audio with industry-leading Active Noise Cancellation. The over-ear design features breathable knit mesh and memory foam ear cushions.",
    features: [
      "High-Fidelity Audio",
      "Active Noise Cancellation",
      "Transparency mode",
      "Up to 20 hours of listening time",
      "Digital Crown for control",
      "Premium build quality",
    ],
    colorVariants: [
      {
        name: "Midnight",
        color: "#1d1d1f",
        slug: "airpods-max-midnight",
        image: airpodsMaxImage,
      },
      {
        name: "Silver",
        color: "#e3e4e5",
        slug: "airpods-max-silver",
        image: airpodsMaxImage,
      },
      {
        name: "Blue",
        color: "#5eb0e5",
        slug: "airpods-max-purple",
        image: airpodsMaxImage,
      },
      {
        name: "Green",
        color: "#aed4b6",
        slug: "airpods-max-green",
        image: airpodsMaxImage,
      },
      {
        name: "Green",
        color: "#aed4b6",
        slug: "airpods-max-white",
        image: airpodsMaxImage,
      },
      {
        name: "Pink",
        color: "#f5c3c8",
        slug: "airpods-max-pink",
        image: airpodsMaxImage,
      },
    ],
  },
];

export const getProductBySlug = (slug: string): Product | undefined => {
  return products.find((p) => p.slug === slug);
};

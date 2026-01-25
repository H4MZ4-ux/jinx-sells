export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  badge?: string;
  description?: string;
}

export const products: Product[] = [
  {
    id: "airpods-pro-2",
    name: "AirPods Pro 2",
    price: 10,
    originalPrice: 249,
    image: "/images/airpods-pro-2.png",
    badge: "New",
  },
  {
    id: "airpods-pro-3",
    name: "AirPods Pro 3",
    price: 15,
    originalPrice: 279,
    image: "/images/airpods-pro-3.png",
    badge: "New",
  },
  {
    id: "airpods-4s",
    name: "AirPods 4s",
    price: 15,
    originalPrice: 179,
    image: "/images/airpods-4s.png",
  },
  {
    id: "airpods-max",
    name: "AirPods Max",
    price: 25,
    originalPrice: 549,
    image: "/images/airpods-max-black.png",
  },
];

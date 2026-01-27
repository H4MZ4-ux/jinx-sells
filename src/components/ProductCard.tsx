import { Link } from "react-router-dom";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Product } from "@/data/products";
import { useCart } from "@/context/CartContext";

type Props = {
  product: Product;
};

export default function ProductCard({ product }: Props) {
  const { addItem } = useCart();

  const priceText = new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
  }).format(product.price);

  const originalText =
    product.originalPrice != null
      ? new Intl.NumberFormat("en-GB", {
          style: "currency",
          currency: "GBP",
          maximumFractionDigits: 0,
        }).format(product.originalPrice)
      : null;

  return (
    <Link
      to={`/product/${product.slug}`}
      className="group block rounded-2xl border bg-card p-4 card-shadow"
    >
      <div className="aspect-square w-full overflow-hidden rounded-xl bg-muted">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-[1.02]"
          loading="lazy"
        />
      </div>

      <div className="mt-4 flex items-start justify-between gap-3">
        <div>
          <div className="font-semibold">{product.name}</div>

          <div className="mt-1 flex items-end gap-2">
            <div className="text-lg font-bold">{priceText}</div>
            {originalText ? (
              <div className="text-sm text-muted-foreground line-through">
                {originalText}
              </div>
            ) : null}
          </div>
        </div>

        {product.featured ? (
          <span className="rounded-full bg-primary/15 px-3 py-1 text-xs text-primary">
            NEW
          </span>
        ) : null}
      </div>

      <Button
        className="mt-4 w-full gap-2"
        onClick={(e) => {
          // ✅ THIS is the important bit. Without this, the Link/card click wins.
          e.preventDefault();
          e.stopPropagation();

          addItem({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1,
            slug: product.slug,
          });
        }}
      >
        <ShoppingBag size={18} />
        Add to cart
      </Button>
    </Link>
  );
}

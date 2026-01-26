import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingBag, X } from "lucide-react";

import type { Product, ColorVariant } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<ColorVariant | null>(null);

  const hasVariants = !!product.variants?.length;

  const displayImage = useMemo(() => {
    return selected?.image ?? product.image;
  }, [selected, product.image]);

  const onQuickAdd = () => {
    if (hasVariants) {
      setOpen(true);
      return;
    }
    addToCart(product, null);
  };

  const confirmAdd = () => {
    addToCart(product, selected);
    setOpen(false);
    setSelected(null);
  };

  return (
    <>
      <div className="group relative rounded-2xl border bg-card p-4">
        <Link to={`/product/${product.slug}`} className="block">
          <div className="aspect-square w-full overflow-hidden rounded-xl bg-muted">
            <img
              src={product.image}
              alt={product.name}
              className="h-full w-full object-contain transition group-hover:scale-[1.02]"
              loading="lazy"
            />
          </div>

          <div className="mt-4">
            <div className="flex items-center justify-between gap-3">
              <h3 className="font-semibold">{product.name}</h3>
              {product.featured ? (
                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
                  NEW
                </span>
              ) : null}
            </div>

            <div className="mt-2 flex items-end gap-2">
              <div className="text-lg font-semibold">
                £{Math.round(product.price)}
              </div>
              {product.originalPrice != null ? (
                <div className="text-sm text-muted-foreground line-through">
                  £{Math.round(product.originalPrice)}
                </div>
              ) : null}
            </div>
          </div>
        </Link>

        <Button
          className="mt-4 w-full gap-2"
          onClick={onQuickAdd}
          type="button"
        >
          <ShoppingBag size={18} />
          Add to cart
        </Button>
      </div>

      {/* Variant picker modal */}
      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-lg rounded-2xl border bg-card p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-xl font-semibold">Choose a colour</h3>
                <p className="mt-1 text-sm text-muted-foreground">{product.name}</p>
              </div>
              <button
                onClick={() => {
                  setOpen(false);
                  setSelected(null);
                }}
                className="rounded-full p-2 hover:bg-muted"
                type="button"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div className="aspect-square overflow-hidden rounded-xl bg-muted">
                <img
                  src={displayImage}
                  alt={product.name}
                  className="h-full w-full object-contain"
                  loading="lazy"
                />
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Colours</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {product.variants?.map((v) => {
                    const active = selected?.slug === v.slug;
                    return (
                      <button
                        key={v.slug}
                        onClick={() => setSelected(v)}
                        className={[
                          "rounded-full border px-3 py-1 text-sm transition",
                          active
                            ? "border-primary bg-primary/10"
                            : "border-border hover:bg-muted",
                        ].join(" ")}
                        type="button"
                      >
                        {v.name}
                      </button>
                    );
                  })}
                </div>

                <Button
                  className="mt-5 w-full"
                  onClick={confirmAdd}
                  disabled={!selected}
                  type="button"
                >
                  Add {selected ? `(${selected.name})` : ""} to cart
                </Button>

                <Button
                  className="mt-2 w-full"
                  variant="ghost"
                  onClick={() => {
                    setOpen(false);
                    setSelected(null);
                  }}
                  type="button"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

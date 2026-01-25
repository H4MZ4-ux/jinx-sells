// src/pages/ProductDetail.tsx

import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ShoppingBag } from "lucide-react";

import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { getProductBySlug, ColorVariant } from "@/data/products";
import { useCart } from "@/context/CartContext";

export default function ProductDetail() {
  const navigate = useNavigate();
  const { slug } = useParams<{ slug: string }>();
  const { addItem } = useCart();

  const product = useMemo(() => {
    if (!slug) return undefined;
    return getProductBySlug(slug);
  }, [slug]);

  const [selectedVariant, setSelectedVariant] = useState<ColorVariant | null>(
    null
  );

  const displayImage = selectedVariant?.image ?? product?.image;

  if (!product) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Header />
        <div className="mx-auto max-w-5xl px-4 py-10">
          <Button variant="ghost" onClick={() => navigate(-1)} className="gap-2">
            <ArrowLeft size={18} />
            Back
          </Button>

          <div className="mt-8 rounded-xl border p-6">
            <h1 className="text-2xl font-semibold">Product not found</h1>
            <p className="mt-2 text-muted-foreground">
              The product link may be wrong or the item was removed.
            </p>
            <Button className="mt-6" onClick={() => navigate("/catalog")}>
              Go to Catalog
            </Button>
          </div>
        </div>
      </div>
    );
  }

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

  const onAddToCart = () => {
    addItem({
      id: product.id + (selectedVariant ? `-${selectedVariant.slug}` : ""),
      name: product.name + (selectedVariant ? ` - ${selectedVariant.name}` : ""),
      price: product.price,
      image: displayImage || product.image,
      quantity: 1,
      slug: product.slug,
    });

    navigate("/cart");
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <div className="mx-auto max-w-5xl px-4 py-10">
        <Button variant="ghost" onClick={() => navigate(-1)} className="gap-2">
          <ArrowLeft size={18} />
          Back
        </Button>

        <div className="mt-6 grid gap-8 md:grid-cols-2">
          <div className="rounded-2xl border bg-card p-6">
            <div className="aspect-square w-full overflow-hidden rounded-xl bg-muted">
              <img
                src={displayImage || product.image}
                alt={product.name}
                className="h-full w-full object-contain"
                loading="lazy"
              />
            </div>

            {product.variants?.length ? (
              <div className="mt-5">
                <p className="text-sm text-muted-foreground">Colours</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {product.variants.map((v) => {
                    const active = selectedVariant?.slug === v.slug;
                    return (
                      <button
                        key={v.slug}
                        onClick={() => setSelectedVariant(v)}
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
                  <button
                    onClick={() => setSelectedVariant(null)}
                    className={[
                      "rounded-full border px-3 py-1 text-sm transition",
                      selectedVariant === null
                        ? "border-primary bg-primary/10"
                        : "border-border hover:bg-muted",
                    ].join(" ")}
                    type="button"
                  >
                    Default
                  </button>
                </div>
              </div>
            ) : null}
          </div>

          <div className="rounded-2xl border bg-card p-6">
            <h1 className="text-3xl font-bold">{product.name}</h1>

            <div className="mt-3 flex items-end gap-3">
              <div className="text-2xl font-semibold">{priceText}</div>
              {originalText ? (
                <div className="text-muted-foreground line-through">
                  {originalText}
                </div>
              ) : null}
            </div>

            {product.shortDescription ? (
              <p className="mt-3 text-muted-foreground">
                {product.shortDescription}
              </p>
            ) : null}

            <p className="mt-4 leading-relaxed">{product.description}</p>

            <Button className="mt-8 w-full gap-2" onClick={onAddToCart}>
              <ShoppingBag size={18} />
              Add to cart
            </Button>

            <p className="mt-3 text-xs text-muted-foreground">
              You’ll complete payment securely via Stripe on checkout.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

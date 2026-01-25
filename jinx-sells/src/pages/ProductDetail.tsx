import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Check, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getProductBySlug, ColorVariant } from "@/data/products";
import { useCart } from "@/context/CartContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartSidebar from "@/components/CartSidebar";

const ProductDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const product = getProductBySlug(slug || "");
  const [selectedColor, setSelectedColor] = useState<ColorVariant | undefined>(
    product?.colorVariants?.[0]
  );

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Product not found</h1>
          <Button onClick={() => navigate("/")}>Go Home</Button>
        </div>
      </div>
    );
  }

  const currentImage = selectedColor?.image || product.image;

  const handleAddToCart = () => {
    addToCart(product, selectedColor);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <CartSidebar />
      
      <main className="container mx-auto px-6 py-12">
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <div className="grid md:grid-cols-2 gap-12 lg:gap-20">
          {/* Product Image */}
          <div className="bg-secondary/50 rounded-2xl p-12 flex items-center justify-center aspect-square">
            <img
              src={currentImage}
              alt={product.name}
              className="max-w-full max-h-full object-contain"
            />
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            {product.isNew && (
              <span className="inline-block w-fit px-3 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded-full mb-4">
                New
              </span>
            )}
            
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{product.name}</h1>
            
            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl font-bold text-primary">£{product.price}</span>
              <span className="text-xl text-muted-foreground line-through">£{product.originalPrice}</span>
              <span className="px-2 py-1 bg-green-100 text-green-700 text-sm font-medium rounded">
                Save £{product.originalPrice - product.price}
              </span>
            </div>

            <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
              {product.description}
            </p>

            {/* Color Selection */}
            {product.colorVariants && product.colorVariants.length > 0 && (
              <div className="mb-8">
                <h3 className="font-semibold mb-4">
                  Color: <span className="text-muted-foreground font-normal">{selectedColor?.name}</span>
                </h3>
                <div className="flex gap-3">
                  {product.colorVariants.map((variant) => (
                    <button
                      key={variant.slug}
                      onClick={() => setSelectedColor(variant)}
                      className={`w-10 h-10 rounded-full transition-all flex items-center justify-center ${
                        selectedColor?.slug === variant.slug
                          ? "ring-2 ring-primary ring-offset-2 ring-offset-background"
                          : "hover:scale-110"
                      }`}
                      style={{ backgroundColor: variant.color }}
                      title={variant.name}
                    >
                      {selectedColor?.slug === variant.slug && (
                        <Check 
                          className="w-4 h-4" 
                          style={{ 
                            color: variant.name === "Silver" || variant.name === "Pink" || variant.name === "Green" || variant.name === "Blue" 
                              ? "#1d1d1f" 
                              : "#ffffff" 
                          }} 
                        />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Features */}
            <div className="mb-8">
              <h3 className="font-semibold mb-4">Features</h3>
              <ul className="space-y-3">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                      <Check className="w-3 h-3 text-primary" />
                    </div>
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Add to Cart */}
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground py-6 text-lg font-medium mt-auto"
              onClick={handleAddToCart}
            >
              <ShoppingBag className="w-5 h-5 mr-2" />
              Add to Cart - £{product.price}
            </Button>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-border">
              <div className="text-center">
                <p className="text-sm font-medium">Free Shipping</p>
                <p className="text-xs text-muted-foreground">On all UK orders</p>
              </div>
              <div className="text-center">
                <p className="text-sm font-medium">30-Day Returns</p>
                <p className="text-xs text-muted-foreground">Hassle-free</p>
              </div>
              <div className="text-center">
                <p className="text-sm font-medium">Authentic</p>
                <p className="text-xs text-muted-foreground">100% Verified</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetail;

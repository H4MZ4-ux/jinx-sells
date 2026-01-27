import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { Product } from "@/data/products";
import { useNavigate } from "react-router-dom";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/product/${product.slug}`);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product);
  };

  return (
    <div 
      className="group bg-card rounded-xl overflow-hidden card-shadow border border-border cursor-pointer"
      onClick={handleClick}
    >
      {/* Image Container */}
      <div className="relative aspect-square bg-secondary/50 flex items-center justify-center p-8 overflow-hidden">
        {product.isNew && (
          <span className="absolute top-4 left-4 px-3 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded-full">
            New
          </span>
        )}
        <img
          src={product.image}
          alt={product.name}
          className="w-3/4 h-auto object-contain transition-transform duration-500 group-hover:scale-110"
        />
        
        {/* Quick Add Button - appears on hover */}
        <div className="absolute inset-x-4 bottom-4 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
          <Button 
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
            onClick={handleAddToCart}
          >
            Add to Cart
          </Button>
        </div>
      </div>

      {/* Info */}
      <div className="p-5">
        <h3 className="font-medium text-foreground mb-2 group-hover:text-primary transition-colors">
          {product.name}
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold text-foreground">£{product.price}</span>
          <span className="text-sm text-muted-foreground line-through">£{product.originalPrice}</span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

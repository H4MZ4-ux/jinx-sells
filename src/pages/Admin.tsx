import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { products } from "@/data/products";
import { Save, ArrowLeft, Loader2 } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartSidebar from "@/components/CartSidebar";

interface StockItem {
  product_slug: string;
  stock_quantity: number;
}

const Admin = () => {
  const [stockLevels, setStockLevels] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();

  // Redirect to auth if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchStock();
    }
  }, [user]);

  const fetchStock = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("product_stock")
        .select("product_slug, stock_quantity");

      if (error) throw error;

      const levels: Record<string, number> = {};
      (data as StockItem[]).forEach((item) => {
        levels[item.product_slug] = item.stock_quantity;
      });
      setStockLevels(levels);
    } catch (error) {
      console.error("Error fetching stock:", error);
      toast({
        title: "Error",
        description: "Failed to fetch stock levels.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStockChange = (slug: string, value: string) => {
    const numValue = parseInt(value) || 0;
    setStockLevels((prev) => ({ ...prev, [slug]: numValue }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      for (const [slug, quantity] of Object.entries(stockLevels)) {
        const { error } = await supabase
          .from("product_stock")
          .upsert(
            { product_slug: slug, stock_quantity: quantity },
            { onConflict: "product_slug" }
          );

        if (error) throw error;
      }

      toast({
        title: "Saved!",
        description: "Stock levels have been updated.",
      });
    } catch (error) {
      console.error("Error saving stock:", error);
      toast({
        title: "Error",
        description: "Failed to save stock levels.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const getAllProductSlugs = () => {
    const slugs: { slug: string; name: string }[] = [];
    
    products.forEach((product) => {
      if (product.colorVariants && product.colorVariants.length > 0) {
        product.colorVariants.forEach((variant) => {
          slugs.push({ slug: variant.slug, name: `${product.name} - ${variant.name}` });
        });
      } else {
        slugs.push({ slug: product.slug, name: product.name });
      }
    });
    
    return slugs;
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <CartSidebar />
      
      <main className="flex-1 container mx-auto px-6 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold">Stock Management</h1>
              <p className="text-muted-foreground mt-1">Update product stock levels</p>
            </div>
            <Button variant="outline" onClick={() => navigate("/")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Store
            </Button>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
              <p className="text-muted-foreground">Loading stock levels...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {getAllProductSlugs().map(({ slug, name }) => (
                <div
                  key={slug}
                  className="flex items-center justify-between bg-card rounded-lg border border-border p-4"
                >
                  <span className="font-medium">{name}</span>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      min="0"
                      value={stockLevels[slug] ?? 0}
                      onChange={(e) => handleStockChange(slug, e.target.value)}
                      className="w-24 text-center"
                    />
                    <span className="text-muted-foreground text-sm">units</span>
                  </div>
                </div>
              ))}

              <Button
                className="w-full mt-6"
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                {saving ? "Saving..." : "Save All Changes"}
              </Button>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Admin;

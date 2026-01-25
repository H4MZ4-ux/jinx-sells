import Header from "@/components/Header";
import Hero from "@/components/Hero";
import FeaturedProducts from "@/components/FeaturedProducts";
import Features from "@/components/Features";
import Footer from "@/components/Footer";
import CartSidebar from "@/components/CartSidebar";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <CartSidebar />
      <Hero />
      <Features />
      <FeaturedProducts />
      <Footer />
    </div>
  );
};

export default Index;

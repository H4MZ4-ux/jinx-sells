import { useState } from "react";
import { Search, User, ShoppingBag, Menu, X } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { Link, useNavigate, useLocation } from "react-router-dom";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { totalItems, setIsCartOpen } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavClick = (href: string) => {
    setIsMenuOpen(false);
    
    if (href === "/contact") {
      navigate("/contact");
    } else if (href === "/#catalog") {
      if (location.pathname === "/") {
        document.getElementById("catalog")?.scrollIntoView({ behavior: "smooth" });
      } else {
        navigate("/");
        setTimeout(() => {
          document.getElementById("catalog")?.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    } else {
      navigate(href);
    }
  };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Catalog", href: "/#catalog" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Search Icon */}
          <button className="p-2 hover:text-primary transition-colors">
            <Search className="w-5 h-5" />
          </button>

          {/* Logo */}
          <Link to="/" className="absolute left-1/2 -translate-x-1/2">
            <h1 className="text-2xl font-bold tracking-tight">
              <span className="gradient-text">JINX SELS</span>
            </h1>
          </Link>

          {/* Right Icons */}
          <div className="flex items-center gap-4">
            <button className="p-2 hover:text-primary transition-colors hidden md:block">
              <User className="w-5 h-5" />
            </button>
            <button 
              className="p-2 hover:text-primary transition-colors relative"
              onClick={() => setIsCartOpen(true)}
            >
              <ShoppingBag className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            </button>
            <button 
              className="p-2 hover:text-primary transition-colors md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className={`${isMenuOpen ? 'block' : 'hidden'} md:block mt-4 md:mt-2`}>
          <ul className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-8 py-4 md:py-0">
            {navLinks.map((link) => (
              <li key={link.name}>
                <button
                  onClick={() => handleNavClick(link.href)}
                  className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors relative group"
                >
                  {link.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;

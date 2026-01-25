import { Instagram, Twitter, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer id="contact" className="bg-foreground text-background py-16">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <h2 className="text-2xl font-bold mb-4">
              <span className="gradient-text">JINX</span>
            </h2>
            <p className="text-background/60 mb-6 max-w-sm">
              Your trusted source for premium AirPods replicas at unbeatable prices.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center hover:bg-primary transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center hover:bg-primary transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center hover:bg-primary transition-colors">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-background/60 hover:text-primary transition-colors">Home</a></li>
              <li><a href="#catalog" className="text-background/60 hover:text-primary transition-colors">Catalog</a></li>
              <li><a href="#" className="text-background/60 hover:text-primary transition-colors">About Us</a></li>
              <li><a href="#contact" className="text-background/60 hover:text-primary transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-background/60 hover:text-primary transition-colors">FAQs</a></li>
              <li><a href="#" className="text-background/60 hover:text-primary transition-colors">Shipping Info</a></li>
              <li><a href="#" className="text-background/60 hover:text-primary transition-colors">Returns</a></li>
              <li><a href="#" className="text-background/60 hover:text-primary transition-colors">Track Order</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-background/10 pt-8 text-center text-background/40 text-sm">
          <p>© 2026 Jinx. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

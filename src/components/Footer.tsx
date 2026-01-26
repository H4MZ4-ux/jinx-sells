import { Link } from "react-router-dom";
import { Instagram, Twitter, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-border/60 bg-background">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid gap-10 md:grid-cols-3">
          {/* Left */}
          <div>
            <div className="text-xl font-bold text-primary">JINX</div>
            <p className="mt-3 text-sm text-muted-foreground max-w-sm">
              Your trusted source for premium products at unbeatable prices.
            </p>

            <div className="mt-6 flex items-center gap-4">
              <a
                href="#"
                aria-label="Instagram"
                className="rounded-lg border border-border/60 p-2 hover:bg-muted transition"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href="#"
                aria-label="Twitter"
                className="rounded-lg border border-border/60 p-2 hover:bg-muted transition"
              >
                <Twitter className="h-4 w-4" />
              </a>
              <a
                href="mailto:info@example.com"
                aria-label="Email"
                className="rounded-lg border border-border/60 p-2 hover:bg-muted transition"
              >
                <Mail className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <div className="text-sm font-semibold">Quick Links</div>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li>
                <Link to="/" className="hover:text-foreground transition">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/catalog" className="hover:text-foreground transition">
                  Catalog
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-foreground transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-foreground transition">
                  Contact
                </Link>
              </li>

              {/* ✅ NEW: Admin Panel link */}
              <li className="pt-2">
                <Link
                  to="/admin"
                  className="font-medium text-primary hover:opacity-90 transition"
                >
                  Admin Panel
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <div className="text-sm font-semibold">Support</div>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li>
                <Link to="/faqs" className="hover:text-foreground transition">
                  FAQs
                </Link>
              </li>
              <li>
                <Link
                  to="/shipping"
                  className="hover:text-foreground transition"
                >
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link to="/returns" className="hover:text-foreground transition">
                  Returns
                </Link>
              </li>
              <li>
                <Link
                  to="/track-order"
                  className="hover:text-foreground transition"
                >
                  Track Order
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-border/60 pt-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Jinx. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

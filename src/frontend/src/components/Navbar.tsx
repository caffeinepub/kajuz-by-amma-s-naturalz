import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { Menu, Package, ShoppingCart, X } from "lucide-react";
import { useState } from "react";
import { useCart } from "../context/CartContext";

export function Navbar() {
  const { totalItems } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMobileOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex-shrink-0">
            <img
              src="/assets/generated/kajuz-logo-transparent.dim_400x120.png"
              alt="kajuz by Amma's Naturalz"
              className="h-10 w-auto object-contain"
            />
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link
              to="/products"
              className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
              data-ocid="nav.products_link"
            >
              Products
            </Link>
            <button
              type="button"
              onClick={() => scrollTo("about")}
              className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
            >
              About
            </button>
            <button
              type="button"
              onClick={() => scrollTo("contact")}
              className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
            >
              Contact
            </button>
          </nav>

          <div className="flex items-center gap-2">
            <Link to="/admin" data-ocid="nav.admin_link">
              <Button
                variant="ghost"
                size="sm"
                className="hidden md:flex gap-1 text-xs"
              >
                <Package className="h-3.5 w-3.5" />
                Admin
              </Button>
            </Link>
            <Link to="/cart" data-ocid="nav.cart_button">
              <Button variant="outline" size="sm" className="relative gap-1.5">
                <ShoppingCart className="h-4 w-4" />
                <span className="hidden sm:inline">Cart</span>
                {totalItems > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs bg-accent text-accent-foreground">
                    {totalItems}
                  </Badge>
                )}
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {mobileOpen && (
          <div className="md:hidden py-4 border-t border-border space-y-1">
            <Link
              to="/products"
              className="block px-2 py-2 text-sm font-medium"
              onClick={() => setMobileOpen(false)}
              data-ocid="nav.products_link"
            >
              Products
            </Link>
            <button
              type="button"
              className="block w-full text-left px-2 py-2 text-sm"
              onClick={() => scrollTo("about")}
            >
              About
            </button>
            <button
              type="button"
              className="block w-full text-left px-2 py-2 text-sm"
              onClick={() => scrollTo("contact")}
            >
              Contact
            </button>
            <Link
              to="/admin"
              className="block px-2 py-2 text-sm"
              onClick={() => setMobileOpen(false)}
              data-ocid="nav.admin_link"
            >
              Admin
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}

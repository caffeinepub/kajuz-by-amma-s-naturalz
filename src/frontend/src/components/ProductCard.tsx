import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "@tanstack/react-router";
import { MapPin, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useCart } from "../context/CartContext";
import type { Product } from "../data/products";
import { formatINR } from "../utils/formatters";

interface ProductCardProps {
  product: Product;
  index: number;
}

export function ProductCard({ product, index }: ProductCardProps) {
  const { addToCart } = useCart();
  const [adding, setAdding] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setAdding(true);
    addToCart(product, 100);
    toast.success(`${product.name} added to cart (100 kg)`);
    setTimeout(() => setAdding(false), 800);
  };

  return (
    <Card
      className="overflow-hidden hover:shadow-commodity transition-shadow duration-300 group"
      data-ocid={`product.card.${index}`}
    >
      <Link to="/products/$id" params={{ id: product.id }}>
        <div className="aspect-[4/3] overflow-hidden bg-muted">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        </div>
      </Link>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <Link to="/products/$id" params={{ id: product.id }}>
            <h3 className="font-display font-semibold text-lg leading-tight hover:text-accent transition-colors">
              {product.name}
            </h3>
          </Link>
          <Badge
            variant={product.category === "whole" ? "default" : "secondary"}
            className="text-xs flex-shrink-0"
          >
            {product.category === "whole" ? "Whole" : "Broken"}
          </Badge>
        </div>

        <div className="flex items-center gap-1 text-xs text-muted-foreground mb-3">
          <MapPin className="h-3 w-3" />
          <span>{product.origin}</span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold price-display text-foreground">
              {formatINR(product.pricePerKg)}
            </span>
            <span className="text-xs text-muted-foreground">/kg</span>
            <div className="text-xs text-muted-foreground mt-0.5">
              +GST • Min. 100 kg
            </div>
          </div>
          <Button
            size="sm"
            className="gap-1.5"
            onClick={handleAddToCart}
            disabled={adding}
            data-ocid="product.add_to_cart_button"
          >
            <ShoppingCart className="h-3.5 w-3.5" />
            {adding ? "Added" : "Add"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

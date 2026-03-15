import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate, useParams } from "@tanstack/react-router";
import {
  AlertTriangle,
  MapPin,
  MessageCircle,
  Minus,
  Plus,
  ShoppingCart,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useCart } from "../context/CartContext";
import { getProducts } from "../data/products";
import { formatINR } from "../utils/formatters";

export function ProductDetailPage() {
  const params = useParams({ from: "/products/$id" });
  const navigate = useNavigate();
  const products = getProducts();
  const product = products.find((p) => p.id === params.id);
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(100);

  if (!product) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <h1 className="font-display text-2xl font-bold mb-4">
          Product not found
        </h1>
        <Button onClick={() => navigate({ to: "/products" })}>
          Back to Products
        </Button>
      </div>
    );
  }

  const subtotal = product.pricePerKg * quantity;
  const isValidQty = quantity >= 100;

  const handleQtyChange = (val: number) => {
    if (val >= 0) setQuantity(val);
  };

  const handleAddToCart = () => {
    if (!isValidQty) return;
    addToCart(product, quantity);
    toast.success(`${product.name} (${quantity} kg) added to cart`);
    navigate({ to: "/cart" });
  };

  const whatsappText = `Hello, I want to order *${quantity} kg* of *${product.name}* (${product.origin}). Price: ${formatINR(subtotal)} + GST. Please confirm availability.`;
  const whatsappUrl = `https://wa.me/919188520881?text=${encodeURIComponent(whatsappText)}`;

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="rounded-2xl overflow-hidden shadow-commodity aspect-[4/3]">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex flex-col">
          <div className="flex flex-wrap gap-2 mb-3">
            <Badge
              variant={product.category === "whole" ? "default" : "secondary"}
            >
              {product.category === "whole" ? "Whole Kernel" : "Broken Kernel"}
            </Badge>
            <Badge variant="outline">Grade: {product.grade}</Badge>
          </div>

          <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">
            {product.name}
          </h1>

          <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-4">
            <MapPin className="h-4 w-4" />
            <span>Origin: {product.origin}</span>
          </div>

          <div className="mb-5">
            <span className="text-4xl font-bold price-display">
              {formatINR(product.pricePerKg)}
            </span>
            <span className="text-muted-foreground ml-1">/kg (excl. GST)</span>
          </div>

          <p className="text-muted-foreground mb-6 leading-relaxed">
            {product.description}
          </p>

          <div className="mb-4">
            <Label
              htmlFor="qty-input"
              className="text-sm font-semibold mb-2 block"
            >
              Quantity (kg)
            </Label>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleQtyChange(Math.max(100, quantity - 25))}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <Input
                id="qty-input"
                type="number"
                value={quantity}
                onChange={(e) => handleQtyChange(Number(e.target.value))}
                min={100}
                step={25}
                className="w-28 text-center text-lg font-semibold price-display"
                data-ocid="product_detail.quantity_input"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleQtyChange(quantity + 25)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {!isValidQty && (
            <Alert variant="destructive" className="mb-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Minimum order quantity is 100 kg.
              </AlertDescription>
            </Alert>
          )}

          {isValidQty && (
            <div className="bg-secondary/60 rounded-lg px-4 py-3 mb-5 border border-border">
              <p className="text-sm text-muted-foreground">
                <span className="price-display font-semibold text-foreground">
                  {quantity} kg
                </span>
                {" \xd7 "}
                <span className="price-display font-semibold text-foreground">
                  {formatINR(product.pricePerKg)}
                </span>
                {" = "}
                <span className="price-display font-bold text-lg text-accent">
                  {formatINR(subtotal)}
                </span>
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                + 5% GST = {formatINR(subtotal + Math.round(subtotal * 0.05))}
              </p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              size="lg"
              className="flex-1 gap-2"
              disabled={!isValidQty}
              onClick={handleAddToCart}
              data-ocid="product_detail.add_to_cart_button"
            >
              <ShoppingCart className="h-4 w-4" />
              Add to Cart
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="flex-1 gap-2 border-[#25D366] text-[#25D366] hover:bg-[#25D366]/10"
              asChild
              data-ocid="product_detail.whatsapp_button"
            >
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="h-4 w-4" />
                Order via WhatsApp
              </a>
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}

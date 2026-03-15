import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import { useCart } from "../context/CartContext";
import { formatINR } from "../utils/formatters";

export function CartPage() {
  const { items, removeFromCart, updateQuantity, subtotal, gstAmount, total } =
    useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <main className="max-w-2xl mx-auto px-4 py-20 text-center">
        <ShoppingCart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h1 className="font-display text-2xl font-bold mb-2">
          Your cart is empty
        </h1>
        <p className="text-muted-foreground mb-6">
          Add products to start your bulk order.
        </p>
        <Button asChild data-ocid="cart.continue_button">
          <Link to="/products">Browse Products</Link>
        </Button>
      </main>
    );
  }

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="font-display text-3xl font-bold mb-8">Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item, idx) => (
            <div
              key={item.product.id}
              className="bg-card rounded-xl p-4 shadow-card flex gap-4"
              data-ocid={`cart.item.${idx + 1}`}
            >
              <img
                src={item.product.image}
                alt={item.product.name}
                className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <h3 className="font-display font-semibold">
                      {item.product.name}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {item.product.origin}
                    </p>
                    <p className="text-sm font-medium mt-0.5">
                      {formatINR(item.product.pricePerKg)}/kg
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:text-destructive flex-shrink-0"
                    onClick={() => removeFromCart(item.product.id)}
                    data-ocid={`cart.remove_button.${idx + 1}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-1.5">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() =>
                        updateQuantity(
                          item.product.id,
                          Math.max(100, item.quantity - 25),
                        )
                      }
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <Input
                      type="number"
                      value={item.quantity}
                      onChange={(e) =>
                        updateQuantity(item.product.id, Number(e.target.value))
                      }
                      className="w-20 h-7 text-center text-sm price-display"
                      min={100}
                      step={25}
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() =>
                        updateQuantity(item.product.id, item.quantity + 25)
                      }
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                    <span className="text-xs text-muted-foreground">kg</span>
                  </div>
                  <span className="font-bold price-display">
                    {formatINR(item.product.pricePerKg * item.quantity)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="bg-card rounded-xl p-6 shadow-card h-fit">
          <h2 className="font-display font-semibold text-xl mb-4">
            Order Summary
          </h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="price-display font-semibold">
                {formatINR(subtotal)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">GST (5%)</span>
              <span className="price-display font-semibold">
                {formatINR(gstAmount)}
              </span>
            </div>
            <Separator />
            <div className="flex justify-between text-base font-bold">
              <span>Total Payable</span>
              <span className="price-display text-accent">
                {formatINR(total)}
              </span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            All prices exclude GST. 5% GST applicable on cashew kernels.
          </p>
          <Button
            size="lg"
            className="w-full mt-4 gap-2"
            onClick={() => navigate({ to: "/checkout" })}
            data-ocid="cart.checkout_button"
          >
            Proceed to Checkout
            <ArrowRight className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="w-full mt-2" asChild>
            <Link to="/products">← Continue Shopping</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}

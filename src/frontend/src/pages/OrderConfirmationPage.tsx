import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useNavigate, useParams } from "@tanstack/react-router";
import { CheckCircle, Mail, MessageCircle, ShoppingBag } from "lucide-react";
import { motion } from "motion/react";
import {
  formatINR,
  formatWhatsAppOrderMessage,
  getOrderById,
} from "../utils/formatters";

export function OrderConfirmationPage() {
  const params = useParams({ from: "/order-confirmation/$id" });
  const navigate = useNavigate();
  const order = getOrderById(params.id);

  if (!order) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <p className="text-muted-foreground mb-4">Order not found.</p>
        <Button onClick={() => navigate({ to: "/" })}>Go Home</Button>
      </div>
    );
  }

  const waMessage = formatWhatsAppOrderMessage(order);
  const waUrl = `https://wa.me/919188520881?text=${encodeURIComponent(waMessage)}`;

  return (
    <main className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="h-10 w-10 text-accent" />
        </div>
        <h1 className="font-display text-3xl font-bold mb-2">
          Order Placed Successfully!
        </h1>
        <p className="text-muted-foreground">
          Thank you for your order. We'll confirm shortly.
        </p>
        <div className="inline-block bg-secondary/60 rounded-lg px-4 py-2 mt-3 font-mono text-sm font-semibold">
          {order.id}
        </div>
      </motion.div>

      <div className="bg-card rounded-xl p-6 shadow-card space-y-4 mb-6">
        <h2 className="font-display font-semibold text-xl">Order Details</h2>
        {order.items.map((item) => (
          <div key={item.productId} className="flex justify-between text-sm">
            <span>
              {item.productName} ({item.origin}) — {item.quantity} kg
            </span>
            <span className="price-display font-medium">
              {formatINR(item.subtotal)}
            </span>
          </div>
        ))}
        <Separator />
        <div className="space-y-1 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="price-display">{formatINR(order.subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">GST (5%)</span>
            <span className="price-display">{formatINR(order.gstAmount)}</span>
          </div>
          <div className="flex justify-between font-bold">
            <span>Total Paid</span>
            <span className="price-display text-accent">
              {formatINR(order.total)}
            </span>
          </div>
        </div>
        <Separator />
        <div className="text-sm space-y-1">
          <p>
            <strong>Customer:</strong> {order.customerName}
          </p>
          <p>
            <strong>Business:</strong> {order.businessName}
          </p>
          <p>
            <strong>Phone:</strong> {order.customerPhone}
          </p>
          <p>
            <strong>Delivery:</strong> {order.deliveryAddress}
          </p>
          {order.upiTxnId && (
            <p>
              <strong>UPI Txn ID:</strong> {order.upiTxnId}
            </p>
          )}
        </div>
      </div>

      <div className="bg-accent/10 rounded-xl p-4 flex items-start gap-3 mb-6">
        <Mail className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
        <p className="text-sm">
          Order details will be shared at{" "}
          <strong>ammasnaturalz@gmail.com</strong>. Please send your order
          confirmation via WhatsApp below.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          size="lg"
          className="flex-1 gap-2 bg-[#25D366] hover:bg-[#128C7E] text-white"
          asChild
          data-ocid="order_confirmation.whatsapp_notify_button"
        >
          <a href={waUrl} target="_blank" rel="noopener noreferrer">
            <MessageCircle className="h-4 w-4" />
            Notify via WhatsApp
          </a>
        </Button>
        <Button
          size="lg"
          variant="outline"
          className="flex-1 gap-2"
          onClick={() => navigate({ to: "/" })}
          data-ocid="order_confirmation.continue_button"
        >
          <ShoppingBag className="h-4 w-4" />
          Continue Shopping
        </Button>
      </div>
    </main>
  );
}

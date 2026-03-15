import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "@tanstack/react-router";
import { CheckCircle, Monitor, Smartphone } from "lucide-react";
import { useState } from "react";
import { useCart } from "../context/CartContext";
import {
  type OrderData,
  formatINR,
  generateOrderId,
  saveOrder,
} from "../utils/formatters";

const UPI_ID = "ammasnaturalz@okhdfcbank";
const STEPS = ["Customer Details", "Delivery Address", "Payment"];

export function CheckoutPage() {
  const { items, subtotal, gstAmount, total, clearCart } = useCart();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [showTxnInput, setShowTxnInput] = useState(false);
  const [txnId, setTxnId] = useState("");

  const [form, setForm] = useState({
    customerName: "",
    customerPhone: "",
    businessName: "",
    city: "",
    deliveryAddress: "",
    pincode: "",
    state: "",
  });

  const isMobile =
    /Android|iPhone|iPad|iPod|webOS/i.test(navigator.userAgent) ||
    window.innerWidth < 768;

  const upiAmount = total;
  const upiDeepLink = `upi://pay?pa=${UPI_ID}&pn=kajuz%20by%20Amma%27s%20Naturalz&am=${upiAmount}&cu=INR&tn=Cashew%20Order`;
  const upiString = `upi://pay?pa=${UPI_ID}&pn=kajuz&am=${upiAmount}&cu=INR`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(upiString)}`;

  const updateForm = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const step1Valid =
    form.customerName.trim() &&
    form.customerPhone.trim() &&
    form.businessName.trim() &&
    form.city.trim();
  const step2Valid =
    form.deliveryAddress.trim() && form.pincode.trim() && form.state.trim();

  const handleConfirmOrder = () => {
    const orderId = generateOrderId();
    const order: OrderData = {
      id: orderId,
      customerName: form.customerName,
      customerPhone: form.customerPhone,
      businessName: form.businessName,
      city: form.city,
      deliveryAddress: `${form.deliveryAddress}, ${form.city}, ${form.state} - ${form.pincode}`,
      pincode: form.pincode,
      state: form.state,
      items: items.map((i) => ({
        productId: i.product.id,
        productName: i.product.name,
        origin: i.product.origin,
        pricePerKg: i.product.pricePerKg,
        quantity: i.quantity,
        subtotal: i.product.pricePerKg * i.quantity,
      })),
      subtotal,
      gstAmount,
      total,
      paymentStatus: "Payment Submitted",
      upiTxnId: txnId,
      status: "Pending Confirmation",
      createdAt: new Date().toISOString(),
    };
    saveOrder(order);
    clearCart();
    navigate({ to: `/order-confirmation/${orderId}` });
  };

  if (items.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <p className="text-muted-foreground mb-4">Your cart is empty.</p>
        <Button onClick={() => navigate({ to: "/products" })}>
          Shop Products
        </Button>
      </div>
    );
  }

  return (
    <main className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-8">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                i < step
                  ? "bg-accent text-accent-foreground"
                  : i === step
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
              }`}
            >
              {i < step ? <CheckCircle className="h-4 w-4" /> : i + 1}
            </div>
            <span
              className={`text-sm font-medium hidden sm:inline ${i === step ? "" : "text-muted-foreground"}`}
            >
              {s}
            </span>
            {i < STEPS.length - 1 && <div className="w-8 h-px bg-border" />}
          </div>
        ))}
      </div>

      {/* Step 1 */}
      {step === 0 && (
        <div className="bg-card rounded-xl p-6 shadow-card">
          <h2 className="font-display text-xl font-semibold mb-5">
            Customer Details
          </h2>
          <div className="space-y-4">
            <div>
              <Label>Full Name *</Label>
              <Input
                value={form.customerName}
                onChange={(e) => updateForm("customerName", e.target.value)}
                placeholder="Your full name"
                className="mt-1"
                data-ocid="checkout.name_input"
              />
            </div>
            <div>
              <Label>Phone Number *</Label>
              <Input
                value={form.customerPhone}
                onChange={(e) => updateForm("customerPhone", e.target.value)}
                placeholder="+91 XXXXX XXXXX"
                type="tel"
                className="mt-1"
                data-ocid="checkout.phone_input"
              />
            </div>
            <div>
              <Label>Business Name *</Label>
              <Input
                value={form.businessName}
                onChange={(e) => updateForm("businessName", e.target.value)}
                placeholder="Your business or company name"
                className="mt-1"
                data-ocid="checkout.business_input"
              />
            </div>
            <div>
              <Label>City *</Label>
              <Input
                value={form.city}
                onChange={(e) => updateForm("city", e.target.value)}
                placeholder="City"
                className="mt-1"
                data-ocid="checkout.city_input"
              />
            </div>
          </div>
          <Button
            className="w-full mt-6"
            disabled={!step1Valid}
            onClick={() => setStep(1)}
            data-ocid="checkout.step1_submit_button"
          >
            Continue to Delivery Address
          </Button>
        </div>
      )}

      {/* Step 2 */}
      {step === 1 && (
        <div className="bg-card rounded-xl p-6 shadow-card">
          <h2 className="font-display text-xl font-semibold mb-5">
            Delivery Address
          </h2>
          <div className="space-y-4">
            <div>
              <Label>Full Address *</Label>
              <Textarea
                value={form.deliveryAddress}
                onChange={(e) => updateForm("deliveryAddress", e.target.value)}
                placeholder="Street address, building, area..."
                className="mt-1"
                rows={3}
                data-ocid="checkout.address_textarea"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Pincode *</Label>
                <Input
                  value={form.pincode}
                  onChange={(e) => updateForm("pincode", e.target.value)}
                  placeholder="Pincode"
                  className="mt-1"
                />
              </div>
              <div>
                <Label>State *</Label>
                <Input
                  value={form.state}
                  onChange={(e) => updateForm("state", e.target.value)}
                  placeholder="State"
                  className="mt-1"
                />
              </div>
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <Button
              variant="outline"
              onClick={() => setStep(0)}
              className="flex-1"
            >
              Back
            </Button>
            <Button
              className="flex-1"
              disabled={!step2Valid}
              onClick={() => setStep(2)}
              data-ocid="checkout.step2_submit_button"
            >
              Continue to Payment
            </Button>
          </div>
        </div>
      )}

      {/* Step 3 */}
      {step === 2 && (
        <div className="space-y-4">
          {/* Order Summary */}
          <div className="bg-card rounded-xl p-5 shadow-card">
            <h2 className="font-display text-lg font-semibold mb-4">
              Order Summary
            </h2>
            <div className="space-y-2">
              {items.map((item) => (
                <div
                  key={item.product.id}
                  className="flex justify-between text-sm"
                >
                  <span>
                    {item.product.name} — {item.quantity} kg
                  </span>
                  <span className="price-display font-medium">
                    {formatINR(item.product.pricePerKg * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
            <Separator className="my-3" />
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="price-display">{formatINR(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">GST (5%)</span>
                <span className="price-display">{formatINR(gstAmount)}</span>
              </div>
              <div className="flex justify-between font-bold text-base">
                <span>Total Payable</span>
                <span className="price-display text-accent">
                  {formatINR(total)}
                </span>
              </div>
            </div>
          </div>

          {/* Payment */}
          <div className="bg-card rounded-xl p-5 shadow-card">
            <h2 className="font-display text-lg font-semibold mb-4">
              Pay via UPI
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
              UPI ID:{" "}
              <strong className="text-foreground font-mono">{UPI_ID}</strong>
            </p>

            {/* UPI App Icons */}
            <div className="flex gap-3 flex-wrap mb-5">
              {["Google Pay", "PhonePe", "Paytm", "BHIM"].map((app) => (
                <Badge
                  key={app}
                  variant="secondary"
                  className="text-xs py-1 px-2"
                >
                  {app}
                </Badge>
              ))}
            </div>

            {isMobile ? (
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-3">
                  Tap to open your UPI app
                </p>
                <Button
                  size="lg"
                  className="w-full gap-2"
                  asChild
                  data-ocid="checkout.upi_deeplink_button"
                >
                  <a href={upiDeepLink}>
                    <Smartphone className="h-4 w-4" />
                    Pay {formatINR(total)} via UPI App
                  </a>
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <p className="text-sm text-muted-foreground mb-3 flex items-center gap-1">
                  <Monitor className="h-4 w-4" />
                  Scan QR code with any UPI app
                </p>
                <div className="bg-white p-3 rounded-xl shadow-card inline-block">
                  <img
                    src={qrUrl}
                    alt="UPI QR Code"
                    className="w-[220px] h-[220px]"
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Amount: {formatINR(total)}
                </p>
              </div>
            )}

            {/* Confirm payment */}
            <div className="mt-6 pt-5 border-t border-border">
              {!showTxnInput ? (
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setShowTxnInput(true)}
                  data-ocid="checkout.payment_confirm_button"
                >
                  I have completed the payment
                </Button>
              ) : (
                <div className="space-y-3">
                  <Label>UPI Transaction ID (optional)</Label>
                  <Input
                    value={txnId}
                    onChange={(e) => setTxnId(e.target.value)}
                    placeholder="Enter UPI transaction reference ID"
                    data-ocid="checkout.txn_input"
                  />
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => setShowTxnInput(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      className="flex-1"
                      onClick={handleConfirmOrder}
                      data-ocid="checkout.confirm_order_button"
                    >
                      Confirm Order
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <Button variant="ghost" size="sm" onClick={() => setStep(1)}>
            ← Back to Address
          </Button>
        </div>
      )}
    </main>
  );
}

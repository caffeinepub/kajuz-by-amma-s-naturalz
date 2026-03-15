export function formatINR(amount: number): string {
  return `\u20B9${amount.toLocaleString("en-IN")}`;
}

export function generateOrderId(): string {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `KJZ-${ts}-${rand}`;
}

export interface OrderItem {
  productId: string;
  productName: string;
  origin: string;
  pricePerKg: number;
  quantity: number;
  subtotal: number;
}

export interface OrderData {
  id: string;
  customerName: string;
  customerPhone: string;
  businessName: string;
  city: string;
  deliveryAddress: string;
  pincode: string;
  state: string;
  items: OrderItem[];
  subtotal: number;
  gstAmount: number;
  total: number;
  paymentStatus: string;
  upiTxnId: string;
  status: string;
  createdAt: string;
}

export function formatWhatsAppOrderMessage(order: OrderData): string {
  const itemLines = order.items
    .map(
      (i) =>
        `  \u2022 ${i.productName} (${i.origin}) \u2014 ${i.quantity}kg \xd7 ${formatINR(i.pricePerKg)} = ${formatINR(i.subtotal)}`,
    )
    .join("\n");

  return [
    `*New Bulk Order \u2014 kajuz by Amma's Naturalz*`,
    "",
    `Order ID: ${order.id}`,
    `Date: ${new Date(order.createdAt).toLocaleString("en-IN")}`,
    "",
    "*Customer:*",
    `Name: ${order.customerName}`,
    `Business: ${order.businessName}`,
    `Phone: ${order.customerPhone}`,
    `City: ${order.city}`,
    "",
    "*Delivery Address:*",
    order.deliveryAddress,
    "",
    "*Order Items:*",
    itemLines,
    "",
    `Subtotal: ${formatINR(order.subtotal)}`,
    `GST (5%): ${formatINR(order.gstAmount)}`,
    `*Total Payable: ${formatINR(order.total)}*`,
    "",
    `Payment Status: ${order.paymentStatus}`,
    `UPI Txn ID: ${order.upiTxnId || "Pending"}`,
  ].join("\n");
}

export function saveOrder(order: OrderData) {
  const stored = localStorage.getItem("kajuz_orders");
  const orders: OrderData[] = stored ? JSON.parse(stored) : [];
  orders.unshift(order);
  localStorage.setItem("kajuz_orders", JSON.stringify(orders));
}

export function getOrders(): OrderData[] {
  const stored = localStorage.getItem("kajuz_orders");
  return stored ? JSON.parse(stored) : [];
}

export function getOrderById(id: string): OrderData | null {
  return getOrders().find((o) => o.id === id) || null;
}

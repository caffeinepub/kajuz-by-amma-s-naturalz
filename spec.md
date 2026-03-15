# kajuz by Amma's Naturalz — B2B Cashew Kernel Bulk Order Platform

## Current State
New project. No existing code.

## Requested Changes (Diff)

### Add
- Full B2B bulk cashew kernel ordering platform
- Homepage with hero, product cards, grade chart, trust section
- Product listing page with category filters (Whole / Broken)
- Individual product detail pages with live price calculator
- Cart system with GST calculation (18% GST shown at checkout)
- Multi-step checkout: customer details → delivery address → payment
- UPI payment flow: QR code display on desktop, deep-link on mobile (upi://pay?pa=ammasnaturalz@okhdfcbank)
- WhatsApp floating button + auto message to +919188520881
- Order confirmation screen with order details
- Admin dashboard: manage products (price, image, origin, stock status), view orders, customer info
- Cashew grade comparison chart (W180/W240/W320 kernel size visual)
- MOQ enforcement: minimum 100 kg, quantity in kg increments
- Backend: products, orders, customers, admin auth stored in Motoko canister
- Authorization system for admin role
- Blob storage for product images

### Modify
- N/A (new project)

### Remove
- N/A (new project)

## Implementation Plan

### Backend (Motoko)
- Product entity: id, name, grade, category (whole/broken), origin (India/Tanzania/Both), pricePerKg, imageUrl, description, inStock, stockKg
- Order entity: id, customerId, items[], customerDetails, deliveryAddress, subtotal, gstAmount, totalAmount, paymentStatus, upiTxnId, createdAt, status
- Customer entity: id, name, phone, businessName, city
- Admin functions: updateProduct, addProduct, getOrders, updateOrderStatus
- Public functions: getProducts, getProductById, createOrder, updatePaymentStatus
- Authorization: admin role with hardcoded admin principal or authorization component

### Frontend Pages
1. `/` — Homepage: hero, product grid, grade chart, trust badges, WhatsApp CTA
2. `/products` — Product listing with whole/broken filter tabs
3. `/products/:id` — Product detail with live calculator, add to cart
4. `/cart` — Cart summary with GST breakdown
5. `/checkout` — 3-step form: details → address → payment (UPI QR or deeplink)
6. `/order-confirmation/:id` — Order success with WhatsApp notification link
7. `/admin` — Admin login + dashboard (products, orders, customers)
8. `/admin/products` — Product management with add/edit/price update
9. `/admin/orders` — Orders list with status management

### Key Logic
- MOQ: disable add-to-cart if quantity < 100 kg
- GST: 5% on food commodity (cashew kernels are agricultural produce taxed at 5% GST)
- UPI: on mobile generate upi:// deep link; on desktop generate QR code image from UPI string
- WhatsApp: on order submit generate pre-filled wa.me link with order details
- Cart: persist in localStorage (React state)

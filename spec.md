# kajuz by Amma's Naturalz — Version 4

## Current State
- Full B2B cashew kernel ecommerce platform with storefront, cart, checkout, UPI payment, WhatsApp ordering
- Admin dashboard via Internet Identity authentication
- Products: W180, W240, W320, JH (Tanzania/India), LWP (Tanzania/India), SWP
- Navigation: Products, About, Contact, Admin, Cart
- Homepage has hero, why-kajuz section, product listings, grade chart
- Backend uses MixinAuthorization with `isCallerAdmin()` that traps for unregistered users causing Access Denied
- Images stored via blob-storage, referenced in product data

## Requested Changes (Diff)

### Add
- `claimFirstAdmin()` backend function: if no admin exists, make caller admin (no token required)
- `isCallerAdminSafe()` backend function: returns false instead of trapping for unregistered users
- New page: `/grades` — Cashew Grades Guide (whole kernels table, broken kernels table, size infographic)
- New page: `/industries` — Industries We Supply (5 industry cards with grades + uses)
- Homepage section: "How to Choose the Right Cashew Grade" (3 cards: Premium Retail→W180, Standard Trading→W320, Food Processing→LWP/SWP)
- Product detail page: "Best for these industries" section per grade
- Kernel size infographic (horizontal comparison bars: W180 > W240 > W320 > LWP > SWP)

### Modify
- Navigation: Home, Cashew Grades (/grades), Industries We Supply (/industries), Products, Bulk Order (/products), About, Contact
- AdminPage: use `claimFirstAdmin()` flow — if user logs in and is not admin, offer to claim first admin if no admin exists; also handle unregistered user gracefully
- Admin dashboard: fix images showing — ensure products with images from blob-storage display correctly; edit button should open edit sheet properly
- ProductDetailPage: add "Best for Industries" section below description

### Remove
- Nothing removed

## Implementation Plan
1. Generate new Motoko backend adding `claimFirstAdmin()` and making `isCallerAdmin()` safe (return false not trap)
2. Generate supporting cashew infographic images
3. Update App.tsx with new routes (/grades, /industries)
4. Update Navbar.tsx with new navigation links
5. Create CashewGradesPage.tsx with tables, infographic, real images
6. Create IndustriesPage.tsx with industry cards
7. Update HomePage.tsx adding "How to Choose" section
8. Update ProductDetailPage.tsx adding "Best for Industries" section
9. Update AdminPage.tsx to use claimFirstAdmin flow
10. Validate and deploy

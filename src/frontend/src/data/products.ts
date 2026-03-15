export interface Product {
  id: string;
  name: string;
  grade: string;
  category: "whole" | "broken";
  origin: string;
  pricePerKg: number;
  image: string;
  description: string;
}

export const BASE_PRODUCTS: Product[] = [
  {
    id: "w320",
    name: "W320",
    grade: "W320",
    category: "whole",
    origin: "India & Tanzania",
    pricePerKg: 760,
    image: "/assets/generated/cashew-w320-whole.dim_800x600.jpg",
    description:
      "Standard export grade whole cashew kernels. 320 kernels per pound. Most popular grade for bulk trade.",
  },
  {
    id: "w240",
    name: "W240",
    grade: "W240",
    category: "whole",
    origin: "India & Tanzania",
    pricePerKg: 820,
    image: "/assets/generated/cashew-w240-whole.dim_800x600.jpg",
    description:
      "Medium-large whole cashew kernels. 240 kernels per pound. Premium grade for retail packaging.",
  },
  {
    id: "w180",
    name: "W180",
    grade: "W180",
    category: "whole",
    origin: "India & Tanzania",
    pricePerKg: 1020,
    image: "/assets/generated/cashew-w180-whole.dim_800x600.jpg",
    description:
      "Premium large whole cashew kernels. 180 kernels per pound. Top-tier grade for gourmet markets.",
  },
  {
    id: "jh-tz",
    name: "JH Tanzania",
    grade: "JH",
    category: "broken",
    origin: "Tanzania",
    pricePerKg: 800,
    image: "/assets/generated/cashew-broken-jh.dim_800x600.jpg",
    description:
      "Jumbo halves from Tanzania. Ideal for bakeries, confectionery, and premium snack mixes.",
  },
  {
    id: "jh-in",
    name: "JH Indian",
    grade: "JH",
    category: "broken",
    origin: "India",
    pricePerKg: 770,
    image: "/assets/generated/cashew-broken-jh.dim_800x600.jpg",
    description:
      "Jumbo halves from India. Ideal for bakeries, confectionery, and premium snack mixes.",
  },
  {
    id: "lwp-tz",
    name: "LWP Tanzania",
    grade: "LWP",
    category: "broken",
    origin: "Tanzania",
    pricePerKg: 750,
    image: "/assets/generated/cashew-broken-lwp.dim_800x600.jpg",
    description:
      "Large white pieces from Tanzania. Perfect for food processing and industrial use.",
  },
  {
    id: "lwp-in",
    name: "LWP Indian",
    grade: "LWP",
    category: "broken",
    origin: "India",
    pricePerKg: 720,
    image: "/assets/generated/cashew-broken-lwp.dim_800x600.jpg",
    description:
      "Large white pieces from India. Perfect for food processing and industrial use.",
  },
  {
    id: "swp",
    name: "SWP",
    grade: "SWP",
    category: "broken",
    origin: "India & Tanzania",
    pricePerKg: 620,
    image: "/assets/generated/cashew-broken-swp.dim_800x600.jpg",
    description:
      "Small white pieces. Economical grade for baking, ice cream, and confectionery processing.",
  },
];

export function getProducts(): Product[] {
  const customProducts = localStorage.getItem("kajuz_custom_products");
  const custom: Product[] = customProducts ? JSON.parse(customProducts) : [];
  const priceOverrides = getPriceOverrides();

  const allProducts = [
    ...BASE_PRODUCTS.map((p) => ({
      ...p,
      pricePerKg: priceOverrides[p.id] ?? p.pricePerKg,
    })),
    ...custom,
  ];
  return allProducts;
}

export function getPriceOverrides(): Record<string, number> {
  const stored = localStorage.getItem("kajuz_product_prices");
  return stored ? JSON.parse(stored) : {};
}

export function setPriceOverride(productId: string, price: number) {
  const overrides = getPriceOverrides();
  overrides[productId] = price;
  localStorage.setItem("kajuz_product_prices", JSON.stringify(overrides));
}

export function addCustomProduct(product: Product) {
  const stored = localStorage.getItem("kajuz_custom_products");
  const existing: Product[] = stored ? JSON.parse(stored) : [];
  existing.push(product);
  localStorage.setItem("kajuz_custom_products", JSON.stringify(existing));
}

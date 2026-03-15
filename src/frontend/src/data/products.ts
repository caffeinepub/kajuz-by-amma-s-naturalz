export interface Product {
  id: string;
  name: string;
  grade: string;
  category: "whole" | "broken";
  origin: string;
  pricePerKg: number;
  images: string[];
  image: string; // backward compat: images[0]
  description: string;
  hidden?: boolean;
}

export const BASE_PRODUCTS: Omit<Product, "image">[] = [
  {
    id: "w320",
    name: "W320",
    grade: "W320",
    category: "whole",
    origin: "India & Tanzania",
    pricePerKg: 760,
    images: ["/assets/generated/cashew-w320-whole.dim_800x600.jpg"],
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
    images: ["/assets/generated/cashew-w240-whole.dim_800x600.jpg"],
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
    images: ["/assets/generated/cashew-w180-whole.dim_800x600.jpg"],
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
    images: ["/assets/generated/cashew-broken-jh.dim_800x600.jpg"],
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
    images: ["/assets/generated/cashew-broken-jh.dim_800x600.jpg"],
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
    images: ["/assets/generated/cashew-broken-lwp.dim_800x600.jpg"],
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
    images: ["/assets/generated/cashew-broken-lwp.dim_800x600.jpg"],
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
    images: ["/assets/generated/cashew-broken-swp.dim_800x600.jpg"],
    description:
      "Small white pieces. Economical grade for baking, ice cream, and confectionery processing.",
  },
];

function normalizeProduct(
  p: Omit<Product, "image"> & { image?: string },
): Product {
  const images = p.images?.length
    ? p.images
    : p.image
      ? [p.image]
      : ["/assets/generated/cashew-w320-whole.dim_800x600.jpg"];
  return { ...p, images, image: images[0] };
}

export function getProducts(): Product[] {
  const customProducts = localStorage.getItem("kajuz_custom_products");
  const custom: Product[] = customProducts
    ? (
        JSON.parse(customProducts) as (Omit<Product, "image"> & {
          image?: string;
        })[]
      ).map(normalizeProduct)
    : [];
  const priceOverrides = getPriceOverrides();
  const productOverrides = getProductOverrides();

  const baseProducts = BASE_PRODUCTS.map((p) => {
    const overrides = productOverrides[p.id] ?? {};
    return normalizeProduct({
      ...p,
      pricePerKg: priceOverrides[p.id] ?? p.pricePerKg,
      ...overrides,
    });
  });

  return [...baseProducts, ...custom];
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

interface ProductOverride {
  images?: string[];
  hidden?: boolean;
  name?: string;
  grade?: string;
  category?: "whole" | "broken";
  origin?: string;
  description?: string;
}

export function getProductOverrides(): Record<string, ProductOverride> {
  const stored = localStorage.getItem("kajuz_product_overrides");
  return stored ? JSON.parse(stored) : {};
}

export function updateProduct(id: string, updates: Partial<Product>) {
  // Check if base product
  const isBase = BASE_PRODUCTS.some((p) => p.id === id);
  if (isBase) {
    // For price, use price overrides key
    if (updates.pricePerKg !== undefined) {
      setPriceOverride(id, updates.pricePerKg);
    }
    // For other fields, use product overrides
    const overrides = getProductOverrides();
    const existing = overrides[id] ?? {};
    const newOverride: ProductOverride = { ...existing };
    if (updates.images !== undefined) newOverride.images = updates.images;
    if (updates.hidden !== undefined) newOverride.hidden = updates.hidden;
    if (updates.name !== undefined) newOverride.name = updates.name;
    if (updates.grade !== undefined) newOverride.grade = updates.grade;
    if (updates.category !== undefined) newOverride.category = updates.category;
    if (updates.origin !== undefined) newOverride.origin = updates.origin;
    if (updates.description !== undefined)
      newOverride.description = updates.description;
    overrides[id] = newOverride;
    localStorage.setItem("kajuz_product_overrides", JSON.stringify(overrides));
  } else {
    // Custom product
    const stored = localStorage.getItem("kajuz_custom_products");
    const existing: Product[] = stored ? JSON.parse(stored) : [];
    const idx = existing.findIndex((p) => p.id === id);
    if (idx !== -1) {
      const updated = normalizeProduct({ ...existing[idx], ...updates });
      existing[idx] = updated;
      localStorage.setItem("kajuz_custom_products", JSON.stringify(existing));
    }
  }
}

export function toggleProductHidden(id: string) {
  const products = getProducts();
  const product = products.find((p) => p.id === id);
  if (product) {
    updateProduct(id, { hidden: !product.hidden });
  }
}

export function deleteCustomProduct(id: string) {
  const stored = localStorage.getItem("kajuz_custom_products");
  const existing: Product[] = stored ? JSON.parse(stored) : [];
  const filtered = existing.filter((p) => p.id !== id);
  localStorage.setItem("kajuz_custom_products", JSON.stringify(filtered));
}

export function addCustomProduct(
  product: Omit<Product, "image"> & { image?: string },
) {
  const stored = localStorage.getItem("kajuz_custom_products");
  const existing: Product[] = stored ? JSON.parse(stored) : [];
  existing.push(normalizeProduct(product));
  localStorage.setItem("kajuz_custom_products", JSON.stringify(existing));
}

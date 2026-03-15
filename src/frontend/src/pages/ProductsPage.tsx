import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProductCard } from "../components/ProductCard";
import { getProducts } from "../data/products";

export function ProductsPage() {
  const products = getProducts().filter((p) => !p.hidden);
  const wholeProducts = products.filter((p) => p.category === "whole");
  const brokenProducts = products.filter((p) => p.category === "broken");

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <span className="text-xs font-semibold tracking-widest uppercase text-accent">
          Catalogue
        </span>
        <h1 className="font-display text-3xl md:text-4xl font-bold mt-1 mb-2">
          All Products
        </h1>
        <p className="text-muted-foreground">
          All prices exclude GST. Minimum order quantity: 100 kg per product.
        </p>
      </div>

      <Tabs defaultValue="all">
        <TabsList className="mb-8">
          <TabsTrigger value="all" data-ocid="products.tab">
            All ({products.length})
          </TabsTrigger>
          <TabsTrigger value="whole" data-ocid="products.tab">
            Whole Kernels ({wholeProducts.length})
          </TabsTrigger>
          <TabsTrigger value="broken" data-ocid="products.tab">
            Broken Kernels ({brokenProducts.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i + 1} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="whole">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {wholeProducts.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i + 1} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="broken">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {brokenProducts.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i + 1} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </main>
  );
}

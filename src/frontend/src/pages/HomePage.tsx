import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";
import {
  Globe,
  MessageCircle,
  Package,
  ShieldCheck,
  TrendingUp,
  Truck,
} from "lucide-react";
import { motion } from "motion/react";
import { GradeChart } from "../components/GradeChart";
import { ProductCard } from "../components/ProductCard";
import { getProducts } from "../data/products";

const WHY_KAJUZ = [
  {
    icon: ShieldCheck,
    title: "Export Grade Quality",
    desc: "Every batch meets international AFNOR and EU export standards. Traceable from source to delivery.",
  },
  {
    icon: Globe,
    title: "Tanzanian & Indian Origins",
    desc: "Directly sourced from Tanzanian and Indian cashew processing units for the best quality and pricing.",
  },
  {
    icon: Truck,
    title: "Bulk Delivery",
    desc: "Reliable pan-India delivery in 25 kg cartons or custom sacking. Cold-chain available on request.",
  },
  {
    icon: TrendingUp,
    title: "Competitive Pricing",
    desc: "Live market-linked pricing. Volume discounts available for orders above 500 kg.",
  },
];

export function HomePage() {
  const navigate = useNavigate();
  const products = getProducts();

  const scrollToProducts = () => {
    document
      .getElementById("products-section")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <main>
      {/* Hero */}
      <section className="relative min-h-[70vh] flex items-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('/assets/generated/cashew-hero.dim_1200x700.jpg')",
          }}
        />
        <div className="hero-overlay absolute inset-0" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="max-w-xl"
          >
            <Badge className="mb-4 bg-accent/90 text-accent-foreground text-xs tracking-wider">
              B2B WHOLESALE PLATFORM
            </Badge>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4">
              Premium Cashew Kernels –{" "}
              <em
                className="italic not-italic"
                style={{ color: "oklch(85% 0.07 80)" }}
              >
                Bulk Supply
              </em>
            </h1>
            <p className="text-white/80 text-lg mb-8 leading-relaxed">
              Tanzanian and Indian cashew kernels available for wholesalers and
              distributors. MOQ 100 kg. Live pricing.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                size="lg"
                onClick={scrollToProducts}
                className="bg-white text-foreground hover:bg-white/90 font-semibold"
                data-ocid="hero.view_products_button"
              >
                View Products
              </Button>
              <Button
                size="lg"
                onClick={() => navigate({ to: "/products" })}
                className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold"
                data-ocid="hero.bulk_order_button"
              >
                <Package className="h-4 w-4 mr-2" />
                Bulk Order
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white/60 text-white hover:bg-white/10 font-semibold"
                asChild
                data-ocid="hero.whatsapp_button"
              >
                <a
                  href="https://wa.me/919188520881?text=Hello%2C%20I%20want%20to%20place%20a%20bulk%20order%20for%20cashew%20kernels."
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  WhatsApp Inquiry
                </a>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* B2B Badge */}
      <div className="bg-foreground text-primary-foreground text-center py-3 px-4">
        <p className="text-sm font-medium tracking-wide">
          🏭 Exclusively for Wholesalers, Retailers, Bakeries &amp; Distributors
          — MOQ: 100 kg
        </p>
      </div>

      {/* Products Section */}
      <section id="products-section" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <span className="text-xs font-semibold tracking-widest uppercase text-accent">
              Our Range
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-bold mt-2 mb-3">
              Cashew Kernel Products
            </h2>
            <p className="text-muted-foreground">
              All prices exclusive of GST. 5% GST applicable at checkout.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i + 1} />
            ))}
          </div>
        </div>
      </section>

      {/* Grade Chart */}
      <GradeChart />

      {/* Why kajuz */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <span className="text-xs font-semibold tracking-widest uppercase text-accent">
              Trust
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-bold mt-2">
              Why kajuz?
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {WHY_KAJUZ.map(({ icon: Icon, title, desc }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="bg-card rounded-xl p-6 shadow-card"
              >
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                  <Icon className="h-5 w-5 text-accent" />
                </div>
                <h3 className="font-display font-semibold text-lg mb-2">
                  {title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

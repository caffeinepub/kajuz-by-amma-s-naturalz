import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { ChefHat, Factory, Package, Star, Utensils } from "lucide-react";
import { motion } from "motion/react";

const INDUSTRIES = [
  {
    icon: Package,
    name: "Dry Fruit Traders",
    grades: ["W180", "W240", "W320"],
    uses: ["Retail packs", "Roasted cashews", "Flavored nuts"],
    desc: "Sourced for premium dry fruit retail packs and branded gift hampers.",
  },
  {
    icon: ChefHat,
    name: "Bakery Manufacturers",
    grades: ["SWP", "LWP"],
    uses: ["Cookies", "Cakes", "Pastries", "Energy bars"],
    desc: "Broken grades are cost-effective for high-volume bakery production.",
  },
  {
    icon: Star,
    name: "Sweet Manufacturers",
    grades: ["W320", "JH", "LWP"],
    uses: ["Kaju katli", "Kaju sweets", "Dry fruit sweets"],
    desc: "India's top sweet manufacturers rely on W320 and broken grades.",
  },
  {
    icon: Utensils,
    name: "Restaurants & Food Service",
    grades: ["W240", "W320", "JH"],
    uses: ["Gravies", "Cashew paste", "Garnishing"],
    desc: "Hotels and restaurants use whole and half grades for culinary applications.",
  },
  {
    icon: Factory,
    name: "Food Processing Companies",
    grades: ["LWP", "SWP", "JH"],
    uses: ["Sauces", "Nut pastes", "Processed foods"],
    desc: "Industrial processors use broken grades for high-volume paste and sauce production.",
  },
];

export function IndustriesPage() {
  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <span className="text-xs font-semibold tracking-widest uppercase text-accent">
          Sector Coverage
        </span>
        <h1 className="font-display text-4xl md:text-5xl font-bold mt-2 mb-4">
          Industries We Supply
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          kajuz supplies cashew kernels to buyers across India and export
          markets. Here's who we work with and which grades they typically buy.
        </p>
      </motion.div>

      {/* Industry Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {INDUSTRIES.map((industry, i) => {
          const Icon = industry.icon;
          return (
            <motion.div
              key={industry.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="bg-card rounded-2xl p-6 shadow-card border border-border hover:shadow-commodity transition-shadow duration-200"
              data-ocid={`industries.item.${i + 1}`}
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <Icon className="h-6 w-6 text-accent" />
                </div>
                <div className="flex-1">
                  <h2 className="font-display text-xl font-bold mb-1">
                    {industry.name}
                  </h2>
                  <p className="text-sm text-muted-foreground mb-3">
                    {industry.desc}
                  </p>

                  <div className="mb-3">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                      Typical Grades
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {industry.grades.map((g) => (
                        <Badge
                          key={g}
                          className="text-xs font-mono font-bold px-2.5 py-0.5"
                        >
                          {g}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                      Common Uses
                    </p>
                    <ul className="space-y-1">
                      {industry.uses.map((use) => (
                        <li
                          key={use}
                          className="text-sm text-foreground/80 flex items-center gap-2"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" />
                          {use}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* CTA */}
      <div className="text-center py-8 bg-secondary/40 rounded-2xl border border-border">
        <h3 className="font-display text-2xl font-bold mb-2">
          Find the Right Grade for Your Business
        </h3>
        <p className="text-muted-foreground mb-5">
          Browse our full product range with live pricing.
        </p>
        <Button size="lg" asChild data-ocid="industries.browse_products_button">
          <Link to="/products">Browse Products</Link>
        </Button>
      </div>
    </main>
  );
}

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";

const WHOLE_GRADES = [
  {
    grade: "W180",
    kernels: "170–180",
    description: "Premium large cashews",
    buyers: "Retail & luxury packs",
    image: "/assets/generated/cashew-w180-whole.dim_800x600.jpg",
    label: "W180 — Largest",
  },
  {
    grade: "W240",
    kernels: "220–240",
    description: "Large attractive kernels",
    buyers: "Export & supermarkets",
    image: "/assets/generated/cashew-w240-whole.dim_800x600.jpg",
    label: "W240 — Large",
  },
  {
    grade: "W320",
    kernels: "300–320",
    description: "Standard global trade grade",
    buyers: "Wholesale & snacks",
    image: "/assets/generated/cashew-w320-whole.dim_800x600.jpg",
    label: "W320 — Standard",
  },
];

const BROKEN_GRADES = [
  {
    grade: "JH",
    description: "Cashew halves",
    use: "Retail & cooking",
    image: "/assets/generated/cashew-broken-jh.dim_800x600.jpg",
    label: "JH — Cashew Halves",
  },
  {
    grade: "LWP",
    description: "Large white pieces",
    use: "Sweets & confectionery",
    image: "/assets/generated/cashew-broken-lwp.dim_800x600.jpg",
    label: "LWP — Large Pieces",
  },
  {
    grade: "SWP",
    description: "Small white pieces",
    use: "Bakery & snacks",
    image: "/assets/generated/cashew-broken-swp.dim_800x600.jpg",
    label: "SWP — Small Pieces",
  },
];

const SIZE_COMPARISON = [
  { id: "w180", label: "W180", isArrow: false },
  { id: "arrow1", label: ">", isArrow: true },
  { id: "w240", label: "W240", isArrow: false },
  { id: "arrow2", label: ">", isArrow: true },
  { id: "w320", label: "W320", isArrow: false },
];

export function CashewGradesPage() {
  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <span className="text-xs font-semibold tracking-widest uppercase text-accent">
          Buyer's Reference
        </span>
        <h1 className="font-display text-4xl md:text-5xl font-bold mt-2 mb-4">
          Cashew Grades Guide
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Understanding cashew grades helps you select the right kernel for your
          business. Each grade has specific applications and pricing.
        </p>
      </motion.div>

      {/* Whole Kernel Grades */}
      <section className="mb-16">
        <div className="mb-6">
          <h2 className="font-display text-2xl md:text-3xl font-bold mb-2">
            Whole Kernel Grades
          </h2>
          <p className="text-muted-foreground">
            Whole cashew kernels are graded by size — the number indicates
            kernels per pound. Fewer kernels per pound means larger kernels.
          </p>
        </div>

        {/* Visual comparison */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {WHOLE_GRADES.map((g, i) => (
            <motion.div
              key={g.grade}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="bg-card rounded-xl overflow-hidden shadow-card border border-border"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={g.image}
                  alt={g.label}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4 text-center">
                <Badge className="mb-1 text-sm px-3 py-1">{g.grade}</Badge>
                <p className="text-sm text-muted-foreground mt-1">{g.label}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {g.kernels} kernels/lb
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Size comparison indicator */}
        <div className="bg-secondary/50 rounded-xl p-5 mb-8 border border-border">
          <p className="text-sm font-semibold text-center mb-3">
            Size Comparison (Largest → Smallest)
          </p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            {SIZE_COMPARISON.map((item) => (
              <span
                key={item.id}
                className={
                  item.isArrow
                    ? "text-muted-foreground text-lg"
                    : "bg-primary text-primary-foreground text-sm font-bold px-3 py-1 rounded-full"
                }
              >
                {item.label}
              </span>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="bg-card rounded-xl overflow-hidden shadow-card border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-semibold">Grade</TableHead>
                <TableHead className="font-semibold">
                  Kernels per pound
                </TableHead>
                <TableHead className="font-semibold">Description</TableHead>
                <TableHead className="font-semibold">Typical Buyers</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {WHOLE_GRADES.map((g) => (
                <TableRow key={g.grade}>
                  <TableCell>
                    <Badge variant="outline" className="font-mono font-bold">
                      {g.grade}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-mono text-sm">
                    {g.kernels}
                  </TableCell>
                  <TableCell>{g.description}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {g.buyers}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>

      {/* Broken Kernel Grades */}
      <section className="mb-16">
        <div className="mb-6">
          <h2 className="font-display text-2xl md:text-3xl font-bold mb-2">
            Broken Kernel Grades
          </h2>
          <p className="text-muted-foreground">
            Broken grades are produced during processing and are cost-effective
            for food manufacturers. They offer the same nutritional value as
            whole kernels at a lower price point.
          </p>
        </div>

        {/* Visual comparison */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {BROKEN_GRADES.map((g, i) => (
            <motion.div
              key={g.grade}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="bg-card rounded-xl overflow-hidden shadow-card border border-border"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={g.image}
                  alt={g.label}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4 text-center">
                <Badge variant="secondary" className="mb-1 text-sm px-3 py-1">
                  {g.grade}
                </Badge>
                <p className="text-sm text-muted-foreground mt-1">{g.label}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Table */}
        <div className="bg-card rounded-xl overflow-hidden shadow-card border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-semibold">Grade</TableHead>
                <TableHead className="font-semibold">Description</TableHead>
                <TableHead className="font-semibold">
                  Typical Industry Use
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {BROKEN_GRADES.map((g) => (
                <TableRow key={g.grade}>
                  <TableCell>
                    <Badge variant="outline" className="font-mono font-bold">
                      {g.grade}
                    </Badge>
                  </TableCell>
                  <TableCell>{g.description}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {g.use}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>

      {/* Size Infographic */}
      <section className="mb-12">
        <div className="mb-6">
          <h2 className="font-display text-2xl md:text-3xl font-bold mb-2">
            Kernel Size Comparison
          </h2>
          <p className="text-muted-foreground">
            Visual guide to cashew kernel sizes across all grades.
          </p>
        </div>
        <div className="bg-card rounded-xl overflow-hidden shadow-card border border-border p-4">
          <img
            src="/assets/generated/cashew-size-infographic.dim_800x400.png"
            alt="Cashew kernel size comparison: W180 > W240 > W320 > LWP > SWP"
            className="w-full rounded-lg"
          />
          <p className="text-center text-sm text-muted-foreground mt-3 font-medium">
            Largest → Smallest: W180 &gt; W240 &gt; W320 &gt; LWP &gt; SWP
          </p>
        </div>
      </section>

      {/* CTA */}
      <div className="text-center py-8">
        <p className="text-muted-foreground mb-4">
          Ready to place a bulk order? Browse our full product range.
        </p>
        <Button size="lg" asChild data-ocid="grades.view_products_button">
          <Link to="/products">View All Products</Link>
        </Button>
      </div>
    </main>
  );
}

import { Badge } from "@/components/ui/badge";

const grades = [
  {
    grade: "W180",
    label: "Premium Large",
    size: 72,
    price: "₹1,020/kg",
    description:
      "180 kernels per pound. Largest whole cashew kernels. Top-tier grade for gourmet retail and premium gifting.",
    tag: "Premium",
    tagColor: "default" as const,
  },
  {
    grade: "W240",
    label: "Medium Large",
    size: 56,
    price: "₹820/kg",
    description:
      "240 kernels per pound. Excellent for retail packaging, hotel restaurants, and premium food service.",
    tag: "Popular",
    tagColor: "secondary" as const,
  },
  {
    grade: "W320",
    label: "Standard Export",
    size: 44,
    price: "₹760/kg",
    description:
      "320 kernels per pound. Most widely traded export grade globally. Ideal for bulk wholesale.",
    tag: "Best Value",
    tagColor: "outline" as const,
  },
];

export function GradeChart() {
  return (
    <section className="py-16 bg-secondary/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <span className="text-xs font-semibold tracking-widest uppercase text-accent">
            Grade Guide
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold mt-2 mb-3">
            Cashew Grade Comparison
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Whole kernel grades are classified by count per pound. Lower count =
            larger kernel = higher value.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {grades.map((g) => (
            <div
              key={g.grade}
              className="bg-card rounded-xl p-6 shadow-card flex flex-col items-center text-center"
            >
              {/* Size indicator circle */}
              <div
                className="rounded-full bg-cashew-200 border-4 border-cashew-300 mb-4 flex items-center justify-center"
                style={{ width: g.size, height: g.size }}
              >
                <span className="font-display font-bold text-brown-800 text-sm">
                  {g.grade}
                </span>
              </div>
              <Badge variant={g.tagColor} className="mb-2 text-xs">
                {g.tag}
              </Badge>
              <h3 className="font-display font-semibold text-xl mb-1">
                {g.grade}
              </h3>
              <p className="text-xs text-muted-foreground mb-2 font-medium">
                {g.label}
              </p>
              <p className="text-lg font-bold price-display mb-3">{g.price}</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {g.description}
              </p>
            </div>
          ))}
        </div>

        {/* Size infographic bar */}
        <div className="mt-10 bg-card rounded-xl p-6 shadow-card">
          <h3 className="font-display font-semibold text-center mb-6">
            Kernel Size Infographic
          </h3>
          <div className="flex items-end justify-around gap-4">
            {grades.map((g) => (
              <div key={g.grade} className="flex flex-col items-center gap-2">
                <span className="text-xs font-medium text-muted-foreground">
                  {g.price}
                </span>
                <div
                  className="rounded-full bg-gradient-to-br from-cashew-200 to-cashew-400 border-2 border-cashew-300"
                  style={{ width: g.size, height: g.size }}
                />
                <span className="font-bold text-sm">{g.grade}</span>
                <span className="text-xs text-muted-foreground">{g.label}</span>
              </div>
            ))}
          </div>
          <p className="text-center text-xs text-muted-foreground mt-6">
            Visual sizes are proportional. W180 kernels are ~64% larger by area
            than W320.
          </p>
        </div>
      </div>
    </section>
  );
}

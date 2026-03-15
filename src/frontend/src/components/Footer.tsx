import { Mail, MessageCircle, Phone } from "lucide-react";

export function Footer() {
  const year = new Date().getFullYear();
  const hostname =
    typeof window !== "undefined" ? window.location.hostname : "";
  const caffeineLink = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(hostname)}`;

  return (
    <footer className="bg-foreground text-primary-foreground" id="contact">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <img
              src="/assets/generated/kajuz-logo-transparent.dim_400x120.png"
              alt="kajuz by Amma's Naturalz"
              className="h-12 w-auto object-contain brightness-0 invert mb-4"
            />
            <p className="text-sm text-primary-foreground/70 leading-relaxed">
              Premium cashew kernels for wholesalers, retailers, bakeries, and
              distributors. Tanzanian and Indian origins.
            </p>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-display font-semibold text-lg mb-4">Contact</h3>
            <div className="space-y-3 text-sm text-primary-foreground/80">
              <div className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4 text-green-400 flex-shrink-0" />
                <a
                  href="https://wa.me/919188520881"
                  className="hover:text-white transition-colors"
                >
                  +91 91885 20881
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-green-400 flex-shrink-0" />
                <a
                  href="mailto:ammasnaturalz@gmail.com"
                  className="hover:text-white transition-colors"
                >
                  ammasnaturalz@gmail.com
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-green-400 flex-shrink-0" />
                <span>UPI: ammasnaturalz@okhdfcbank</span>
              </div>
            </div>
          </div>

          {/* B2B Info */}
          <div id="about">
            <h3 className="font-display font-semibold text-lg mb-4">
              B2B Only Platform
            </h3>
            <p className="text-sm text-primary-foreground/70 leading-relaxed mb-2">
              Exclusively for wholesalers, retailers, bakery producers, and
              distributors.
            </p>
            <p className="text-sm text-primary-foreground/70">
              Minimum Order Quantity:{" "}
              <strong className="text-white">100 kg</strong> per product
            </p>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-primary-foreground/20 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-primary-foreground/50">
          <span>© {year} kajuz by Amma's Naturalz ™</span>
          <a
            href={caffeineLink}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary-foreground/80 transition-colors"
          >
            Built with ❤️ using caffeine.ai
          </a>
        </div>
      </div>
    </footer>
  );
}

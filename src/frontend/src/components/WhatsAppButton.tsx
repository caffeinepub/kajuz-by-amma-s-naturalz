import { MessageCircle } from "lucide-react";

export function WhatsAppButton() {
  const url =
    "https://wa.me/919188520881?text=Hello%2C%20I%20want%20to%20place%20a%20bulk%20order%20for%20cashew%20kernels.";
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-4 z-50 flex items-center gap-2 bg-[#25D366] text-white rounded-full shadow-commodity px-3 py-3 sm:px-5 sm:py-3 hover:bg-[#128C7E] transition-colors"
      data-ocid="whatsapp.floating_button"
      aria-label="Order via WhatsApp"
    >
      <MessageCircle className="h-5 w-5 flex-shrink-0" />
      <span className="hidden sm:inline text-sm font-medium">
        Order via WhatsApp
      </span>
    </a>
  );
}

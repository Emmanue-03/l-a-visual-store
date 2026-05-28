import { MessageCircle } from "lucide-react";
import { WHATSAPP_PHONE } from "@/lib/mock-data";

export function WhatsAppFab({ whatsappPhone = WHATSAPP_PHONE }: { whatsappPhone?: string }) {
  const url = `https://wa.me/${whatsappPhone}?text=${encodeURIComponent("Hola L&A Multiventas")}`;
  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      aria-label="Chatear por WhatsApp"
      className="group fixed bottom-5 right-5 z-40 inline-flex items-center gap-3 rounded-full bg-gradient-to-b from-[#2BE471] to-[#19BD58] px-4 py-3 text-sm font-bold text-[#052915] shadow-[0_14px_34px_-12px_rgba(37,211,102,.7),inset_0_1px_0_rgba(255,255,255,.5)] transition hover:-translate-y-0.5 sm:bottom-6 sm:right-6"
    >
      <span className="relative inline-flex h-2 w-2 rounded-full bg-[#062915]">
        <span className="absolute inset-0 animate-ping rounded-full bg-[#062915]/55" />
      </span>
      <MessageCircle className="h-5 w-5" />
      <span className="hidden md:inline">Chatea ahora — respondemos al toque</span>
    </a>
  );
}

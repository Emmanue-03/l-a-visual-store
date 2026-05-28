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
      title="Chatear por WhatsApp"
      className="group fixed bottom-5 right-5 z-40 inline-flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-b from-[#2BE471] to-[#19BD58] text-[#052915] shadow-[0_14px_34px_-12px_rgba(37,211,102,.7),inset_0_1px_0_rgba(255,255,255,.5)] transition hover:-translate-y-0.5 sm:bottom-6 sm:right-6"
    >
      <MessageCircle className="h-6 w-6" />
      <span className="pointer-events-none absolute inset-0 -z-10 rounded-full bg-[#19BD58]/70 animate-ping" />
    </a>
  );
}

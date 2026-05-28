import { MessageCircle, Truck } from "lucide-react";

export function Topbar({ whatsappPhone }: { whatsappPhone?: string }) {
  const wa = whatsappPhone
    ? `https://wa.me/${whatsappPhone}?text=${encodeURIComponent("Hola L&A Multiventas")}`
    : "#";
  return (
    <div className="bg-[#0B1B3F] text-white/85 text-[11.5px] tracking-[0.04em]">
      <div className="mx-auto flex h-9 max-w-[1240px] items-center justify-center px-4 sm:justify-between sm:px-7">
        <div className="flex items-center gap-2">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-brand-gold shadow-[0_0_12px] shadow-brand-gold" />
          <Truck className="h-3.5 w-3.5 opacity-80" />
          <span>Envíos en 24/48 hs a todo el país</span>
        </div>
        <div className="hidden items-center gap-5 sm:flex">
          <a
            href={wa}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 font-semibold text-white/90 transition hover:text-white"
          >
            <MessageCircle className="h-3.5 w-3.5" />
            Asesoramiento por WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}

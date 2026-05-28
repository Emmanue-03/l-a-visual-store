import { ArrowRight, MessageCircle, ShieldCheck, Truck, Users } from "lucide-react";
import { SectionHead } from "./SectionHead";

const items = [
  {
    icon: ShieldCheck,
    title: "Compra 100% segura",
    desc: "Mercado Pago, transferencia o efectivo. Datos protegidos y proceso verificado de principio a fin.",
    cta: "Saber más",
    tone: "blue" as const,
  },
  {
    icon: MessageCircle,
    title: "Atención por WhatsApp",
    desc: "Respondemos en minutos. Te asesoramos antes de comprar y coordinamos el envío en tiempo real.",
    cta: "Escribinos",
    tone: "green" as const,
  },
  {
    icon: Truck,
    title: "Envíos rápidos",
    desc: "Despacho en 24/48 hs y entrega a todo el país. Coordinamos retiro o envío según prefieras.",
    cta: "Cómo enviamos",
    tone: "gold" as const,
  },
  {
    icon: Users,
    title: "Soporte cercano",
    desc: "Equipo real respondiendo dudas. Si algo sale mal, lo resolvemos. Atención post-venta sin excusas.",
    cta: "Conocenos",
    tone: "blue" as const,
  },
];

const toneClasses: Record<"blue" | "green" | "gold", string> = {
  blue: "bg-brand-soft text-brand-royal ring-brand-royal/15",
  green: "bg-emerald-50 text-emerald-600 ring-emerald-200",
  gold: "bg-brand-gold-soft/40 text-brand-gold ring-brand-gold/30",
};

export function BenefitsSection() {
  return (
    <section className="relative mx-auto max-w-[1240px] px-4 py-14 sm:px-7 lg:py-20">
      <SectionHead
        kicker="¿Por qué L&A?"
        title={
          <>
            Una compra <span className="text-brand-gold">cuidada de principio a fin</span>.
          </>
        }
        description="Acompañamos cada pedido con atención personal, envío coordinado y soporte post-venta real."
      />

      <div className="mt-8 grid gap-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-4">
        {items.map((b) => (
          <article
            key={b.title}
            className="group flex h-full flex-col rounded-2xl border border-brand-soft bg-white p-6 transition hover:-translate-y-1 hover:border-brand-royal/30 hover:shadow-card"
          >
            <div className={`grid h-14 w-14 place-items-center rounded-2xl ring-1 transition ${toneClasses[b.tone]}`}>
              <b.icon className="h-6 w-6" />
            </div>
            <h4 className="mt-5 font-display text-[18px] font-bold leading-tight text-brand-deep">
              {b.title}
            </h4>
            <p className="mt-2 flex-1 text-[14px] leading-[1.55] text-brand-muted">{b.desc}</p>
            <span className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-bold text-brand-royal transition group-hover:gap-2.5">
              {b.cta}
              <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </article>
        ))}
      </div>
    </section>
  );
}

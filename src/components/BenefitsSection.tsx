import { Truck, MessageCircle, ShieldCheck, BadgeCheck, Smartphone } from "lucide-react";

const items = [
  { icon: Truck, title: "Envíos rápidos", desc: "Coordinamos al toque tu entrega." },
  { icon: MessageCircle, title: "Atención por WhatsApp", desc: "Resolvemos consultas en minutos." },
  { icon: ShieldCheck, title: "Pagos seguros", desc: "Tus datos y tu compra protegidos." },
  { icon: BadgeCheck, title: "Productos seleccionados", desc: "Calidad y precio garantizados." },
  { icon: Smartphone, title: "Comprá desde tu celular", desc: "Diseño rápido, simple y mobile first." },
];

export function BenefitsSection() {
  return (
    <section className="relative mx-auto max-w-7xl px-4 py-20 lg:px-8 lg:py-24">
      <div className="mx-auto mb-12 max-w-2xl text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-brand-royal/15 bg-brand-soft px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-brand-royal">
          Por qué elegirnos
        </div>
        <h2 className="mt-4 font-display text-3xl font-bold leading-tight text-brand-deep sm:text-4xl lg:text-5xl">
          Fácil, rápido y <span className="text-gradient-royal">seguro</span>
        </h2>
        <p className="mt-3 text-muted-foreground">
          Diseñamos cada paso de tu experiencia para que compres con total confianza.
        </p>
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
        {items.map((b) => (
          <div
            key={b.title}
            className="premium-card premium-panel group relative overflow-hidden rounded-2xl p-5 text-center card-hover"
          >
            <div className="absolute inset-x-0 -top-px h-px gold-hairline opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-brand-soft to-white text-brand-royal ring-1 ring-brand-royal/10 transition-all duration-500 group-hover:scale-110 group-hover:from-brand-royal group-hover:to-brand-deep group-hover:text-white group-hover:shadow-lg group-hover:shadow-brand-royal/30">
              <b.icon className="h-6 w-6" />
            </div>
            <div className="mt-4 font-display text-sm font-bold text-brand-deep">{b.title}</div>
            <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{b.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

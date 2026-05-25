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
    <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8 lg:py-20">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <h2 className="font-display text-3xl font-bold text-brand-deep sm:text-4xl">
          Comprar en L&A Multiventas es fácil, rápido y seguro
        </h2>
        <p className="mt-3 text-muted-foreground">Diseñamos cada paso de tu experiencia para que compres con total confianza.</p>
      </div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
        {items.map((b) => (
          <div key={b.title} className="rounded-2xl border border-border bg-card p-4 text-center card-hover">
            <div className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-brand-soft text-brand-royal">
              <b.icon className="h-5 w-5" />
            </div>
            <div className="mt-3 font-display text-sm font-bold text-brand-deep">{b.title}</div>
            <p className="mt-1 text-xs text-muted-foreground">{b.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

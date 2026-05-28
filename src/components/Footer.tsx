import { Link } from "@tanstack/react-router";
import { FormEvent, useState } from "react";
import { Facebook, Instagram, MessageCircle, Users } from "lucide-react";
import { Logo } from "./Logo";
import { TikTokIcon } from "./icons/TikTokIcon";
import { CONTACT } from "@/lib/contact";

const PAYMENTS = ["VISA", "MC", "AMEX", "MP", "TRANSF.", "EFECTIVO"];

export function Footer() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email.trim()) return;
    setDone(true);
    setEmail("");
  };

  return (
    <footer
      className="relative overflow-hidden text-white/75"
      style={{
        background:
          "radial-gradient(120% 100% at 0% 0%, rgba(31,61,224,.25) 0%, transparent 55%), radial-gradient(80% 80% at 100% 100%, rgba(212,162,76,.10) 0%, transparent 60%), linear-gradient(180deg, #0B1B3F 0%, #050B1F 100%)",
      }}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(212,162,76,.55),transparent)]" />

      <div className="mx-auto grid max-w-[1240px] gap-10 px-4 py-14 sm:px-7 lg:grid-cols-[1.4fr_repeat(4,1fr)] lg:gap-8">
        {/* Brand col */}
        <div>
          <Link to="/" className="flex items-center gap-3">
            <span className="grid h-12 w-12 place-items-center overflow-hidden rounded-full bg-white ring-1 ring-white/20">
              <Logo className="h-full w-full" />
            </span>
            <span className="flex flex-col leading-none">
              <span className="font-display text-[18px] font-extrabold text-white">
                L<span className="mx-0.5 text-brand-gold">&amp;</span>A Multiventas
              </span>
              <span className="mt-1 text-[10px] font-bold uppercase tracking-[0.28em] text-white/55">
                Tu multitienda
              </span>
            </span>
          </Link>
          <p className="mt-5 max-w-md text-[14px] leading-[1.6] text-white/65">
            Tienda online multirubro con atención personal. Tecnología, hogar, accesorios y mucho más,
            con asesoramiento real y envíos coordinados a todo el país.
          </p>

          <form
            onSubmit={submit}
            className="mt-6 flex h-12 items-center gap-2 overflow-hidden rounded-full border border-white/10 bg-white/[0.06] pl-4 pr-1 backdrop-blur"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder={done ? "¡Gracias por suscribirte!" : "Tu email para ofertas exclusivas"}
              className="min-w-0 flex-1 bg-transparent text-sm text-white placeholder:text-white/55 outline-none"
            />
            <button
              type="submit"
              className="inline-flex h-10 items-center rounded-full bg-brand-gold px-4 text-sm font-bold text-[#1a1106] transition hover:scale-[1.03]"
            >
              Suscribirme
            </button>
          </form>

          <div className="mt-5 flex gap-2">
            <SocialLink href={CONTACT.instagram} label="Instagram"><Instagram className="h-4 w-4" /></SocialLink>
            <SocialLink href={CONTACT.tiktok} label="TikTok"><TikTokIcon className="h-4 w-4" /></SocialLink>
            <SocialLink href={CONTACT.facebook} label="Facebook"><Facebook className="h-4 w-4" /></SocialLink>
            <SocialLink href={CONTACT.fanpage} label="Fan page de Facebook"><Users className="h-4 w-4" /></SocialLink>
            <SocialLink href={CONTACT.whatsappUrl} label="WhatsApp"><MessageCircle className="h-4 w-4" /></SocialLink>
          </div>
        </div>

        <FooterCol
          title="Tienda"
          items={[
            { l: "Catálogo", to: "/catalogo" },
            { l: "Ofertas", to: "/catalogo", search: { tag: "ofertas" } },
            { l: "Más vendidos", to: "/catalogo" },
            { l: "Nuevos ingresos", to: "/catalogo", search: { tag: "nuevos" } },
            { l: "Marcas", to: "/catalogo" },
          ]}
        />
        <FooterCol
          title="Categorías"
          items={[
            { l: "Tecnología", to: "/catalogo", search: { categoria: "tecnologia" } },
            { l: "Hogar y deco", to: "/catalogo", search: { categoria: "hogar" } },
            { l: "Belleza", to: "/catalogo", search: { categoria: "belleza" } },
            { l: "Accesorios", to: "/catalogo", search: { categoria: "accesorios" } },
            { l: "Deportes", to: "/catalogo", search: { categoria: "deportes" } },
          ]}
        />
        <FooterCol
          title="Ayuda"
          items={[
            { l: "Cómo comprar", to: "/contacto" },
            { l: "Medios de pago", to: "/contacto" },
            { l: "Envíos", to: "/contacto" },
            { l: "Cambios y devoluciones", to: "/contacto" },
            { l: "Preguntas frecuentes", to: "/contacto" },
          ]}
        />
        <div>
          <h5 className="font-display text-[13px] font-bold uppercase tracking-[0.18em] text-white">
            Contacto
          </h5>
          <ul className="mt-4 space-y-2.5 text-[14px]">
            <ContactLink href={CONTACT.whatsappUrl} external>+595 975 484333</ContactLink>
            <ContactLink href={`mailto:${CONTACT.email}`}>{CONTACT.email}</ContactLink>
            <ContactLink href={CONTACT.instagram} external>Instagram</ContactLink>
            <ContactLink href={CONTACT.tiktok} external>TikTok</ContactLink>
            <ContactLink href={CONTACT.facebook} external>Facebook</ContactLink>
            <ContactLink href={CONTACT.fanpage} external>Fan page</ContactLink>
            <li>
              <span className="inline-flex items-center gap-2 text-white/70">
                <span className="h-1 w-1 rounded-full bg-brand-gold/60" />
                Lun–Sáb · 9 a 20 hs
              </span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/[0.08]">
        <div className="mx-auto flex max-w-[1240px] flex-wrap items-center justify-between gap-3 px-4 py-5 text-[12px] text-white/55 sm:px-7">
          <span>
            © {new Date().getFullYear()} L&amp;A Multiventas · Todos los derechos reservados
          </span>
          <a
            href="https://neura.com.py"
            target="_blank"
            rel="noreferrer"
            className="order-3 inline-flex w-full items-center justify-center gap-1.5 text-[11.5px] text-white/55 transition hover:text-brand-gold sm:order-none sm:w-auto"
          >
            Desarrollado por{" "}
            <span className="font-display font-bold tracking-[0.04em] text-brand-gold-soft">
              Neura
            </span>
          </a>
          <div className="flex flex-wrap items-center gap-1.5">
            {PAYMENTS.map((p) => (
              <span
                key={p}
                className="rounded-md border border-white/10 bg-white/[0.06] px-2 py-1 text-[10px] font-bold tracking-[0.08em] text-white/70"
              >
                {p}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  items,
}: {
  title: string;
  items: { l: string; to: string; search?: Record<string, string> }[];
}) {
  return (
    <div>
      <h5 className="font-display text-[13px] font-bold uppercase tracking-[0.18em] text-white">
        {title}
      </h5>
      <ul className="mt-4 space-y-2.5 text-[14px]">
        {items.map((it) => (
          <li key={it.l}>
            <Link
              to={it.to}
              search={it.search as any}
              className="group inline-flex items-center gap-2 text-white/70 transition hover:text-brand-gold"
            >
              <span className="h-1 w-1 rounded-full bg-brand-gold/60 transition group-hover:bg-brand-gold" />
              {it.l}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ContactLink({
  href,
  external,
  children,
}: {
  href: string;
  external?: boolean;
  children: React.ReactNode;
}) {
  return (
    <li>
      <a
        href={href}
        {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
        className="group inline-flex items-center gap-2 text-white/70 transition hover:text-brand-gold"
      >
        <span className="h-1 w-1 rounded-full bg-brand-gold/60 transition group-hover:bg-brand-gold" />
        {children}
      </a>
    </li>
  );
}

function SocialLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      className="grid h-9 w-9 place-items-center rounded-full border border-white/15 text-white/75 transition hover:-translate-y-0.5 hover:border-brand-gold/50 hover:bg-white/10 hover:text-white"
    >
      {children}
    </a>
  );
}

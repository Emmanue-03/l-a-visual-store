import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowRight,
  Award,
  CalendarCheck,
  CheckCircle2,
  ChevronRight,
  Clock,
  CreditCard,
  Facebook,
  Heart,
  Instagram,
  MapPin,
  MessageCircle,
  Phone,
  ShieldCheck,
  Smile,
  Sparkles,
  Star,
  Stethoscope,
  Syringe,
  Users,
} from "lucide-react";
import heroImg from "@/assets/dental-hero.jpg";
import clinicImg from "@/assets/dental-clinic.jpg";
import doctorImg from "@/assets/dental-doctor.jpg";
import baImg from "@/assets/dental-beforeafter-1.jpg";

const WHATSAPP =
  "https://wa.me/595975484333?text=" +
  encodeURIComponent("Hola Blanc Dental Studio, quiero agendar una consulta.");

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Blanc Dental Studio | Odontología premium en Asunción" },
      {
        name: "description",
        content:
          "Clínica odontológica moderna en Asunción. Diseño de sonrisa, ortodoncia, implantes y odontopediatría con tecnología de última generación. Reservá por WhatsApp.",
      },
      { property: "og:title", content: "Blanc Dental Studio | Sonrisas que inspiran" },
      {
        property: "og:description",
        content:
          "Estética dental, ortodoncia, implantes y más. Tecnología premium con calidez humana.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: BlancDentalLanding,
});

/* --------------------------------- shell --------------------------------- */

function BlancDentalLanding() {
  return (
    <div className="bg-white text-slate-800 [font-family:'Inter',sans-serif]">
      <DentalHeader />
      <Hero />
      <TrustBar />
      <Services />
      <WhyUs />
      <Gallery />
      <Testimonials />
      <Payments />
      <FinalCTA />
      <DentalFooter />
      <FloatingWhatsApp />
    </div>
  );
}

/* --------------------------------- brand --------------------------------- */

function Wordmark({ compact = false }: { compact?: boolean }) {
  return (
    <a href="#top" className="group flex items-center gap-2.5">
      <span
        className="grid h-11 w-11 place-items-center rounded-2xl text-white shadow-[0_10px_24px_-10px_rgba(30,110,200,0.55)] transition group-hover:scale-105"
        style={{
          background:
            "linear-gradient(135deg, #2E7BD6 0%, #4FA3E6 55%, #7CD3C3 100%)",
        }}
      >
        <Smile className="h-5 w-5" strokeWidth={2.2} />
      </span>
      <span className="leading-tight">
        <span className="block [font-family:'Playfair_Display',serif] text-[19px] font-semibold tracking-tight text-slate-900">
          Blanc <span className="italic text-[#2E7BD6]">Dental</span> Studio
        </span>
        {!compact && (
          <span className="mt-0.5 block text-[10px] font-semibold uppercase tracking-[0.28em] text-slate-500">
            Sonrisas que inspiran
          </span>
        )}
      </span>
    </a>
  );
}

/* --------------------------------- header -------------------------------- */

function DentalHeader() {
  const nav = [
    { l: "Nosotros", h: "#nosotros" },
    { l: "Servicios", h: "#servicios" },
    { l: "Galería", h: "#galeria" },
    { l: "Testimonios", h: "#testimonios" },
    { l: "Contacto", h: "#contacto" },
  ];
  return (
    <header
      id="top"
      className="sticky top-0 z-30 border-b border-slate-100/80 bg-white/85 backdrop-blur-md"
    >
      <div className="mx-auto flex max-w-[1200px] items-center justify-between px-4 py-3 sm:px-8 sm:py-4">
        <Wordmark />
        <nav className="hidden items-center gap-8 lg:flex">
          {nav.map((n) => (
            <a
              key={n.h}
              href={n.h}
              className="text-[13.5px] font-medium text-slate-600 transition hover:text-[#2E7BD6]"
            >
              {n.l}
            </a>
          ))}
        </nav>
        <a
          href={WHATSAPP}
          target="_blank"
          rel="noreferrer"
          className="inline-flex h-11 items-center gap-2 rounded-full bg-[#2E7BD6] px-5 text-[13.5px] font-semibold text-white shadow-[0_10px_28px_-12px_rgba(46,123,214,0.75)] transition hover:-translate-y-0.5 hover:bg-[#1e6ec9]"
        >
          <CalendarCheck className="h-4 w-4" />
          Reservar turno
        </a>
      </div>
    </header>
  );
}

/* ---------------------------------- hero --------------------------------- */

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(80% 60% at 15% 10%, #EAF4FE 0%, transparent 60%), radial-gradient(70% 60% at 90% 90%, #E6FBF3 0%, transparent 65%), #ffffff",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 top-32 -z-10 h-72 w-72 rounded-full bg-[#BEE0FA] opacity-50 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-20 bottom-10 -z-10 h-80 w-80 rounded-full bg-[#C5F1E1] opacity-50 blur-3xl"
      />

      <div className="mx-auto grid max-w-[1200px] items-center gap-12 px-4 pb-20 pt-14 sm:px-8 lg:grid-cols-[1.05fr_1fr] lg:gap-16 lg:pb-28 lg:pt-20">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-[#CFE4FB] bg-white/70 px-3.5 py-1.5 text-[11.5px] font-semibold uppercase tracking-[0.16em] text-[#2E7BD6] backdrop-blur">
            <Sparkles className="h-3.5 w-3.5" />
            Odontología premium · Asunción
          </span>

          <h1 className="mt-6 [font-family:'Playfair_Display',serif] text-[clamp(38px,5.4vw,62px)] font-semibold leading-[1.02] tracking-[-0.02em] text-slate-900">
            Diseñamos la <span className="italic text-[#2E7BD6]">sonrisa</span>{" "}
            que siempre soñaste.
          </h1>

          <p className="mt-5 max-w-[52ch] text-[16.5px] leading-[1.65] text-slate-600">
            En Blanc Dental Studio combinamos tecnología de última generación,
            protocolos de higiene rigurosos y un trato humano cercano para que
            cuides tu salud bucal con total tranquilidad.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href={WHATSAPP}
              target="_blank"
              rel="noreferrer"
              className="group inline-flex h-13 items-center gap-2.5 rounded-full bg-[#2E7BD6] px-6 py-3.5 text-[14px] font-semibold text-white shadow-[0_18px_44px_-18px_rgba(46,123,214,0.85)] transition hover:-translate-y-0.5 hover:bg-[#1e6ec9]"
            >
              <MessageCircle className="h-4 w-4" />
              Reservar por WhatsApp
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </a>
            <a
              href="#servicios"
              className="inline-flex h-13 items-center gap-2 rounded-full border border-slate-200 bg-white px-6 py-3.5 text-[14px] font-semibold text-slate-800 transition hover:border-[#2E7BD6] hover:text-[#2E7BD6]"
            >
              Ver servicios
              <ChevronRight className="h-4 w-4" />
            </a>
          </div>

          <div className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-4 border-t border-slate-100 pt-6">
            <MiniStat k="+15 años" v="de experiencia" />
            <MiniStat k="+8.500" v="pacientes felices" />
            <div className="flex items-center gap-2">
              <div className="flex text-[#F5B301]">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <span className="text-[12px] font-medium text-slate-500">
                4.9 · Reseñas verificadas
              </span>
            </div>
          </div>
        </div>

        {/* Hero visual */}
        <div className="relative">
          <div className="relative overflow-hidden rounded-[36px] shadow-[0_40px_80px_-40px_rgba(31,78,140,0.35)]">
            <img
              src={heroImg}
              alt="Paciente sonriendo tras tratamiento dental en Blanc Dental Studio"
              width={1400}
              height={1600}
              className="h-[520px] w-full object-cover sm:h-[600px]"
            />
            <div
              aria-hidden
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(180deg, transparent 55%, rgba(15,42,80,0.35) 100%)",
              }}
            />
          </div>

          {/* Floating card top-left */}
          <div className="absolute -left-4 top-8 hidden max-w-[220px] rounded-2xl border border-slate-100 bg-white/95 p-4 shadow-[0_20px_50px_-24px_rgba(31,78,140,0.35)] backdrop-blur sm:block">
            <div className="flex items-center gap-2.5">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#EAF4FE] text-[#2E7BD6]">
                <ShieldCheck className="h-4 w-4" />
              </span>
              <div>
                <p className="text-[12px] font-semibold text-slate-900">
                  Bioseguridad certificada
                </p>
                <p className="text-[11px] text-slate-500">
                  Esterilización nivel hospitalario
                </p>
              </div>
            </div>
          </div>

          {/* Floating card bottom-right */}
          <div className="absolute -right-4 bottom-8 hidden max-w-[240px] rounded-2xl border border-slate-100 bg-white/95 p-4 shadow-[0_20px_50px_-24px_rgba(31,78,140,0.35)] backdrop-blur sm:block">
            <div className="flex items-center gap-2.5">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#E6FBF3] text-[#2FA98A]">
                <CalendarCheck className="h-4 w-4" />
              </span>
              <div>
                <p className="text-[12px] font-semibold text-slate-900">
                  Turnos flexibles
                </p>
                <p className="text-[11px] text-slate-500">
                  Lun a Sáb · 8 a 20 hs
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function MiniStat({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <div className="[font-family:'Playfair_Display',serif] text-[22px] font-semibold text-slate-900">
        {k}
      </div>
      <div className="text-[11.5px] uppercase tracking-[0.14em] text-slate-500">
        {v}
      </div>
    </div>
  );
}

/* -------------------------------- trustbar ------------------------------- */

function TrustBar() {
  const items = [
    { i: <ShieldCheck className="h-4 w-4" />, t: "Bioseguridad certificada" },
    { i: <Award className="h-4 w-4" />, t: "Profesionales especialistas" },
    { i: <Sparkles className="h-4 w-4" />, t: "Tecnología láser y 3D" },
    { i: <Heart className="h-4 w-4" />, t: "Atención cercana y humana" },
  ];
  return (
    <div className="border-y border-slate-100 bg-[#F7FBFF]">
      <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-center gap-x-10 gap-y-3 px-4 py-5 text-[12.5px] font-semibold text-slate-600 sm:px-8">
        {items.map((it) => (
          <span key={it.t} className="inline-flex items-center gap-2">
            <span className="text-[#2E7BD6]">{it.i}</span>
            {it.t}
          </span>
        ))}
      </div>
    </div>
  );
}

/* -------------------------------- services ------------------------------- */

function Services() {
  const services = [
    {
      icon: <Sparkles className="h-5 w-5" />,
      title: "Diseño de sonrisa",
      desc: "Estética dental personalizada con carillas y blanqueamiento profesional.",
    },
    {
      icon: <Smile className="h-5 w-5" />,
      title: "Ortodoncia y alineadores",
      desc: "Brackets estéticos y alineadores transparentes para una sonrisa alineada.",
    },
    {
      icon: <Syringe className="h-5 w-5" />,
      title: "Implantes dentales",
      desc: "Reemplazo de piezas perdidas con implantes de titanio de alta gama.",
    },
    {
      icon: <Stethoscope className="h-5 w-5" />,
      title: "Odontología general",
      desc: "Limpiezas, empastes y diagnóstico integral con enfoque preventivo.",
    },
    {
      icon: <Heart className="h-5 w-5" />,
      title: "Odontopediatría",
      desc: "Atención suave y sin estrés para los más chicos, con láser.",
    },
    {
      icon: <ShieldCheck className="h-5 w-5" />,
      title: "Endodoncia y rehabilitación",
      desc: "Tratamientos de conducto y rehabilitación oral completa.",
    },
  ];
  return (
    <section id="servicios" className="mx-auto max-w-[1200px] px-4 py-24 sm:px-8">
      <SectionHead
        eyebrow="Servicios"
        title={
          <>
            Todo lo que tu sonrisa
            <br />
            <span className="italic text-[#2E7BD6]">necesita, en un solo lugar.</span>
          </>
        }
        subtitle="Un equipo multidisciplinario y tecnología de vanguardia para cada especialidad odontológica."
      />

      <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((s) => (
          <article
            key={s.title}
            className="group relative overflow-hidden rounded-[28px] border border-slate-100 bg-white p-7 transition hover:-translate-y-1 hover:border-[#CFE4FB] hover:shadow-[0_30px_60px_-30px_rgba(31,78,140,0.25)]"
          >
            <div
              aria-hidden
              className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-[#EAF4FE] opacity-0 blur-2xl transition group-hover:opacity-100"
            />
            <span className="relative grid h-12 w-12 place-items-center rounded-2xl bg-[#EAF4FE] text-[#2E7BD6] transition group-hover:bg-[#2E7BD6] group-hover:text-white">
              {s.icon}
            </span>
            <h3 className="relative mt-5 [font-family:'Playfair_Display',serif] text-[22px] font-semibold text-slate-900">
              {s.title}
            </h3>
            <p className="relative mt-2 text-[14.5px] leading-[1.6] text-slate-600">
              {s.desc}
            </p>
            <a
              href={WHATSAPP}
              target="_blank"
              rel="noreferrer"
              className="relative mt-5 inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#2E7BD6] transition hover:gap-2.5"
            >
              Consultar <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}

/* --------------------------------- why us -------------------------------- */

function WhyUs() {
  const points = [
    {
      i: <Award className="h-5 w-5" />,
      t: "Profesionales especializados",
      d: "Cada tratamiento es realizado por especialistas titulados, en constante formación internacional.",
    },
    {
      i: <Sparkles className="h-5 w-5" />,
      t: "Tecnología de última generación",
      d: "Escáner 3D, radiografía digital y láser dental para diagnósticos precisos y tratamientos sin dolor.",
    },
    {
      i: <ShieldCheck className="h-5 w-5" />,
      t: "Bioseguridad garantizada",
      d: "Protocolos hospitalarios de esterilización e insumos descartables en cada consulta.",
    },
    {
      i: <Heart className="h-5 w-5" />,
      t: "Trato humano y cercano",
      d: "Escuchamos, explicamos cada paso y acompañamos a cada paciente sin apuros.",
    },
  ];
  return (
    <section
      id="nosotros"
      className="relative overflow-hidden bg-[#F5FAFF] py-24"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-[#DCEDFC] blur-3xl"
      />
      <div className="mx-auto grid max-w-[1200px] items-center gap-14 px-4 sm:px-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="relative">
          <div className="overflow-hidden rounded-[32px] shadow-[0_30px_60px_-30px_rgba(31,78,140,0.35)]">
            <img
              src={clinicImg}
              alt="Consultorio moderno de Blanc Dental Studio"
              width={1600}
              height={1100}
              loading="lazy"
              className="h-[460px] w-full object-cover"
            />
          </div>
          <div className="absolute -bottom-6 -right-4 hidden rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_20px_50px_-24px_rgba(31,78,140,0.35)] sm:block">
            <div className="flex items-center gap-3">
              <div className="flex text-[#F5B301]">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <div>
                <p className="text-[13px] font-semibold text-slate-900">
                  4.9 / 5 en Google
                </p>
                <p className="text-[11px] text-slate-500">
                  +900 reseñas verificadas
                </p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-[#CFE4FB] bg-white px-3.5 py-1.5 text-[11.5px] font-semibold uppercase tracking-[0.16em] text-[#2E7BD6]">
            <Users className="h-3.5 w-3.5" />
            Por qué elegirnos
          </span>
          <h2 className="mt-5 [font-family:'Playfair_Display',serif] text-[clamp(28px,3.6vw,44px)] font-semibold leading-[1.08] tracking-tight text-slate-900">
            Odontología moderna con
            <br />
            <span className="italic text-[#2E7BD6]">calidez humana.</span>
          </h2>
          <p className="mt-4 max-w-[52ch] text-[15.5px] leading-[1.65] text-slate-600">
            Creamos experiencias dentales premium, combinando ciencia,
            comodidad y estética para que cuidar tu sonrisa sea un placer.
          </p>
          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            {points.map((p) => (
              <div
                key={p.t}
                className="rounded-2xl border border-white bg-white/70 p-5 backdrop-blur transition hover:border-[#CFE4FB] hover:bg-white"
              >
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#E6FBF3] text-[#2FA98A]">
                  {p.i}
                </span>
                <h4 className="mt-3 text-[15px] font-semibold text-slate-900">
                  {p.t}
                </h4>
                <p className="mt-1 text-[13px] leading-[1.55] text-slate-600">
                  {p.d}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* --------------------------------- gallery ------------------------------- */

function Gallery() {
  return (
    <section id="galeria" className="mx-auto max-w-[1200px] px-4 py-24 sm:px-8">
      <SectionHead
        eyebrow="Antes y después"
        title={
          <>
            Resultados que
            <br />
            <span className="italic text-[#2E7BD6]">hablan por sí solos.</span>
          </>
        }
        subtitle="Cada caso es único. Estos son algunos de nuestros pacientes reales tras sus tratamientos."
      />

      <div className="mt-14 grid gap-6 lg:grid-cols-2">
        <BAcard
          img={baImg}
          title="Blanqueamiento profesional"
          desc="Sesión única con láser. Ganancia de 6 tonos en 45 minutos."
          badge="Blanqueamiento"
        />
        <BAcard
          img={doctorImg}
          title="Diseño de sonrisa integral"
          desc="Carillas de porcelana + alineación previa. Proceso en 3 semanas."
          badge="Estética dental"
        />
      </div>

      <div className="mt-10 flex justify-center">
        <a
          href={WHATSAPP}
          target="_blank"
          rel="noreferrer"
          className="inline-flex h-12 items-center gap-2 rounded-full border border-slate-200 bg-white px-6 text-[13.5px] font-semibold text-slate-800 transition hover:border-[#2E7BD6] hover:text-[#2E7BD6]"
        >
          Ver más casos por WhatsApp
          <ArrowRight className="h-4 w-4" />
        </a>
      </div>
    </section>
  );
}

function BAcard({
  img,
  title,
  desc,
  badge,
}: {
  img: string;
  title: string;
  desc: string;
  badge: string;
}) {
  return (
    <figure className="group overflow-hidden rounded-[28px] border border-slate-100 bg-white shadow-[0_20px_50px_-30px_rgba(31,78,140,0.25)] transition hover:-translate-y-1">
      <div className="relative overflow-hidden">
        <img
          src={img}
          alt={title}
          loading="lazy"
          className="h-[340px] w-full object-cover transition duration-700 group-hover:scale-105"
        />
        <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#2E7BD6]">
          {badge}
        </span>
      </div>
      <figcaption className="p-6">
        <h3 className="[font-family:'Playfair_Display',serif] text-[22px] font-semibold text-slate-900">
          {title}
        </h3>
        <p className="mt-1.5 text-[14px] leading-[1.55] text-slate-600">
          {desc}
        </p>
      </figcaption>
    </figure>
  );
}

/* ------------------------------ testimonials ----------------------------- */

function Testimonials() {
  const items = [
    {
      n: "María González",
      r: "Diseño de sonrisa",
      t: "Nunca imaginé sentirme tan cómoda en una clínica dental. El resultado superó mis expectativas, todos me preguntan por mi sonrisa.",
    },
    {
      n: "Carlos Villalba",
      r: "Implante dental",
      t: "Profesionales de primer nivel. Me explicaron cada paso y el implante quedó impecable. Cero dolor, cero complicaciones.",
    },
    {
      n: "Lucía Pereira",
      r: "Ortodoncia invisible",
      t: "En 10 meses tuve la sonrisa que buscaba desde hace años. La atención es humana, cercana y súper profesional.",
    },
  ];
  return (
    <section
      id="testimonios"
      className="relative overflow-hidden bg-[#F7FBFF] py-24"
    >
      <div className="mx-auto max-w-[1200px] px-4 sm:px-8">
        <SectionHead
          eyebrow="Testimonios"
          title={
            <>
              Pacientes que
              <br />
              <span className="italic text-[#2E7BD6]">confían en nosotros.</span>
            </>
          }
          subtitle="Historias reales de personas que transformaron su sonrisa en Blanc Dental Studio."
        />
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {items.map((t) => (
            <article
              key={t.n}
              className="relative rounded-[28px] border border-slate-100 bg-white p-7 shadow-[0_20px_50px_-30px_rgba(31,78,140,0.2)]"
            >
              <div className="flex text-[#F5B301]">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <p className="mt-4 text-[14.5px] leading-[1.65] text-slate-700">
                "{t.t}"
              </p>
              <div className="mt-6 flex items-center gap-3 border-t border-slate-100 pt-4">
                <span
                  className="grid h-11 w-11 place-items-center rounded-full text-[13px] font-bold text-white"
                  style={{
                    background:
                      "linear-gradient(135deg, #2E7BD6 0%, #7CD3C3 100%)",
                  }}
                >
                  {t.n
                    .split(" ")
                    .map((x) => x[0])
                    .join("")}
                </span>
                <div>
                  <p className="text-[13.5px] font-semibold text-slate-900">
                    {t.n}
                  </p>
                  <p className="text-[11.5px] uppercase tracking-[0.12em] text-slate-500">
                    {t.r}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------- payments ------------------------------- */

function Payments() {
  const plans = [
    {
      name: "Consulta inicial",
      price: "Gs. 0",
      note: "Diagnóstico y presupuesto sin costo",
      features: [
        "Evaluación integral",
        "Plan de tratamiento",
        "Presupuesto claro sin sorpresas",
      ],
      cta: "Reservar consulta",
      highlight: false,
    },
    {
      name: "Plan sonrisa premium",
      price: "12 cuotas",
      note: "Financiación sin interés con tarjeta",
      features: [
        "Diseño de sonrisa completo",
        "Blanqueamiento láser incluido",
        "Control y seguimiento a 6 meses",
      ],
      cta: "Quiero este plan",
      highlight: true,
    },
    {
      name: "Ortodoncia flexible",
      price: "Cuotas mensuales",
      note: "Empezá tu tratamiento con bajo costo inicial",
      features: [
        "Ortodoncia o alineadores",
        "Control mensual incluido",
        "Todos los medios de pago",
      ],
      cta: "Consultar plan",
      highlight: false,
    },
  ];
  return (
    <section className="mx-auto max-w-[1200px] px-4 py-24 sm:px-8">
      <SectionHead
        eyebrow="Planes y pagos"
        title={
          <>
            Cuidar tu sonrisa
            <br />
            <span className="italic text-[#2E7BD6]">al alcance de todos.</span>
          </>
        }
        subtitle="Aceptamos todos los medios de pago y ofrecemos financiación con y sin interés."
      />

      <div className="mt-14 grid gap-6 lg:grid-cols-3">
        {plans.map((p) => (
          <article
            key={p.name}
            className={`relative overflow-hidden rounded-[28px] border p-8 transition ${
              p.highlight
                ? "border-transparent bg-slate-900 text-white shadow-[0_30px_60px_-30px_rgba(15,42,80,0.55)]"
                : "border-slate-100 bg-white text-slate-800 hover:-translate-y-1 hover:border-[#CFE4FB] hover:shadow-[0_30px_60px_-30px_rgba(31,78,140,0.25)]"
            }`}
          >
            {p.highlight && (
              <span className="absolute right-6 top-6 rounded-full bg-[#7CD3C3] px-3 py-1 text-[10.5px] font-bold uppercase tracking-[0.14em] text-slate-900">
                Más elegido
              </span>
            )}
            <h3
              className={`[font-family:'Playfair_Display',serif] text-[22px] font-semibold ${
                p.highlight ? "text-white" : "text-slate-900"
              }`}
            >
              {p.name}
            </h3>
            <div className="mt-4">
              <div
                className={`text-[32px] font-bold ${
                  p.highlight ? "text-white" : "text-slate-900"
                }`}
              >
                {p.price}
              </div>
              <p
                className={`text-[13px] ${
                  p.highlight ? "text-white/70" : "text-slate-500"
                }`}
              >
                {p.note}
              </p>
            </div>
            <ul
              className={`mt-6 space-y-2.5 text-[14px] ${
                p.highlight ? "text-white/90" : "text-slate-600"
              }`}
            >
              {p.features.map((f) => (
                <li key={f} className="flex items-start gap-2">
                  <CheckCircle2
                    className={`mt-0.5 h-4 w-4 flex-none ${
                      p.highlight ? "text-[#7CD3C3]" : "text-[#2FA98A]"
                    }`}
                  />
                  {f}
                </li>
              ))}
            </ul>
            <a
              href={WHATSAPP}
              target="_blank"
              rel="noreferrer"
              className={`mt-7 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full text-[13.5px] font-semibold transition ${
                p.highlight
                  ? "bg-white text-slate-900 hover:bg-[#7CD3C3]"
                  : "bg-[#2E7BD6] text-white hover:bg-[#1e6ec9]"
              }`}
            >
              {p.cta}
              <ArrowRight className="h-4 w-4" />
            </a>
          </article>
        ))}
      </div>

      <div className="mt-10 flex flex-wrap items-center justify-center gap-3 text-[12px] font-semibold text-slate-500">
        <CreditCard className="h-4 w-4 text-[#2E7BD6]" />
        Aceptamos:
        {["VISA", "MASTERCARD", "AMEX", "MERCADO PAGO", "TRANSFERENCIA", "EFECTIVO"].map(
          (p) => (
            <span
              key={p}
              className="rounded-md border border-slate-200 bg-white px-2.5 py-1 text-[10.5px] font-bold tracking-[0.08em] text-slate-600"
            >
              {p}
            </span>
          ),
        )}
      </div>
    </section>
  );
}

/* -------------------------------- final CTA ------------------------------ */

function FinalCTA() {
  return (
    <section id="contacto" className="mx-auto max-w-[1200px] px-4 pb-24 sm:px-8">
      <div
        className="relative overflow-hidden rounded-[36px] px-8 py-14 text-white sm:px-14 sm:py-20"
        style={{
          background:
            "radial-gradient(80% 100% at 100% 0%, #4FA3E6 0%, transparent 55%), radial-gradient(80% 100% at 0% 100%, #7CD3C3 0%, transparent 60%), linear-gradient(135deg, #0F2A50 0%, #1E4E8C 100%)",
        }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute -right-24 top-0 h-64 w-64 rounded-full bg-white/10 blur-3xl"
        />
        <div className="relative grid gap-10 lg:grid-cols-[1.3fr_1fr] lg:items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/85 backdrop-blur">
              <CalendarCheck className="h-3.5 w-3.5" />
              Agendá tu consulta
            </span>
            <h2 className="mt-5 [font-family:'Playfair_Display',serif] text-[clamp(30px,4vw,48px)] font-semibold leading-[1.08] tracking-tight">
              La sonrisa que soñás
              <br />
              está a un mensaje de distancia.
            </h2>
            <p className="mt-4 max-w-[52ch] text-[15.5px] leading-[1.65] text-white/80">
              Diagnóstico y presupuesto sin costo. Respondemos por WhatsApp en
              minutos y coordinamos tu primer turno.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={WHATSAPP}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-13 items-center gap-2 rounded-full bg-white px-6 py-3.5 text-[14px] font-semibold text-slate-900 shadow-[0_18px_44px_-18px_rgba(255,255,255,0.6)] transition hover:-translate-y-0.5"
              >
                <MessageCircle className="h-4 w-4 text-[#2E7BD6]" />
                Escribir por WhatsApp
              </a>
              <a
                href="tel:+595975484333"
                className="inline-flex h-13 items-center gap-2 rounded-full border border-white/30 bg-transparent px-6 py-3.5 text-[14px] font-semibold text-white transition hover:bg-white/10"
              >
                <Phone className="h-4 w-4" />
                +595 975 484 333
              </a>
            </div>
          </div>
          <div className="grid gap-3 rounded-2xl border border-white/15 bg-white/[0.06] p-6 backdrop-blur">
            <InfoRow
              icon={<Clock className="h-4 w-4" />}
              t="Horarios"
              d="Lun a Vie · 8 a 20 hs · Sáb 8 a 13 hs"
            />
            <InfoRow
              icon={<MapPin className="h-4 w-4" />}
              t="Dirección"
              d="Av. España 1234, Asunción · Paraguay"
            />
            <InfoRow
              icon={<Phone className="h-4 w-4" />}
              t="Teléfono"
              d="+595 975 484 333"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function InfoRow({
  icon,
  t,
  d,
}: {
  icon: React.ReactNode;
  t: string;
  d: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="grid h-9 w-9 flex-none place-items-center rounded-xl bg-white/10 text-[#7CD3C3]">
        {icon}
      </span>
      <div>
        <p className="text-[11.5px] font-semibold uppercase tracking-[0.14em] text-white/70">
          {t}
        </p>
        <p className="text-[14px] font-medium text-white">{d}</p>
      </div>
    </div>
  );
}

/* --------------------------------- footer -------------------------------- */

function DentalFooter() {
  return (
    <footer className="border-t border-slate-100 bg-white">
      <div className="mx-auto grid max-w-[1200px] gap-10 px-4 py-14 sm:px-8 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <Wordmark />
          <p className="mt-5 max-w-md text-[13.5px] leading-[1.65] text-slate-600">
            Clínica odontológica premium en Asunción, Paraguay. Diseñamos
            sonrisas con tecnología, ciencia y calidez humana.
          </p>
          <div className="mt-5 flex items-center gap-2">
            <SocialLink href="https://instagram.com" label="Instagram">
              <Instagram className="h-4 w-4" />
            </SocialLink>
            <SocialLink href="https://facebook.com" label="Facebook">
              <Facebook className="h-4 w-4" />
            </SocialLink>
            <SocialLink href={WHATSAPP} label="WhatsApp">
              <MessageCircle className="h-4 w-4" />
            </SocialLink>
          </div>
        </div>

        <FooterCol
          title="Clínica"
          items={[
            { l: "Nosotros", h: "#nosotros" },
            { l: "Servicios", h: "#servicios" },
            { l: "Galería", h: "#galeria" },
            { l: "Testimonios", h: "#testimonios" },
          ]}
        />
        <FooterCol
          title="Contacto"
          items={[
            { l: "+595 975 484 333", h: "tel:+595975484333" },
            { l: "hola@blancdental.com", h: "mailto:hola@blancdental.com" },
            { l: "Av. España 1234, Asunción", h: "#" },
          ]}
        />
        <div>
          <h5 className="text-[12px] font-bold uppercase tracking-[0.18em] text-slate-900">
            Horarios
          </h5>
          <ul className="mt-4 space-y-2 text-[13.5px] text-slate-600">
            <li>Lunes a Viernes · 8 a 20 hs</li>
            <li>Sábado · 8 a 13 hs</li>
            <li>Domingo · Cerrado</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-slate-100">
        <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-3 px-4 py-5 text-[11.5px] text-slate-500 sm:px-8">
          <span>
            © {new Date().getFullYear()} Blanc Dental Studio · Todos los derechos
            reservados
          </span>
          <span>Hecho con cuidado en Asunción, Paraguay</span>
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
  items: { l: string; h: string }[];
}) {
  return (
    <div>
      <h5 className="text-[12px] font-bold uppercase tracking-[0.18em] text-slate-900">
        {title}
      </h5>
      <ul className="mt-4 space-y-2 text-[13.5px]">
        {items.map((it) => (
          <li key={it.l}>
            <a
              href={it.h}
              className="text-slate-600 transition hover:text-[#2E7BD6]"
            >
              {it.l}
            </a>
          </li>
        ))}
      </ul>
    </div>
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
      className="grid h-10 w-10 place-items-center rounded-full border border-slate-200 text-slate-600 transition hover:border-[#2E7BD6] hover:bg-[#EAF4FE] hover:text-[#2E7BD6]"
    >
      {children}
    </a>
  );
}

/* ------------------------------- floating -------------------------------- */

function FloatingWhatsApp() {
  return (
    <a
      href={WHATSAPP}
      target="_blank"
      rel="noreferrer"
      aria-label="WhatsApp"
      className="fixed bottom-6 right-6 z-40 inline-flex h-14 w-14 items-center justify-center rounded-full text-white shadow-[0_18px_44px_-14px_rgba(37,211,102,0.7)] transition hover:-translate-y-0.5"
      style={{
        background: "linear-gradient(160deg, #2BE471, #19BD58)",
      }}
    >
      <MessageCircle className="h-6 w-6" />
      <span className="pointer-events-none absolute inset-0 -z-10 animate-ping rounded-full bg-[#19BD58]/60" />
    </a>
  );
}

/* -------------------------------- helpers -------------------------------- */

function SectionHead({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: React.ReactNode;
  subtitle: string;
}) {
  return (
    <div className="mx-auto max-w-[720px] text-center">
      <span className="inline-flex items-center gap-2 rounded-full border border-[#CFE4FB] bg-[#F5FAFF] px-3.5 py-1.5 text-[11.5px] font-semibold uppercase tracking-[0.16em] text-[#2E7BD6]">
        {eyebrow}
      </span>
      <h2 className="mt-5 [font-family:'Playfair_Display',serif] text-[clamp(30px,4vw,46px)] font-semibold leading-[1.08] tracking-tight text-slate-900">
        {title}
      </h2>
      <p className="mx-auto mt-4 max-w-[56ch] text-[15.5px] leading-[1.65] text-slate-600">
        {subtitle}
      </p>
    </div>
  );
}

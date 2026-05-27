import { createFileRoute } from "@tanstack/react-router";
import { MessageCircle, Mail, MapPin, Clock } from "lucide-react";
import { WHATSAPP_URL } from "@/lib/mock-data";

export const Route = createFileRoute("/contacto")({
  component: ContactPage,
  head: () => ({ meta: [{ title: "Contacto | L&A Multiventas" }] }),
});

function ContactPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 lg:px-8 lg:py-20">
      <div className="text-center">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-brand-royal">Hablemos</p>
        <h1 className="mt-2 font-display text-4xl font-bold text-brand-deep sm:text-5xl">Estamos para ayudarte</h1>
        <p className="mt-3 text-muted-foreground">Consultanos por WhatsApp y resolvemos al toque.</p>
      </div>

      <div className="mt-10 grid gap-5 md:grid-cols-2">
        <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="brand-ambient group relative overflow-hidden rounded-3xl p-8 text-white card-hover">
          <div className="pointer-events-none absolute inset-0 grid-pattern opacity-25" />
          <div className="pointer-events-none absolute -right-12 top-8 h-28 w-[22rem] rotate-6 bg-emerald-500/30 blur-3xl" />
          <div className="relative">
            <div className="grid h-14 w-14 place-items-center rounded-2xl bg-emerald-500 shadow-lg">
              <MessageCircle className="h-6 w-6" />
            </div>
            <h2 className="mt-5 font-display text-2xl font-bold">WhatsApp</h2>
            <p className="mt-1 text-white/70">Respuesta inmediata en horario de atención.</p>
            <span className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold text-brand-deep shadow-lg shadow-black/10">
              Escribinos ahora
            </span>
          </div>
        </a>

        <div className="premium-panel rounded-3xl p-8">
          <h2 className="font-display text-2xl font-bold text-brand-deep">Datos de contacto</h2>
          <ul className="mt-5 space-y-4 text-sm">
            <li className="flex items-start gap-3"><Mail className="h-5 w-5 text-brand-royal" /><div><div className="font-semibold text-brand-deep">Email</div><div className="text-muted-foreground">hola@laymultiventas.com</div></div></li>
            <li className="flex items-start gap-3"><MapPin className="h-5 w-5 text-brand-royal" /><div><div className="font-semibold text-brand-deep">Ubicación</div><div className="text-muted-foreground">Asunción, Paraguay</div></div></li>
            <li className="flex items-start gap-3"><Clock className="h-5 w-5 text-brand-royal" /><div><div className="font-semibold text-brand-deep">Horario</div><div className="text-muted-foreground">Lunes a Sábado · 9 a 19 hs</div></div></li>
          </ul>
        </div>
      </div>
    </div>
  );
}

const brands = ["Samsung", "Philips", "LG", "Sony", "Xiaomi", "Bosch", "Apple", "Lenovo"];

export function BrandsStrip() {
  return (
    <section className="relative max-w-full overflow-hidden border-y border-brand-royal/10 bg-gradient-to-b from-white via-brand-soft/40 to-white py-12 [contain:paint]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px gold-hairline opacity-70" />
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <p className="text-center text-xs font-bold uppercase tracking-[0.25em] text-brand-muted">
          Trabajamos con productos y marcas seleccionadas
        </p>
      </div>

      {/* Marquee strip */}
      <div className="relative mt-8 max-w-full overflow-hidden [contain:paint]">
        {/* Fade edges */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-white to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-white to-transparent" />

        <div className="flex w-max animate-marquee gap-16 px-6">
          {[...brands, ...brands].map((b, i) => (
            <div
              key={`${b}-${i}`}
              className="font-display text-2xl font-extrabold tracking-tight text-brand-muted/60 transition-colors hover:text-brand-royal"
            >
              {b}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

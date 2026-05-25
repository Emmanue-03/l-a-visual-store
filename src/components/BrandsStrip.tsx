const brands = ["Samsung", "Philips", "LG", "Sony", "Xiaomi", "Bosch"];

export function BrandsStrip() {
  return (
    <section className="border-y border-border bg-brand-soft/40">
      <div className="mx-auto max-w-7xl px-4 lg:px-8 py-10">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.25em] text-brand-muted">
          Trabajamos con productos y marcas seleccionadas
        </p>
        <div className="mt-6 grid grid-cols-3 gap-6 md:grid-cols-6 items-center">
          {brands.map((b) => (
            <div key={b} className="text-center font-display text-lg font-bold text-brand-muted/70 hover:text-brand-royal transition-colors">
              {b}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const BRANDS = [
  { name: "SAMSUNG", style: "font-extrabold" },
  { name: "philips", style: "italic font-semibold" },
  { name: "XIAOMI", style: "font-light tracking-[0.2em]" },
  { name: "motorola", style: "italic font-semibold" },
  { name: "JBL", style: "font-light tracking-[0.18em]" },
  { name: "SONY", style: "font-extrabold" },
  { name: "noblex", style: "italic font-semibold" },
  { name: "LG", style: "font-light tracking-[0.2em]" },
];

export function BrandsStrip() {
  return (
    <section className="border-y border-brand-soft bg-white">
      <div className="mx-auto flex max-w-[1240px] flex-wrap items-center justify-center gap-x-12 gap-y-6 px-4 py-8 sm:px-7">
        {BRANDS.map((b) => (
          <span
            key={b.name}
            className={`select-none font-display text-[clamp(20px,2.2vw,28px)] text-brand-muted/80 transition hover:text-brand-deep ${b.style}`}
          >
            {b.name}
          </span>
        ))}
      </div>
    </section>
  );
}

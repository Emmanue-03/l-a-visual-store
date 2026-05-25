import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { products, categories } from "@/lib/mock-data";
import { ProductCard } from "@/components/ProductCard";

export const Route = createFileRoute("/catalogo")({
  component: CatalogPage,
  head: () => ({
    meta: [
      { title: "Catálogo de productos | L&A Multiventas" },
      { name: "description", content: "Explorá nuestro catálogo completo: tecnología, hogar, accesorios, electrodomésticos y más." },
    ],
  }),
});

type Sort = "destacados" | "menor" | "mayor" | "nuevos" | "ofertas";

function CatalogPage() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string>("todas");
  const [sort, setSort] = useState<Sort>("destacados");
  const [maxPrice, setMaxPrice] = useState<number>(2000000);

  const filtered = useMemo(() => {
    let list = products.filter((p) => p.price <= maxPrice);
    if (cat !== "todas") list = list.filter((p) => p.category === cat);
    if (q) list = list.filter((p) => p.name.toLowerCase().includes(q.toLowerCase()));
    switch (sort) {
      case "menor": list = [...list].sort((a, b) => a.price - b.price); break;
      case "mayor": list = [...list].sort((a, b) => b.price - a.price); break;
      case "nuevos": list = list.filter((p) => p.badge === "Nuevo").concat(list.filter((p) => p.badge !== "Nuevo")); break;
      case "ofertas": list = list.filter((p) => p.oldPrice).concat(list.filter((p) => !p.oldPrice)); break;
    }
    return list;
  }, [q, cat, sort, maxPrice]);

  return (
    <div>
      {/* Header */}
      <div className="relative overflow-hidden bg-brand-radial text-white">
        <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full border border-white/10 dots-ring text-white/30 animate-spin-slow" />
        <div className="relative mx-auto max-w-7xl px-4 lg:px-8 py-14">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-blue-200">Catálogo</p>
          <h1 className="mt-2 font-display text-4xl font-bold sm:text-5xl">Catálogo de productos</h1>
          <p className="mt-2 max-w-xl text-white/70">Filtrá, ordená y encontrá lo que necesitás en segundos.</p>
          <div className="mt-6 flex items-center gap-2 rounded-full bg-white p-2 max-w-2xl shadow-xl">
            <Search className="ml-3 h-4 w-4 text-muted-foreground" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar productos..." className="flex-1 bg-transparent px-2 py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground" />
            <button className="rounded-full bg-brand-royal px-5 py-2 text-sm font-semibold text-white">Buscar</button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 lg:px-8 py-10 grid gap-8 lg:grid-cols-[260px_1fr]">
        {/* Sidebar filters */}
        <aside className="space-y-6">
          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center gap-2 mb-3">
              <SlidersHorizontal className="h-4 w-4 text-brand-royal" />
              <h3 className="font-display font-bold text-brand-deep">Filtros</h3>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Categoría</p>
              <div className="flex flex-wrap gap-2">
                <button onClick={() => setCat("todas")} className={`rounded-full px-3 py-1.5 text-xs font-semibold border ${cat === "todas" ? "bg-brand-royal text-white border-brand-royal" : "border-border hover:bg-brand-soft"}`}>
                  Todas
                </button>
                {categories.map((c) => (
                  <button key={c.slug} onClick={() => setCat(c.slug)} className={`rounded-full px-3 py-1.5 text-xs font-semibold border ${cat === c.slug ? "bg-brand-royal text-white border-brand-royal" : "border-border hover:bg-brand-soft"}`}>
                    {c.name}
                  </button>
                ))}
              </div>
            </div>
            <div className="mt-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Precio máximo</p>
              <input type="range" min={100000} max={2000000} step={50000} value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} className="w-full accent-brand-royal" />
              <div className="mt-1 text-xs text-brand-deep font-semibold">Hasta Gs. {maxPrice.toLocaleString("es-PY")}</div>
            </div>
          </div>
        </aside>

        <div>
          <div className="mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">{filtered.length} productos encontrados</p>
            <div className="flex items-center gap-2">
              <label className="text-xs text-muted-foreground">Ordenar:</label>
              <select value={sort} onChange={(e) => setSort(e.target.value as Sort)} className="rounded-full border border-border bg-white px-3 py-1.5 text-sm font-semibold text-brand-deep">
                <option value="destacados">Destacados</option>
                <option value="menor">Menor precio</option>
                <option value="mayor">Mayor precio</option>
                <option value="nuevos">Nuevos</option>
                <option value="ofertas">Ofertas</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
          {filtered.length === 0 && (
            <div className="rounded-2xl border border-dashed border-border p-12 text-center text-muted-foreground">
              No encontramos productos con esos filtros.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { AlertTriangle, Search, SlidersHorizontal } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { getCatalog } from "@/backend/catalog";

export const Route = createFileRoute("/catalogo")({
  validateSearch: (search: Record<string, unknown>) => ({
    categoria: typeof search.categoria === "string" ? search.categoria : undefined,
    tag: typeof search.tag === "string" ? search.tag : undefined,
    q: typeof search.q === "string" ? search.q : undefined,
  }),
  loader: () => getCatalog(),
  component: CatalogPage,
  head: () => ({
    meta: [
      { title: "Catálogo de productos | L&A Multiventas" },
      { name: "description", content: "Explorá nuestro catálogo completo: tecnología, hogar, accesorios, electrodomésticos y más." },
    ],
  }),
});

type Sort = "destacados" | "menor" | "mayor" | "nuevos" | "ofertas";

const normSlug = (value?: string | null) => (value ?? "").trim().toLowerCase();

const categoryFromSearch = (search: { categoria?: string; tag?: string }) => {
  if (search.categoria) return normSlug(search.categoria);
  if (search.tag === "ofertas") return "ofertas";
  if (search.tag === "nuevos") return "nuevos";
  return "todas";
};

function CatalogPage() {
  const search = Route.useSearch();
  const catalog = Route.useLoaderData();
  const { products, categories } = catalog;
  const usingMock = catalog.source === "mock";

  // Rango de precios derivado de los productos reales, redondeado al
  // siguiente multiplo de 50k para que el slider tenga pasos limpios.
  const priceBounds = useMemo(() => {
    if (!products.length) return { min: 0, max: 2_000_000 };
    const prices = products.map((p) => p.price);
    const max = Math.max(...prices);
    const min = Math.min(...prices);
    const ceil = (value: number) => Math.ceil(value / 50_000) * 50_000;
    return { min: Math.max(0, ceil(min) - 50_000), max: ceil(max) };
  }, [products]);

  const [q, setQ] = useState(search.q ?? "");
  const [cat, setCat] = useState<string>(() => categoryFromSearch(search));
  const [sort, setSort] = useState<Sort>("destacados");
  const [maxPrice, setMaxPrice] = useState<number>(priceBounds.max);

  useEffect(() => {
    setCat(categoryFromSearch(search));
    setQ(search.q ?? "");
  }, [search.categoria, search.tag, search.q]);

  // Si entran productos nuevos con precios mayores al tope anterior,
  // expandimos el slider para no excluirlos por defecto. Solo subimos
  // el tope; si el usuario lo bajo manualmente seguimos respetandolo.
  const previousMaxRef = useRef(priceBounds.max);
  useEffect(() => {
    if (priceBounds.max > previousMaxRef.current) {
      setMaxPrice(priceBounds.max);
    }
    previousMaxRef.current = priceBounds.max;
  }, [priceBounds.max]);

  // Indice slug → categoria (con id) para poder filtrar por UUID, que es
  // a prueba de mayusculas, espacios o slugs reescritos.
  const categoryBySlug = useMemo(() => {
    const map = new Map<string, { id?: string; slug: string }>();
    categories.forEach((c) => {
      map.set(normSlug(c.slug), { id: c.id, slug: c.slug });
    });
    return map;
  }, [categories]);

  // Conteo real de productos por categoria, usando id como clave primaria
  // y cayendo al slug normalizado. Se muestra en cada chip.
  const countsBySlug = useMemo(() => {
    const counts = new Map<string, number>();
    products.forEach((p) => {
      const slugKey = normSlug(p.category);
      let key = slugKey;
      if (p.categoryId) {
        for (const [s, c] of categoryBySlug) {
          if (c.id === p.categoryId) {
            key = s;
            break;
          }
        }
      }
      if (!key) return;
      counts.set(key, (counts.get(key) ?? 0) + 1);
    });
    return counts;
  }, [products, categoryBySlug]);

  const filtered = useMemo(() => {
    const catKey = normSlug(cat);
    let list = products.filter((p) => p.price <= maxPrice);
    if (catKey === "ofertas") list = list.filter((p) => p.oldPrice);
    else if (catKey === "nuevos") list = list.filter((p) => p.badge === "Nuevo");
    else if (catKey !== "todas") {
      const target = categoryBySlug.get(catKey);
      const targetId = target?.id;
      list = list.filter((p) => {
        if (targetId && p.categoryId) return p.categoryId === targetId;
        return normSlug(p.category) === catKey;
      });
    }
    if (q) list = list.filter((p) => p.name.toLowerCase().includes(q.toLowerCase()));
    switch (sort) {
      case "menor": list = [...list].sort((a, b) => a.price - b.price); break;
      case "mayor": list = [...list].sort((a, b) => b.price - a.price); break;
      case "nuevos": list = list.filter((p) => p.badge === "Nuevo").concat(list.filter((p) => p.badge !== "Nuevo")); break;
      case "ofertas": list = list.filter((p) => p.oldPrice).concat(list.filter((p) => !p.oldPrice)); break;
    }
    return list;
  }, [q, cat, sort, maxPrice, products, categoryBySlug]);

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

      {usingMock && (
        <div className="mx-auto max-w-7xl px-4 lg:px-8 mt-6">
          <div className="flex items-start gap-3 rounded-2xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
            <div>
              <p className="font-bold">Catalogo en modo demo (mock data).</p>
              <p className="mt-1 text-xs leading-relaxed">
                No se pudo leer desde Supabase, por eso veras los 12 productos hardcoded y no
                los del panel admin. Revisa SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY (o ANON_KEY)
                en el entorno del server y que el schema <code>lamultiventas</code> este
                publicado en PostgREST.
                {catalog.fallbackReason ? (
                  <>
                    {" "}
                    Detalle del error: <code>{catalog.fallbackReason}</code>.
                  </>
                ) : null}
              </p>
            </div>
          </div>
        </div>
      )}

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
                  Todas ({products.length})
                </button>
                {categories.map((c) => {
                  const slug = normSlug(c.slug);
                  const count = countsBySlug.get(slug) ?? 0;
                  return (
                    <button
                      key={slug}
                      onClick={() => setCat(slug)}
                      className={`rounded-full px-3 py-1.5 text-xs font-semibold border ${normSlug(cat) === slug ? "bg-brand-royal text-white border-brand-royal" : "border-border hover:bg-brand-soft"}`}
                    >
                      {c.name} ({count})
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="mt-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Precio máximo</p>
              <input
                type="range"
                min={priceBounds.min}
                max={priceBounds.max}
                step={50000}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-brand-royal"
              />
              <div className="mt-1 flex items-center justify-between text-xs">
                <span className="text-brand-deep font-semibold">
                  Hasta Gs. {maxPrice.toLocaleString("es-PY")}
                </span>
                {maxPrice < priceBounds.max && (
                  <button
                    type="button"
                    onClick={() => setMaxPrice(priceBounds.max)}
                    className="text-brand-royal hover:underline"
                  >
                    Limpiar
                  </button>
                )}
              </div>
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


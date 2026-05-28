import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
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

  const [q, setQ] = useState(search.q ?? "");
  const [cat, setCat] = useState<string>(() => categoryFromSearch(search));
  const [sort, setSort] = useState<Sort>("destacados");

  useEffect(() => {
    setCat(categoryFromSearch(search));
    setQ(search.q ?? "");
  }, [search.categoria, search.tag, search.q]);

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
    let list = products.slice();
    // "Ofertas" incluye productos con descuento real (oldPrice) Y los
    // marcados como Oferta desde el admin (badge). Antes solo miraba
    // oldPrice y los badges seteados a "Oferta" se perdían.
    if (catKey === "ofertas") list = list.filter((p) => p.oldPrice || p.badge === "Oferta");
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
      case "ofertas": {
        const isOffer = (p: typeof list[number]) => !!p.oldPrice || p.badge === "Oferta";
        list = list.filter(isOffer).concat(list.filter((p) => !isOffer(p)));
        break;
      }
    }
    return list;
  }, [q, cat, sort, products, categoryBySlug]);

  return (
    <div>
      {/* Header */}
      <div className="brand-ambient relative overflow-hidden text-white">
        <div className="pointer-events-none absolute inset-0 grid-pattern opacity-30" />
        <div className="pointer-events-none absolute -left-20 top-10 h-36 w-[36rem] -rotate-6 bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute right-[-10rem] bottom-0 h-40 w-[38rem] rotate-6 bg-brand-royal/40 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-4 lg:px-8 py-14">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-brand-gold">Catálogo</p>
          <h1 className="mt-2 font-display text-4xl font-extrabold sm:text-5xl">Catálogo de productos</h1>
          <p className="mt-2 max-w-xl text-white/70">Filtrá, ordená y encontrá lo que necesitás en segundos.</p>
          <div className="mt-6 flex max-w-2xl items-center gap-2 rounded-full border border-white/20 bg-white p-2 shadow-2xl shadow-black/15">
            <span className="ml-1 grid h-9 w-9 place-items-center rounded-full bg-brand-soft text-brand-royal">
              <Search className="h-4 w-4" />
            </span>
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar productos..." className="flex-1 bg-transparent px-2 py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground" />
            <button className="rounded-full bg-gradient-to-br from-brand-royal to-brand-deep px-5 py-2 text-sm font-bold text-white shadow-md shadow-brand-royal/20">Buscar</button>
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

      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 lg:grid-cols-[280px_1fr] lg:px-8">
        {/* Sidebar filters */}
        <aside className="space-y-6">
          <div className="premium-panel rounded-2xl p-5 lg:sticky lg:top-24">
            <div className="flex items-center gap-2 mb-3">
              <SlidersHorizontal className="h-4 w-4 text-brand-royal" />
              <h3 className="font-display font-bold text-brand-deep">Filtros</h3>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Categoría</p>
              <div className="flex flex-wrap gap-2">
                <button onClick={() => setCat("todas")} className={`rounded-full px-3 py-1.5 text-xs font-bold border transition ${cat === "todas" ? "bg-brand-royal text-white border-brand-royal shadow-md shadow-brand-royal/20" : "border-brand-royal/10 bg-white hover:bg-brand-soft hover:text-brand-royal"}`}>
                  Todas ({products.length})
                </button>
                {categories.map((c) => {
                  const slug = normSlug(c.slug);
                  const count = countsBySlug.get(slug) ?? 0;
                  return (
                    <button
                      key={slug}
                      onClick={() => setCat(slug)}
                      className={`rounded-full px-3 py-1.5 text-xs font-bold border transition ${normSlug(cat) === slug ? "bg-brand-royal text-white border-brand-royal shadow-md shadow-brand-royal/20" : "border-brand-royal/10 bg-white hover:bg-brand-soft hover:text-brand-royal"}`}
                    >
                      {c.name} ({count})
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </aside>

        <div>
          <div className="mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">{filtered.length} productos encontrados</p>
            <div className="flex items-center gap-2">
              <label className="text-xs text-muted-foreground">Ordenar:</label>
              <select value={sort} onChange={(e) => setSort(e.target.value as Sort)} className="rounded-full border border-brand-royal/10 bg-white px-3 py-1.5 text-sm font-semibold text-brand-deep shadow-sm outline-none focus:border-brand-royal/40">
                <option value="destacados">Destacados</option>
                <option value="menor">Menor precio</option>
                <option value="mayor">Mayor precio</option>
                <option value="nuevos">Nuevos</option>
                <option value="ofertas">Ofertas</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3">
            {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
          {filtered.length === 0 && (
            <div className="premium-panel rounded-2xl border-dashed p-12 text-center text-muted-foreground">
              No encontramos productos con esos filtros.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

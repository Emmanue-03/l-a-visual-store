import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, Search, Sparkles, X } from "lucide-react";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { categories as fallbackCategories, formatPrice, products as fallbackProducts } from "@/lib/mock-data";
import type { Category, Product } from "@/lib/catalog-types";

const normalize = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

const productRouteId = (product: Product) =>
  product.slug ??
  product.name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

type ProductSearchProps = {
  className?: string;
  compact?: boolean;
  categories?: Category[];
  products?: Product[];
  onPick?: () => void;
};

export function ProductSearch({
  className = "",
  compact = false,
  categories = fallbackCategories,
  products = fallbackProducts,
  onPick,
}: ProductSearchProps) {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const term = normalize(query.trim());
  const isOpen = focused && (query.trim().length > 0 || compact);
  const productCategories = useMemo(
    () => categories.filter((category) => !["ofertas", "nuevos"].includes(category.slug)),
    [categories],
  );

  const productMatches = useMemo(() => {
    if (!term) return products.slice(0, 4);

    return products
      .map((product) => {
        const category = categories.find((item) => item.slug === product.category);
        const haystack = normalize([
          product.name,
          product.description,
          product.badge ?? "",
          category?.name ?? "",
          ...product.features,
        ].join(" "));
        const name = normalize(product.name);
        const score =
          (name.startsWith(term) ? 40 : 0) +
          (name.includes(term) ? 25 : 0) +
          (haystack.includes(term) ? 10 : 0) +
          (product.badge === "Top venta" ? 4 : 0) +
          (product.oldPrice ? 3 : 0);

        return { product, score };
      })
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
      .map((item) => item.product);
  }, [term]);

  const categoryMatches = useMemo(() => {
    if (!term) return productCategories.slice(0, 3);

    return productCategories
      .filter((category) => normalize(category.name).includes(term))
      .slice(0, 3);
  }, [term]);

  const close = () => {
    setFocused(false);
    onPick?.();
  };

  const submitSearch = (event?: FormEvent) => {
    event?.preventDefault();
    const q = query.trim();

    if (!q) {
      navigate({ to: "/catalogo" });
    } else {
      navigate({ to: "/catalogo", search: { q } });
    }

    close();
  };

  useEffect(() => {
    const input = inputRef.current;
    if (!input) return;

    const sync = () => {
      setFocused(document.activeElement === input);
      setQuery(input.value);
    };
    const keydown = (event: KeyboardEvent) => {
      window.setTimeout(sync, 0);
      if (event.key !== "Enter") return;

      const value = input.value.trim();
      event.preventDefault();
      if (!value) {
        navigate({ to: "/catalogo" });
      } else {
        navigate({ to: "/catalogo", search: { q: value } });
      }
      close();
    };

    input.addEventListener("focus", sync);
    input.addEventListener("input", sync);
    input.addEventListener("keyup", sync);
    input.addEventListener("keydown", keydown);

    return () => {
      input.removeEventListener("focus", sync);
      input.removeEventListener("input", sync);
      input.removeEventListener("keyup", sync);
      input.removeEventListener("keydown", keydown);
    };
  }, [navigate]);

  return (
    <div className={`relative ${className}`}>
      <form
        onSubmit={submitSearch}
        className="flex items-center gap-2 rounded-full border border-brand-royal/10 bg-white/95 px-3 py-2 shadow-sm shadow-brand-night/5 transition focus-within:border-brand-royal/50 focus-within:bg-white focus-within:shadow-lg focus-within:shadow-brand-royal/10"
      >
        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-brand-soft text-brand-royal">
          <Search className="h-3.5 w-3.5" />
        </span>
        <input
          ref={inputRef}
          value={query}
          onChange={(event) => setQuery(event.currentTarget.value)}
          onInput={(event) => setQuery(event.currentTarget.value)}
          onKeyDown={(event) => {
            const input = event.currentTarget;
            window.setTimeout(() => {
              setFocused(true);
              setQuery(input.value);
            }, 0);

            if (event.key === "Enter") {
              const value = event.currentTarget.value.trim();
              event.preventDefault();
              if (!value) {
                navigate({ to: "/catalogo" });
              } else {
                navigate({ to: "/catalogo", search: { q: value } });
              }
              close();
            }
          }}
          onKeyUp={(event) => setQuery(event.currentTarget.value)}
          onFocus={(event) => {
            setFocused(true);
            setQuery(event.currentTarget.value);
          }}
          placeholder="Buscar productos..."
          className="w-full min-w-0 bg-transparent text-sm font-medium text-brand-deep outline-none placeholder:text-muted-foreground"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery("")}
            aria-label="Limpiar busqueda"
            className="grid h-6 w-6 shrink-0 place-items-center rounded-full text-muted-foreground transition hover:bg-brand-soft hover:text-brand-deep"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </form>

      {isOpen && (
        <div
          onMouseDown={(event) => event.preventDefault()}
          className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-2xl border border-brand-royal/10 bg-white/95 shadow-2xl shadow-brand-night/15 backdrop-blur"
        >
          <div className="max-h-[70vh] overflow-y-auto p-2">
            <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-[0.18em] text-brand-muted">
              {term ? "Resultados sugeridos" : "Mas buscados"}
            </div>

            {productMatches.length > 0 ? (
              <div className="grid gap-1">
                {productMatches.map((product) => (
                  <Link
                    key={product.id}
                    to="/producto/$id"
                    params={{ id: productRouteId(product) }}
                    onClick={close}
                    className="grid grid-cols-[44px_1fr_auto] items-center gap-3 rounded-xl p-2 text-left transition hover:bg-brand-soft hover:shadow-sm"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-11 w-11 rounded-xl object-cover ring-1 ring-brand-royal/10"
                    />
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-semibold text-brand-deep">
                        {product.name}
                      </span>
                      <span className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{formatPrice(product.price)}</span>
                        {product.badge && (
                          <span className="rounded-full bg-brand-soft px-2 py-0.5 text-[10px] font-semibold text-brand-royal">
                            {product.badge}
                          </span>
                        )}
                      </span>
                    </span>
                    <ArrowRight className="h-4 w-4 text-brand-royal/60" />
                  </Link>
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-brand-royal/20 bg-brand-soft/40 px-3 py-4 text-sm text-muted-foreground">
                No encontramos coincidencias. Probá con otra palabra.
              </div>
            )}

            {categoryMatches.length > 0 && (
              <div className="mt-2 border-t border-border pt-2">
                <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-[0.18em] text-brand-muted">
                  Categorias
                </div>
                <div className="flex flex-wrap gap-2 px-2 pb-2">
                  {categoryMatches.map((category) => (
                    <Link
                      key={category.slug}
                      to="/catalogo"
                      search={{ categoria: category.slug }}
                      onClick={close}
                      className="inline-flex items-center gap-1 rounded-full border border-brand-royal/10 bg-white px-3 py-1.5 text-xs font-semibold text-brand-deep transition hover:border-brand-royal/40 hover:bg-brand-soft hover:text-brand-royal"
                    >
                      <Sparkles className="h-3 w-3" />
                      {category.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={() => submitSearch()}
              className="mt-1 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-brand-royal to-brand-deep px-3 py-2.5 text-sm font-bold text-white shadow-md shadow-brand-royal/20 transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-brand-royal/25"
            >
              Ver todos los resultados
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

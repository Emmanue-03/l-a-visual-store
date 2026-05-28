import { useMemo, useState, type ReactNode } from "react";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

export type Column<T> = {
  key: string;
  header: string;
  className?: string;
  render: (row: T) => ReactNode;
  sortValue?: (row: T) => string | number;
  align?: "left" | "right" | "center";
};

type Props<T> = {
  data: T[];
  columns: Column<T>[];
  searchKeys?: (keyof T)[];
  searchPlaceholder?: string;
  pageSize?: number;
  emptyState?: ReactNode;
  rowKey: (row: T) => string;
  onRowClick?: (row: T) => void;
  toolbar?: ReactNode;
  /** Extra filtering applied before search/paginate */
  filter?: (row: T) => boolean;
};

export function DataTable<T>({
  data,
  columns,
  searchKeys,
  searchPlaceholder = "Buscar…",
  pageSize = 10,
  emptyState,
  rowKey,
  onRowClick,
  toolbar,
  filter,
}: Props<T>) {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    let rows = filter ? data.filter(filter) : data;
    if (query.trim() && searchKeys && searchKeys.length) {
      const q = query.trim().toLowerCase();
      rows = rows.filter((row) =>
        searchKeys.some((k) => String((row as Record<string, unknown>)[k as string] ?? "").toLowerCase().includes(q)),
      );
    }
    return rows;
  }, [data, filter, query, searchKeys]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const paged = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);

  return (
    <div className="rounded-2xl border border-mg-line bg-mg-ink/60 overflow-hidden">
      <div className="flex flex-col gap-3 border-b border-mg-line p-4 sm:flex-row sm:items-center sm:justify-between">
        {searchKeys && (
          <div className="relative w-full sm:max-w-xs">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-mg-muted" />
            <Input
              value={query}
              onChange={(e) => { setQuery(e.target.value); setPage(1); }}
              placeholder={searchPlaceholder}
              className="pl-9 bg-mg-night/70 border-mg-line text-mg-text placeholder:text-mg-muted focus-visible:ring-mg-magenta"
            />
          </div>
        )}
        {toolbar && <div className="flex flex-wrap items-center gap-2">{toolbar}</div>}
      </div>

      <div className="mg-scrollbar overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-mg-line bg-mg-night/50">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={cn(
                    "px-4 py-3 text-left text-[11px] font-bold uppercase tracking-[0.15em] text-mg-muted",
                    col.align === "right" && "text-right",
                    col.align === "center" && "text-center",
                    col.className,
                  )}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paged.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-12 text-center text-sm text-mg-muted">
                  {emptyState ?? "Sin resultados."}
                </td>
              </tr>
            ) : (
              paged.map((row) => (
                <tr
                  key={rowKey(row)}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                  className={cn(
                    "border-b border-mg-line/60 transition-colors",
                    onRowClick && "cursor-pointer hover:bg-mg-ink-soft/60",
                    !onRowClick && "hover:bg-mg-ink-soft/40",
                  )}
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={cn(
                        "px-4 py-3 text-mg-text/90",
                        col.align === "right" && "text-right",
                        col.align === "center" && "text-center",
                      )}
                    >
                      {col.render(row)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {filtered.length > pageSize && (
        <div className="flex items-center justify-between gap-3 border-t border-mg-line bg-mg-night/40 px-4 py-3 text-xs text-mg-muted">
          <span>
            Mostrando <strong className="text-mg-text">{(safePage - 1) * pageSize + 1}–{Math.min(safePage * pageSize, filtered.length)}</strong> de{" "}
            <strong className="text-mg-text">{filtered.length}</strong>
          </span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={safePage === 1}
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-mg-line bg-mg-ink/70 text-mg-text disabled:opacity-40 hover:border-mg-magenta/50"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="px-2 font-bold text-mg-text">
              {safePage} <span className="text-mg-muted font-normal">/ {totalPages}</span>
            </span>
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={safePage === totalPages}
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-mg-line bg-mg-ink/70 text-mg-text disabled:opacity-40 hover:border-mg-magenta/50"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

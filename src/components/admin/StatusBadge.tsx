import { cn } from "@/lib/utils";

export type OrderStatus =
  | "draft"
  | "pending"
  | "confirmed"
  | "paid"
  | "preparing"
  | "shipped"
  | "delivered"
  | "cancelled";

const styles: Record<OrderStatus, { label: string; dot: string; bg: string; text: string }> = {
  draft:      { label: "Borrador",   dot: "bg-slate-400",    bg: "bg-slate-500/10  border-slate-400/30",      text: "text-slate-600 dark:text-slate-300" },
  pending:    { label: "Pendiente",  dot: "bg-amber-400",    bg: "bg-amber-500/10  border-amber-400/30",      text: "text-amber-600 dark:text-amber-300" },
  confirmed:  { label: "Confirmado", dot: "bg-sky-400",      bg: "bg-sky-500/10    border-sky-400/30",        text: "text-sky-600 dark:text-sky-300" },
  paid:       { label: "Pagado",     dot: "bg-emerald-400",  bg: "bg-emerald-500/10 border-emerald-400/30",   text: "text-emerald-600 dark:text-emerald-300" },
  preparing:  { label: "Preparando", dot: "bg-sky-400",      bg: "bg-sky-500/10    border-sky-400/30",        text: "text-sky-600 dark:text-sky-300" },
  shipped:    { label: "Enviado",    dot: "bg-violet-400",   bg: "bg-violet-500/10 border-violet-400/30",     text: "text-violet-600 dark:text-violet-300" },
  delivered:  { label: "Entregado",  dot: "bg-[color:var(--mg-gold)]", bg: "bg-[color:var(--mg-gold)]/15 border-[color:var(--mg-gold)]/40", text: "text-[color:var(--mg-gold-deep)]" },
  cancelled:  { label: "Cancelado",  dot: "bg-rose-400",     bg: "bg-rose-500/10   border-rose-400/30",       text: "text-rose-600 dark:text-rose-300" },
};

export function StatusBadge({ status, size = "sm" }: { status: OrderStatus | string; size?: "xs" | "sm" | "md" }) {
  const s = styles[status as OrderStatus] ?? styles.pending;
  const sizing = size === "xs" ? "px-2 py-0.5 text-[10px]" : size === "md" ? "px-3 py-1 text-sm" : "px-2.5 py-0.5 text-xs";
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full border font-semibold", sizing, s.bg, s.text)}>
      <span className={cn("h-1.5 w-1.5 rounded-full", s.dot)} />
      {s.label}
    </span>
  );
}

export function TierBadge({ tier }: { tier: "bronze" | "silver" | "gold" | "platinum" }) {
  const map = {
    bronze:   { label: "Bronze",   cls: "bg-amber-700/15  text-amber-200  border-amber-700/40" },
    silver:   { label: "Silver",   cls: "bg-slate-400/15  text-slate-200  border-slate-400/40" },
    gold:     { label: "Gold",     cls: "bg-mg-gold/15    text-mg-gold-soft border-mg-gold/40" },
    platinum: { label: "Platinum", cls: "bg-mg-magenta/15 text-mg-pink   border-mg-magenta/40" },
  } as const;
  const s = map[tier];
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider", s.cls)}>
      {s.label}
    </span>
  );
}

export function RoleBadge({ role }: { role: "owner" | "admin" | "editor" | "viewer" }) {
  const map = {
    owner:  { label: "Owner",  cls: "bg-mg-magenta/15 text-mg-pink   border-mg-magenta/40" },
    admin:  { label: "Admin",  cls: "bg-mg-gold/15    text-mg-gold-soft border-mg-gold/40" },
    editor: { label: "Editor", cls: "bg-sky-500/15    text-sky-300   border-sky-400/35" },
    viewer: { label: "Viewer", cls: "bg-slate-500/15  text-slate-300 border-slate-400/35" },
  } as const;
  const s = map[role];
  return (
    <span className={cn("inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider", s.cls)}>
      {s.label}
    </span>
  );
}

import type { LucideIcon } from "lucide-react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  label: string;
  value: string;
  delta?: { value: number; positive?: boolean; label?: string };
  icon: LucideIcon;
  accent?: "magenta" | "gold" | "rose" | "violet";
  sparkline?: number[];
};

const accentClasses = {
  magenta: { bg: "bg-mg-magenta-gradient", text: "text-mg-magenta-soft", glow: "shadow-mg-glow" },
  gold: { bg: "bg-mg-gold-gradient", text: "text-mg-gold-soft", glow: "shadow-mg-gold" },
  rose: {
    bg: "bg-[linear-gradient(135deg,oklch(0.78_0.18_350),oklch(0.58_0.20_340))]",
    text: "text-mg-pink",
    glow: "shadow-mg-glow",
  },
  violet: {
    bg: "bg-[linear-gradient(135deg,oklch(0.55_0.20_310),oklch(0.32_0.22_310))]",
    text: "text-[oklch(0.78_0.18_310)]",
    glow: "shadow-mg-glow",
  },
} as const;

export function StatCard({ label, value, delta, icon: Icon, accent = "magenta", sparkline }: Props) {
  const a = accentClasses[accent];
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-mg-line bg-mg-ink/70 p-5 mg-card-hover">
      <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full opacity-30 blur-2xl group-hover:opacity-50 transition-opacity"
        style={{ backgroundImage: "linear-gradient(135deg, var(--mg-magenta), var(--mg-magenta-deep))" }} />
      <div className="relative flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-mg-muted">{label}</p>
          <p className="mt-2 font-display text-3xl font-bold text-mg-text tracking-tight">{value}</p>
          {delta && (
            <div className={cn(
              "mt-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold",
              delta.positive ?? delta.value >= 0
                ? "bg-emerald-500/15 text-emerald-300"
                : "bg-rose-500/15 text-rose-300",
            )}>
              {(delta.positive ?? delta.value >= 0) ? (
                <ArrowUpRight className="h-3.5 w-3.5" />
              ) : (
                <ArrowDownRight className="h-3.5 w-3.5" />
              )}
              {Math.abs(delta.value)}% {delta.label ?? "vs mes anterior"}
            </div>
          )}
        </div>
        <div className={cn(
          "flex h-11 w-11 items-center justify-center rounded-xl text-white shrink-0",
          a.bg, a.glow,
        )}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      {sparkline && sparkline.length > 1 && (
        <Sparkline data={sparkline} className={a.text} />
      )}
    </div>
  );
}

function Sparkline({ data, className }: { data: number[]; className?: string }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * 100;
    const y = 100 - ((v - min) / range) * 100;
    return `${x},${y}`;
  }).join(" ");
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className={cn("mt-3 h-10 w-full", className)}>
      <polyline points={points} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

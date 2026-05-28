import { cn } from "@/lib/utils";
import logoSrc from "@/assets/la-logo.jpg";

type Props = {
  size?: "sm" | "md" | "lg" | "xl";
  showTagline?: boolean;
  variant?: "auto" | "onLight" | "onDark";
  className?: string;
};

const sizes = {
  sm: { img: "h-8 w-8", text: "text-sm", tagline: "text-[8px] tracking-[0.32em]" },
  md: { img: "h-10 w-10", text: "text-base", tagline: "text-[9px] tracking-[0.34em]" },
  lg: { img: "h-12 w-12", text: "text-lg", tagline: "text-[10px] tracking-[0.36em]" },
  xl: { img: "h-16 w-16", text: "text-2xl", tagline: "text-xs tracking-[0.4em]" },
} as const;

export function LALogo({ size = "md", showTagline = true, variant = "auto", className }: Props) {
  const s = sizes[size];
  const onDark = variant === "onDark";
  return (
    <div className={cn("inline-flex items-center gap-3 leading-none", className)}>
      <img
        src={logoSrc}
        alt="L&A Multiventas"
        className={cn(s.img, "rounded-full object-cover ring-1", onDark ? "ring-white/30" : "ring-[color:var(--la-line,#E2E8F0)]")}
      />
      <div className="flex flex-col">
        <span
          className={cn(
            "font-display font-extrabold tracking-tight",
            s.text,
            onDark ? "text-white" : "text-[color:var(--la-text,#0F172A)]",
          )}
        >
          L&amp;A <span className={cn(onDark ? "text-[color:var(--mg-gold-soft)]" : "text-[color:var(--mg-gold)]")}>Multiventas</span>
        </span>
        {showTagline && (
          <span
            className={cn(
              "mt-0.5 font-display font-semibold uppercase",
              s.tagline,
              onDark ? "text-white/70" : "text-[color:var(--la-muted,#64748B)]",
            )}
          >
            Panel administrador
          </span>
        )}
      </div>
    </div>
  );
}

import { cn } from "@/lib/utils";

type Props = {
  size?: "sm" | "md" | "lg" | "xl";
  showTagline?: boolean;
  className?: string;
};

const sizes = {
  sm: { mark: "text-xl", tagline: "text-[8px] tracking-[0.4em]" },
  md: { mark: "text-2xl", tagline: "text-[9px] tracking-[0.4em]" },
  lg: { mark: "text-4xl", tagline: "text-[10px] tracking-[0.45em]" },
  xl: { mark: "text-6xl", tagline: "text-xs tracking-[0.5em]" },
} as const;

export function MGLogo({ size = "md", showTagline = true, className }: Props) {
  const s = sizes[size];
  return (
    <div className={cn("inline-flex flex-col items-center leading-none", className)}>
      <div className="relative inline-flex items-baseline">
        <span
          className={cn(
            "font-serif font-bold text-mg-magenta-gradient",
            s.mark,
          )}
          style={{ fontVariantLigatures: "common-ligatures" }}
        >
          M
        </span>
        <span
          className={cn("font-serif font-bold mx-1 text-mg-gold-gradient", s.mark)}
        >
          &amp;
        </span>
        <span
          className={cn(
            "font-serif font-bold text-mg-magenta-gradient",
            s.mark,
          )}
        >
          G
        </span>
      </div>
      {showTagline && (
        <>
          <div className="mt-1 h-px w-full bg-gradient-to-r from-transparent via-mg-gold to-transparent opacity-70" />
          <span className={cn("mt-1 font-display font-semibold uppercase text-mg-gold-soft", s.tagline)}>
            Perfumería
          </span>
        </>
      )}
    </div>
  );
}

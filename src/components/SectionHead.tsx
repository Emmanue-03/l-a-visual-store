import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";

type SectionHeadProps = {
  kicker: string;
  title: ReactNode;
  description?: string;
  ctaLabel?: string;
  ctaTo?: string;
  ctaSearch?: Record<string, string>;
};

export function SectionHead({
  kicker,
  title,
  description,
  ctaLabel,
  ctaTo,
  ctaSearch,
}: SectionHeadProps) {
  return (
    <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-end">
      <div className="max-w-2xl">
        <div className="inline-flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.18em] text-brand-deep">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-brand-gold shadow-[0_0_10px_var(--brand-gold)]" />
          {kicker}
        </div>
        <h2 className="mt-3 font-display text-[clamp(26px,3.4vw,40px)] font-extrabold leading-[1.08] tracking-[-0.025em] text-brand-deep">
          {title}
        </h2>
        {description && (
          <p className="mt-3 max-w-xl text-[15px] leading-[1.6] text-brand-muted">
            {description}
          </p>
        )}
      </div>
      {ctaLabel && ctaTo && (
        <Link
          to={ctaTo}
          search={ctaSearch as any}
          className="group inline-flex items-center gap-2 rounded-full border border-brand-soft bg-white px-5 py-2.5 text-[13.5px] font-bold text-brand-deep transition hover:-translate-y-0.5 hover:border-brand-royal hover:text-brand-royal hover:shadow-card"
        >
          {ctaLabel}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      )}
    </div>
  );
}

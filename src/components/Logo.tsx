import logoSrc from "@/assets/la-logo.jpg";

export function Logo({ className = "h-10 w-10" }: { className?: string }) {
  return (
    <img
      src={logoSrc}
      alt="L&A Multiventas"
      loading="eager"
      decoding="async"
      className={`${className} rounded-full object-cover ring-2 ring-white/40`}
    />
  );
}

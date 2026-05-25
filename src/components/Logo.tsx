import logo from "@/assets/logo.jpg";

export function Logo({ className = "h-10 w-10" }: { className?: string }) {
  return (
    <img
      src={logo}
      alt="L&A Multiventas"
      className={`${className} rounded-full object-cover ring-2 ring-white/40`}
    />
  );
}

const LOGO_URL =
  "https://res.cloudinary.com/dqhnjdrl8/image/upload/v1779795370/WhatsApp_Image_2026-05-25_at_17.03.30_i3u8mz.jpg";

export function Logo({ className = "h-10 w-10" }: { className?: string }) {
  return (
    <img
      src={LOGO_URL}
      alt="L&A Multiventas"
      loading="eager"
      decoding="async"
      className={`${className} rounded-full object-cover ring-2 ring-white/40`}
    />
  );
}

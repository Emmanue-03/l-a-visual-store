import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";

import appCss from "../styles.css?url";
import { CartProvider } from "@/lib/cart-context";
import { Navbar } from "@/components/Navbar";
import { Topbar } from "@/components/Topbar";
import { Footer } from "@/components/Footer";
import { CartDrawer } from "@/components/CartDrawer";
import { WhatsAppFab } from "@/components/WhatsAppFab";
import { Toaster } from "@/components/ui/sonner";
import { useCatalog } from "@/lib/catalog-client";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-7xl font-bold text-brand-deep">404</h1>
        <h2 className="mt-4 text-xl font-semibold">Página no encontrada</h2>
        <p className="mt-2 text-sm text-muted-foreground">La página que buscás no existe o fue movida.</p>
        <Link to="/" className="mt-6 inline-flex items-center justify-center rounded-full bg-brand-royal px-5 py-2.5 text-sm font-semibold text-white btn-glow">
          Ir al inicio
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  const detail = error?.message || String(error);
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <div className="w-full max-w-xl text-center">
        <h1 className="text-xl font-semibold">Esta página no cargó</h1>
        <p className="mt-2 text-sm text-muted-foreground">Algo salió mal. Probá refrescar o volvé al inicio.</p>
        <pre className="mt-5 max-h-64 overflow-auto rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-left text-xs text-destructive whitespace-pre-wrap break-words">
          {detail}
        </pre>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button onClick={() => { router.invalidate(); reset(); }} className="rounded-full bg-brand-royal px-4 py-2 text-sm font-medium text-white">Reintentar</button>
          <a href="/" className="rounded-full border border-input bg-background px-4 py-2 text-sm font-medium">Ir al inicio</a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "L&A Multiventas | Tu multitienda online de confianza" },
      { name: "description", content: "Comprá fácil, rápido y seguro en L&A Multiventas. Tecnología, hogar, accesorios, electrodomésticos, ofertas y mucho más." },
      { property: "og:title", content: "L&A Multiventas | Tu multitienda online" },
      { property: "og:description", content: "Tecnología, hogar, accesorios y mucho más. Atención por WhatsApp." },
      { property: "og:type", content: "website" },
      {
        property: "og:image",
        content:
          "https://res.cloudinary.com/dqhnjdrl8/image/upload/v1779795525/WhatsApp_Image_2026-05-25_at_17.03.30_1_th8cc3.jpg",
      },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      // Favicon (icono de pestaña). Servido desde Cloudinary igual que el logo.
      {
        rel: "icon",
        type: "image/jpeg",
        href: "https://res.cloudinary.com/dqhnjdrl8/image/upload/c_thumb,w_64,h_64,g_auto/v1779795525/WhatsApp_Image_2026-05-25_at_17.03.30_1_th8cc3.jpg",
      },
      {
        rel: "apple-touch-icon",
        href: "https://res.cloudinary.com/dqhnjdrl8/image/upload/c_thumb,w_180,h_180,g_auto/v1779795525/WhatsApp_Image_2026-05-25_at_17.03.30_1_th8cc3.jpg",
      },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Sora:wght@500;600;700;800&family=Inter:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,500&display=swap" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head><HeadContent /></head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <RootLayout />
    </QueryClientProvider>
  );
}

// Layout dentro del QueryClientProvider para poder usar useCatalog (React Query).
// El catalogo se lee en el cliente; mientras carga usamos fallbacks seguros.
function RootLayout() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const isAdminRoute = pathname.startsWith("/admin");
  const { data: catalog } = useCatalog();

  if (isAdminRoute) {
    return (
      <>
        <Outlet />
        <Toaster position="bottom-right" />
      </>
    );
  }

  const whatsappPhone = catalog?.settings.whatsappPhone ?? "595975484333";
  const categories = catalog?.categories ?? [];
  const products = catalog?.products ?? [];

  return (
    <CartProvider>
      <div className="flex min-h-screen flex-col bg-[var(--paper,#FBFAF7)]">
        <Topbar whatsappPhone={whatsappPhone} />
        <Navbar categories={categories} products={products} whatsappPhone={whatsappPhone} />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
        <CartDrawer whatsappPhone={whatsappPhone} />
        <WhatsAppFab whatsappPhone={whatsappPhone} />
        <Toaster position="bottom-right" />
      </div>
    </CartProvider>
  );
}


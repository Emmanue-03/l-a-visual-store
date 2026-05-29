// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, cloudflare (build-only),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... } }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

const lifecycle = process.env.npm_lifecycle_event;

// Build que empaqueta el SERVIDOR SSR en un solo archivo (Vercel / Node Passenger
// via scripts/node-server.mjs). Mantiene SSR; inlinea dependencias.
const isBundledServerBuild =
  process.env.VERCEL === "1" ||
  process.env.VERCEL_BUILD === "1" ||
  process.env.NODE_DEPLOY === "1" ||
  lifecycle === "vercel-build" ||
  lifecycle === "build:node";

// Build ESTATICO SPA — es lo que corre Hostinger con `npm run build`.
// Genera dist/client con un index.html y NO necesita servidor en runtime.
// Los datos se leen desde el navegador (ver src/lib/catalog-client.ts).
const isStaticSpaBuild = lifecycle === "build";

// El plugin de Cloudflare del wrapper de lovable simula el worker SSR en `vite dev`.
// En cualquier build de produccion lo apagamos (no hay SSR worker que simular).
const disableCloudflare = isBundledServerBuild || isStaticSpaBuild;

export default defineConfig({
  cloudflare: disableCloudflare ? false : undefined,
  tanstackStart: {
    server: { entry: "server" },
    // Modo SPA estatico: prerenderea solo el shell a index.html y la app corre
    // 100% en el cliente. Activado solo en el build estatico para no alterar
    // el `vite dev` (que sigue en SSR con el worker simulado).
    ...(isStaticSpaBuild ? { spa: { enabled: true } } : {}),
  },
  vite: isBundledServerBuild
    ? {
        ssr: {
          noExternal: true,
        },
        build: {
          rollupOptions: {
            output: {
              inlineDynamicImports: true,
            },
          },
        },
      }
    : undefined,
});

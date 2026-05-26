// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, cloudflare (build-only),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... } }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

// El plugin @cloudflare/vite-plugin del wrapper de lovable es necesario para
// que `vite dev` levante el SSR worker simulado. Si lo deshabilitamos siempre,
// `npm run dev` rompe el panel admin con «This page didn't load».
//
// Vercel setea VERCEL=1 durante su build. Tambien detectamos cuando alguien
// corre `npm run vercel-build` localmente (npm setea npm_lifecycle_event).
// En cualquier otro caso (dev, npm run build) dejamos CF activo.
const isVercelBuild =
  process.env.VERCEL === "1" ||
  process.env.VERCEL_BUILD === "1" ||
  process.env.npm_lifecycle_event === "vercel-build";

export default defineConfig({
  cloudflare: isVercelBuild ? false : undefined,
  tanstackStart: {
    server: { entry: "server" },
  },
  vite: isVercelBuild
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

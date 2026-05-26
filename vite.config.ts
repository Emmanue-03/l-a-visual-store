// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, cloudflare (build-only),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... } }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

// Deploy target: Vercel (Build Output API).
// - cloudflare:false → deshabilita @cloudflare/vite-plugin para que no genere
//   worker-entry.js. El SSR build sale como ESM generico.
// - ssr.noExternal:true → inlinea TODAS las dependencias (react, tanstack,
//   h3, seroval, etc.) en el bundle, asi la funcion serverless no necesita
//   node_modules para arrancar.
// - inlineDynamicImports:true → un solo dist/server/server.js sin chunks.
//   Elimina paths relativos que pueden romperse en runtime.
export default defineConfig({
  cloudflare: false,
  tanstackStart: {
    server: { entry: "server" },
  },
  vite: {
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
  },
});

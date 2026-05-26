// Postbuild para Vercel: convierte el output de `vite build` en la estructura
// que Vercel espera segun el Build Output API.
//
// Genera:
//   .vercel/output/
//   ├── config.json                             routing + version
//   ├── static/                                 assets servidos directo (mirror de dist/client)
//   └── functions/index.func/
//       ├── .vc-config.json                     runtime nodejs + handler
//       ├── index.mjs                           handler que envuelve dist/server/server.js
//       └── server-bundle/                      copia de dist/server (referenciada por el handler)
//
// Vercel encuentra .vercel/output/ y deploya directo, sin pasar por su
// auto-detector. Esto evita el rewrite/api-folder y nos da control total.

import { promises as fs } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, "..");
const distDir = join(projectRoot, "dist");
const outDir = join(projectRoot, ".vercel", "output");
const staticDir = join(outDir, "static");
const fnDir = join(outDir, "functions", "index.func");

async function exists(path) {
  try {
    await fs.access(path);
    return true;
  } catch {
    return false;
  }
}

async function rmrf(path) {
  await fs.rm(path, { recursive: true, force: true });
}

async function copyDir(src, dest) {
  await fs.mkdir(dest, { recursive: true });
  const entries = await fs.readdir(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = join(src, entry.name);
    const destPath = join(dest, entry.name);
    if (entry.isDirectory()) {
      await copyDir(srcPath, destPath);
    } else if (entry.isFile()) {
      await fs.copyFile(srcPath, destPath);
    }
  }
}

const distClient = join(distDir, "client");
const distServer = join(distDir, "server");

if (!(await exists(distClient)) || !(await exists(distServer))) {
  console.error(
    "[vercel-pack] Falta dist/client o dist/server. Corre `npm run build` antes.",
  );
  process.exit(1);
}

// Limpiamos cualquier salida anterior para evitar artefactos viejos.
await rmrf(outDir);
await fs.mkdir(outDir, { recursive: true });

// 1) Static assets
await copyDir(distClient, staticDir);

// 2) Function dir + server bundle adentro
await fs.mkdir(fnDir, { recursive: true });
await copyDir(distServer, join(fnDir, "server-bundle"));

// 3) Handler wrapper: re-exporta el fetch del bundle como handler default.
const handler = `// Auto-generado por scripts/vercel-pack.mjs.
// Vercel invoca este modulo como funcion serverless. Adentro vive el bundle
// SSR generado por TanStack Start; lo cargamos una sola vez y reusamos.

import server from "./server-bundle/server.js";

let cached;
function getServer() {
  if (cached) return cached;
  cached = server?.default ?? server;
  return cached;
}

export default async function handler(request) {
  try {
    const s = getServer();
    if (typeof s?.fetch !== "function") {
      return new Response(
        "Bundle SSR invalido: no expone fetch.",
        { status: 500, headers: { "content-type": "text/plain; charset=utf-8" } }
      );
    }
    return await s.fetch(request, {}, {});
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    const stack = error instanceof Error ? error.stack ?? "" : "";
    console.error("[vercel handler] SSR error:", error);
    const body = \`<!doctype html><meta charset="utf-8"><title>500</title>
<style>body{font:14px/1.5 system-ui;padding:2rem;color:#111}pre{background:#fff;border:1px solid #ddd;padding:1rem;border-radius:6px;overflow:auto}h1{color:#b91c1c}</style>
<h1>500 - SSR fallo</h1><pre>\${msg.replace(/</g, "&lt;")}</pre>
\${stack ? \`<details><summary>stack</summary><pre>\${stack.replace(/</g, "&lt;")}</pre></details>\` : ""}\`;
    return new Response(body, {
      status: 500,
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  }
}
`;
await fs.writeFile(join(fnDir, "index.mjs"), handler, "utf8");

// 4) Function config (runtime + handler entry)
const fnConfig = {
  runtime: "nodejs20.x",
  handler: "index.mjs",
  launcherType: "Nodejs",
  shouldAddHelpers: false,
  supportsResponseStreaming: true,
};
await fs.writeFile(join(fnDir, ".vc-config.json"), JSON.stringify(fnConfig, null, 2), "utf8");

// 5) Routing: assets desde static primero; todo lo demas a la funcion.
const config = {
  version: 3,
  routes: [
    { handle: "filesystem" },
    { src: "/.*", dest: "/index" },
  ],
};
await fs.writeFile(join(outDir, "config.json"), JSON.stringify(config, null, 2), "utf8");

console.log("[vercel-pack] Listo. .vercel/output/ generado.");

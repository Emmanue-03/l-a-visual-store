// Postbuild para Vercel: convierte el output de `vite build` en la estructura
// que Vercel espera segun el Build Output API.
//
// Genera:
//   .vercel/output/
//   ├── config.json                             routing + version
//   ├── static/                                 assets servidos directo (mirror de dist/client)
//   └── functions/index.func/
//       ├── .vc-config.json                     runtime nodejs + handler
//       ├── package.json                        type:module para que Node trate .js como ESM
//       ├── index.mjs                           handler que envuelve dist/server/server.js
//       └── server-bundle/                      copia de dist/server (referenciada por el handler)
//           └── package.json                    type:module tambien aca por si Node usa el nearest

import { promises as fs } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, "..");
const distDir = join(projectRoot, "dist");
const outDir = join(projectRoot, ".vercel", "output");
const staticDir = join(outDir, "static");
const fnDir = join(outDir, "functions", "index.func");
const bundleDir = join(fnDir, "server-bundle");

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

await rmrf(outDir);
await fs.mkdir(outDir, { recursive: true });

// 1) Static assets
await copyDir(distClient, staticDir);

// 2) Server bundle adentro de la funcion
await fs.mkdir(fnDir, { recursive: true });
await copyDir(distServer, bundleDir);

// 3) package.json type:module en TODOS los niveles donde Node pueda buscar.
// Vite emite el bundle como ESM con extension .js; sin un package.json con
// type:module cerca, Node lo trata como CJS y falla al parsear "export".
const esmPkg = JSON.stringify({ type: "module" }, null, 2);
await fs.writeFile(join(fnDir, "package.json"), esmPkg, "utf8");
await fs.writeFile(join(bundleDir, "package.json"), esmPkg, "utf8");

// 4) Handler wrapper
const handler = `// Auto-generado por scripts/vercel-pack.mjs.
import server from "./server-bundle/server.js";

function getServer() {
  return server?.default ?? server;
}

function plainErrorResponse(message, stack) {
  const safe = (value) => String(value ?? "").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const body = '<!doctype html><meta charset="utf-8"><title>500</title>'
    + '<style>body{font:14px/1.5 system-ui;padding:2rem;color:#111}'
    + 'pre{background:#fff;border:1px solid #ddd;padding:1rem;border-radius:6px;overflow:auto;white-space:pre-wrap;word-break:break-word}'
    + 'h1{color:#b91c1c}</style>'
    + '<h1>500 - SSR fallo</h1><pre>' + safe(message) + '</pre>'
    + (stack ? '<details><summary>stack</summary><pre>' + safe(stack) + '</pre></details>' : '');
  return new Response(body, {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

export default async function handler(request) {
  const url = new URL(request.url);

  // Health check para verificar que la funcion arranca.
  if (url.pathname === "/_health") {
    return new Response(JSON.stringify({
      ok: true,
      url: request.url,
      method: request.method,
      hasSupabaseUrl: Boolean(process.env.SUPABASE_URL),
      hasServiceRole: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
      hasSessionSecret: Boolean(process.env.ADMIN_SESSION_SECRET),
      hasViteSupabaseUrl: Boolean(process.env.VITE_SUPABASE_URL),
      nodeVersion: process.version,
    }, null, 2), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  }

  try {
    const s = getServer();
    if (typeof s?.fetch !== "function") {
      return plainErrorResponse("Bundle SSR invalido: no expone fetch.");
    }
    // 9s timeout (< Vercel default 10s) para no quedar colgados sin respuesta.
    const ssr = s.fetch(request, {}, {});
    const timeout = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("SSR handler timeout (9s)")), 9000),
    );
    return await Promise.race([ssr, timeout]);
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    const stack = error instanceof Error ? error.stack ?? "" : "";
    console.error("[vercel handler] SSR error:", error);
    return plainErrorResponse(msg, stack);
  }
}
`;
await fs.writeFile(join(fnDir, "index.mjs"), handler, "utf8");

// 5) Function config
const fnConfig = {
  runtime: "nodejs20.x",
  handler: "index.mjs",
  launcherType: "Nodejs",
  shouldAddHelpers: false,
  supportsResponseStreaming: true,
};
await fs.writeFile(join(fnDir, ".vc-config.json"), JSON.stringify(fnConfig, null, 2), "utf8");

// 6) Routing
const config = {
  version: 3,
  routes: [
    { handle: "filesystem" },
    { src: "/.*", dest: "/index" },
  ],
};
await fs.writeFile(join(outDir, "config.json"), JSON.stringify(config, null, 2), "utf8");

console.log("[vercel-pack] Listo. .vercel/output/ generado.");

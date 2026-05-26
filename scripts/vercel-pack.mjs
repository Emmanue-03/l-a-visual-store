// Postbuild para Vercel Build Output API.
// Convierte dist/ en .vercel/output/ con estructura que Vercel deploya nativo.

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
  for (const entry of await fs.readdir(src, { withFileTypes: true })) {
    const s = join(src, entry.name);
    const d = join(dest, entry.name);
    if (entry.isDirectory()) await copyDir(s, d);
    else if (entry.isFile()) await fs.copyFile(s, d);
  }
}

const distClient = join(distDir, "client");
const distServer = join(distDir, "server");

if (!(await exists(distClient)) || !(await exists(distServer))) {
  console.error("[vercel-pack] Falta dist/. Corre `npm run build` antes.");
  process.exit(1);
}

await rmrf(outDir);
await fs.mkdir(outDir, { recursive: true });

// 1) Static assets
await copyDir(distClient, staticDir);

// 2) Server bundle. Con inlineDynamicImports = true, vite ya genera un solo
// archivo dist/server/server.js. Lo copiamos como .mjs para que Node lo trate
// SIEMPRE como ESM (la extension manda mas que cualquier package.json).
await fs.mkdir(fnDir, { recursive: true });
const serverJs = join(distServer, "server.js");
if (!(await exists(serverJs))) {
  console.error("[vercel-pack] No se encontro dist/server/server.js");
  process.exit(1);
}
await fs.copyFile(serverJs, join(fnDir, "server-bundle.mjs"));

// Doble seguro: package.json con type:module en la funcion.
await fs.writeFile(
  join(fnDir, "package.json"),
  JSON.stringify({ type: "module" }, null, 2),
  "utf8",
);

// 3) Handler. .mjs garantiza ESM.
const handler = `import server from "./server-bundle.mjs";

const ssr = server?.default ?? server;

function errorHtml(msg, stack) {
  const safe = (v) => String(v ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  return '<!doctype html><meta charset="utf-8"><title>500</title>'
    + '<style>body{font:14px/1.5 system-ui;padding:2rem;color:#111;max-width:60rem;margin:auto}'
    + 'pre{background:#fff;border:1px solid #ddd;padding:1rem;border-radius:6px;white-space:pre-wrap;word-break:break-word}'
    + 'h1{color:#b91c1c}</style>'
    + '<h1>500 - SSR error</h1><pre>' + safe(msg) + '</pre>'
    + (stack ? '<details open><summary>stack</summary><pre>' + safe(stack) + '</pre></details>' : '');
}

export default async function handler(request) {
  const url = new URL(request.url);

  // Diagnostico: confirma que la funcion arranca.
  if (url.pathname === "/_health") {
    return new Response(JSON.stringify({
      ok: true,
      pathname: url.pathname,
      hasSupabaseUrl: Boolean(process.env.SUPABASE_URL),
      hasServiceRole: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
      hasSessionSecret: Boolean(process.env.ADMIN_SESSION_SECRET),
      nodeVersion: process.version,
      ssrLoaded: typeof ssr?.fetch === "function",
    }, null, 2), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  }

  if (typeof ssr?.fetch !== "function") {
    return new Response(errorHtml("Bundle SSR no expone fetch."), {
      status: 500, headers: { "content-type": "text/html; charset=utf-8" },
    });
  }

  try {
    const ssrPromise = ssr.fetch(request, {}, {});
    const timeout = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("SSR timeout (9s)")), 9000),
    );
    return await Promise.race([ssrPromise, timeout]);
  } catch (error) {
    console.error("[handler] error:", error);
    const msg = error instanceof Error ? error.message : String(error);
    const stack = error instanceof Error ? error.stack ?? "" : "";
    return new Response(errorHtml(msg, stack), {
      status: 500,
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  }
}
`;
await fs.writeFile(join(fnDir, "index.mjs"), handler, "utf8");

// 4) Function config
await fs.writeFile(
  join(fnDir, ".vc-config.json"),
  JSON.stringify(
    {
      runtime: "nodejs20.x",
      handler: "index.mjs",
      launcherType: "Nodejs",
      shouldAddHelpers: false,
      supportsResponseStreaming: true,
    },
    null,
    2,
  ),
  "utf8",
);

// 5) Routing: assets primero, todo lo demas al handler.
await fs.writeFile(
  join(outDir, "config.json"),
  JSON.stringify(
    {
      version: 3,
      routes: [{ handle: "filesystem" }, { src: "/.*", dest: "/index" }],
    },
    null,
    2,
  ),
  "utf8",
);

console.log("[vercel-pack] Listo. .vercel/output/ generado.");

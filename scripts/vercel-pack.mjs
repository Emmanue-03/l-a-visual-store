// Postbuild para Vercel Build Output API.
//
// Esta version usa un wrapper Node-style (req, res) que es el patron CANONICO
// de Vercel Functions. La firma Web API (Request → Response) ha causado
// FUNCTION_INVOCATION_FAILED sin logs en intentos anteriores. Node-style
// con conversion explicita es lo que Vercel documenta.
//
// Encima, el wrapper tiene try/catch en TODOS los niveles (top-level await,
// invocacion del handler, conversion de response). Si el bundle SSR tira un
// error, lo VEMOS en pantalla en vez de un 500 mudo.

import { promises as fs } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, "..");
const distClient = join(projectRoot, "dist", "client");
const distServer = join(projectRoot, "dist", "server");
const outDir = join(projectRoot, ".vercel", "output");
const staticDir = join(outDir, "static");
const fnDir = join(outDir, "functions", "index.func");

async function exists(p) {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

async function copyDir(src, dest) {
  await fs.mkdir(dest, { recursive: true });
  for (const e of await fs.readdir(src, { withFileTypes: true })) {
    const s = join(src, e.name);
    const d = join(dest, e.name);
    if (e.isDirectory()) await copyDir(s, d);
    else if (e.isFile()) await fs.copyFile(s, d);
  }
}

if (!(await exists(distClient)) || !(await exists(distServer))) {
  console.error("[vercel-pack] Falta dist/. Corre `npm run build` antes.");
  process.exit(1);
}

await fs.rm(outDir, { recursive: true, force: true });

// 1) Static assets
await copyDir(distClient, staticDir);

// 2) Server bundle dentro de la funcion como .mjs (fuerza ESM)
await fs.mkdir(fnDir, { recursive: true });
const serverJs = join(distServer, "server.js");
if (!(await exists(serverJs))) {
  console.error("[vercel-pack] No se encontro dist/server/server.js");
  process.exit(1);
}
await fs.copyFile(serverJs, join(fnDir, "ssr.mjs"));

// 3) package.json con type:module en el dir de la funcion (doble seguro).
await fs.writeFile(
  join(fnDir, "package.json"),
  JSON.stringify({ type: "module" }, null, 2),
  "utf8",
);

// 4) Handler en estilo Node CLASICO (req, res) — patron canonico de Vercel.
// Convierte el req de Node a Web Request, llama al SSR, convierte Response
// de vuelta a la API de Node. Si cualquier paso tira, responde con el error
// EN HTML para diagnosticar.
const handler = `import { Readable } from "node:stream";

// Carga del bundle SSR con error capture en top-level. Si esto tira,
// la funcion no crashea: el handler reporta el error.
let server = null;
let loadError = null;
try {
  const mod = await import("./ssr.mjs");
  server = mod?.default ?? mod;
} catch (error) {
  loadError = error;
  console.error("[vercel handler] no pudo cargar ssr.mjs:", error);
}

function escape(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function errorHtml(title, msg, stack) {
  return '<!doctype html><meta charset="utf-8"><title>' + escape(title) + '</title>'
    + '<style>body{font:14px/1.5 system-ui;padding:2rem;color:#111;max-width:64rem;margin:auto}'
    + 'pre{background:#fff;border:1px solid #ddd;padding:1rem;border-radius:6px;white-space:pre-wrap;word-break:break-word;overflow:auto}'
    + 'h1{color:#b91c1c}details{margin-top:1rem}</style>'
    + '<h1>' + escape(title) + '</h1>'
    + '<pre>' + escape(msg) + '</pre>'
    + (stack ? '<details open><summary>stack</summary><pre>' + escape(stack) + '</pre></details>' : '');
}

function buildWebRequest(req) {
  const proto = req.headers["x-forwarded-proto"] || "https";
  const host = req.headers["x-forwarded-host"] || req.headers.host || "localhost";
  const url = proto + "://" + host + req.url;

  const headers = new Headers();
  for (const [k, v] of Object.entries(req.headers)) {
    if (v == null) continue;
    if (Array.isArray(v)) v.forEach((vv) => headers.append(k, vv));
    else headers.set(k, String(v));
  }

  const init = { method: req.method || "GET", headers };
  if (req.method && !/^(GET|HEAD)$/i.test(req.method)) {
    init.body = Readable.toWeb(req);
    init.duplex = "half";
  }
  return new Request(url, init);
}

async function writeWebResponse(response, res) {
  res.statusCode = response.status || 200;
  response.headers.forEach((value, key) => {
    if (key.toLowerCase() === "content-encoding") return; // Vercel comprime solo
    try {
      res.setHeader(key, value);
    } catch {
      /* header invalido, ignorar */
    }
  });

  if (!response.body) {
    res.end();
    return;
  }

  const reader = response.body.getReader();
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    if (value) res.write(Buffer.isBuffer(value) ? value : Buffer.from(value));
  }
  res.end();
}

export default async function handler(req, res) {
  // Health check sintetico
  if (req.url === "/_health" || req.url?.startsWith("/_health?")) {
    const payload = {
      ok: true,
      loadError: loadError ? loadError.message : null,
      ssrLoaded: typeof server?.fetch === "function",
      hasSupabaseUrl: Boolean(process.env.SUPABASE_URL),
      hasServiceRole: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
      hasSessionSecret: Boolean(process.env.ADMIN_SESSION_SECRET),
      nodeVersion: process.version,
    };
    res.statusCode = 200;
    res.setHeader("content-type", "application/json");
    res.end(JSON.stringify(payload, null, 2));
    return;
  }

  // Si el bundle no cargo, lo reportamos en lugar de crashear.
  if (loadError) {
    res.statusCode = 500;
    res.setHeader("content-type", "text/html; charset=utf-8");
    res.end(errorHtml("Bundle SSR no se pudo cargar", loadError.message, loadError.stack));
    return;
  }

  if (typeof server?.fetch !== "function") {
    res.statusCode = 500;
    res.setHeader("content-type", "text/html; charset=utf-8");
    res.end(errorHtml("Bundle SSR sin .fetch", "El modulo cargado pero no expone fetch()", null));
    return;
  }

  try {
    const webRequest = buildWebRequest(req);
    const webResponse = await server.fetch(webRequest, {}, {});
    await writeWebResponse(webResponse, res);
  } catch (error) {
    console.error("[vercel handler] runtime error:", error);
    res.statusCode = 500;
    res.setHeader("content-type", "text/html; charset=utf-8");
    res.end(
      errorHtml(
        "SSR handler tiro en runtime",
        error?.message ?? String(error),
        error?.stack ?? "",
      ),
    );
  }
}
`;
await fs.writeFile(join(fnDir, "index.mjs"), handler, "utf8");

// 5) .vc-config.json — runtime Node 20.x, handler Node-style
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

// 6) Routing: filesystem (assets) → fallback al handler
await fs.writeFile(
  join(outDir, "config.json"),
  JSON.stringify(
    {
      version: 3,
      routes: [
        { handle: "filesystem" },
        { src: "/.*", dest: "/index" },
      ],
    },
    null,
    2,
  ),
  "utf8",
);

console.log("[vercel-pack] Listo. .vercel/output/ generado.");

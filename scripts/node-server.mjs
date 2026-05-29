// Servidor Node autonomo para hosting tipo Hostinger (Setup Node.js App /
// Passenger) y cualquier VPS. NO usa Cloudflare ni Vercel.
//
// Tu SSR (dist/server/server.js) expone un handler estilo Web: fetch(Request).
// Hostinger en cambio necesita un proceso Node que ESCUCHE en un puerto. Este
// archivo es el puente: levanta un http.Server, sirve los assets estaticos de
// dist/client y, para todo lo demas, convierte la request de Node a Web
// Request, llama al SSR y vuelca la Response de vuelta a Node.
//
// La logica de conversion req<->Request es la misma que scripts/vercel-pack.mjs
// ya usa en produccion, asi que es codigo probado.
//
// Arranque:  node scripts/node-server.mjs   (o `npm start`)
// Puerto:    process.env.PORT (Hostinger/Passenger lo inyecta) o 3000.

import { createServer } from "node:http";
import { Readable } from "node:stream";
import { promises as fs, createReadStream } from "node:fs";
import { dirname, join, resolve, normalize, extname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, "..");
const distClient = join(projectRoot, "dist", "client");
const distServer = join(projectRoot, "dist", "server", "server.js");

const PORT = Number(process.env.PORT) || 3000;
const HOST = process.env.HOST || "0.0.0.0";

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".txt": "text/plain; charset=utf-8",
  ".map": "application/json; charset=utf-8",
  ".webmanifest": "application/manifest+json",
};

// --- Carga del bundle SSR (una sola vez) -----------------------------------
let server = null;
let loadError = null;
try {
  const mod = await import(`file://${distServer}`);
  server = mod?.default ?? mod;
} catch (error) {
  loadError = error;
  console.error("[node-server] no pudo cargar el bundle SSR:", error);
}

// --- Servir archivos estaticos de dist/client ------------------------------
// Devuelve true si sirvio un archivo; false si no existe (cae al SSR).
async function tryServeStatic(req, res) {
  if (req.method !== "GET" && req.method !== "HEAD") return false;

  const urlPath = decodeURIComponent((req.url || "/").split("?")[0]);
  if (urlPath === "/" || urlPath.endsWith("/")) return false; // SSR maneja paginas

  // Anti path-traversal: normalizamos y verificamos que siga dentro de distClient.
  const filePath = normalize(join(distClient, urlPath));
  if (!filePath.startsWith(distClient)) {
    res.statusCode = 403;
    res.end("Forbidden");
    return true;
  }

  let stat;
  try {
    stat = await fs.stat(filePath);
  } catch {
    return false; // no existe → que lo maneje el SSR
  }
  if (!stat.isFile()) return false;

  const type = MIME[extname(filePath).toLowerCase()] || "application/octet-stream";
  res.statusCode = 200;
  res.setHeader("content-type", type);
  res.setHeader("content-length", stat.size);
  // Los assets con hash en el nombre (build de Vite) son inmutables.
  if (urlPath.startsWith("/assets/")) {
    res.setHeader("cache-control", "public, max-age=31536000, immutable");
  }
  if (req.method === "HEAD") {
    res.end();
    return true;
  }
  await new Promise((resolveStream, rejectStream) => {
    const stream = createReadStream(filePath);
    stream.on("error", rejectStream);
    stream.on("end", resolveStream);
    stream.pipe(res);
  });
  return true;
}

// --- Conversion Node req → Web Request -------------------------------------
function buildWebRequest(req) {
  const proto = req.headers["x-forwarded-proto"] || "http";
  const host = req.headers["x-forwarded-host"] || req.headers.host || `localhost:${PORT}`;
  const url = `${proto}://${host}${req.url}`;

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

// --- Volcado Web Response → Node res ---------------------------------------
async function writeWebResponse(response, res) {
  res.statusCode = response.status || 200;
  response.headers.forEach((value, key) => {
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
  for (;;) {
    const { value, done } = await reader.read();
    if (done) break;
    if (value) res.write(Buffer.isBuffer(value) ? value : Buffer.from(value));
  }
  res.end();
}

// --- Handler principal -----------------------------------------------------
const httpServer = createServer(async (req, res) => {
  try {
    if (await tryServeStatic(req, res)) return;

    if (loadError || typeof server?.fetch !== "function") {
      res.statusCode = 500;
      res.setHeader("content-type", "text/html; charset=utf-8");
      res.end(
        `<!doctype html><meta charset="utf-8"><title>Error</title>` +
          `<h1>El bundle SSR no se pudo cargar</h1><pre>${
            (loadError && (loadError.stack || loadError.message)) || "server.fetch no existe"
          }</pre>`,
      );
      return;
    }

    const webRequest = buildWebRequest(req);
    const webResponse = await server.fetch(webRequest, process.env, {});
    await writeWebResponse(webResponse, res);
  } catch (error) {
    console.error("[node-server] error en runtime:", error);
    if (!res.headersSent) {
      res.statusCode = 500;
      res.setHeader("content-type", "text/html; charset=utf-8");
    }
    res.end("Internal Server Error");
  }
});

httpServer.listen(PORT, HOST, () => {
  console.log(`[node-server] escuchando en http://${HOST}:${PORT}`);
});

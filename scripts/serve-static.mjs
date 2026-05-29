// Server estatico mínimo para PROBAR el build SPA igual que lo serviria
// Hostinger: sirve dist/client y hace fallback a index.html para deep links.
// Uso: node scripts/serve-static.mjs   (PORT opcional, default 4173)
import { createServer } from "node:http";
import { createReadStream, promises as fs } from "node:fs";
import { join, normalize, extname, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..", "dist", "client");
const PORT = Number(process.env.PORT) || 4173;
const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
};

createServer(async (req, res) => {
  const urlPath = decodeURIComponent((req.url || "/").split("?")[0]);
  let filePath = normalize(join(root, urlPath));
  if (!filePath.startsWith(root)) {
    res.statusCode = 403;
    return res.end("forbidden");
  }
  let stat;
  try {
    stat = await fs.stat(filePath);
  } catch {
    /* no existe */
  }
  if (!stat || !stat.isFile()) {
    filePath = join(root, "index.html"); // SPA fallback
  }
  res.setHeader("content-type", MIME[extname(filePath).toLowerCase()] || "application/octet-stream");
  createReadStream(filePath).pipe(res);
}).listen(PORT, () => console.log(`[serve-static] dist/client en http://localhost:${PORT}`));

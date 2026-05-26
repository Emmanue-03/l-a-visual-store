// Postbuild para Vercel: deploy estatico SPA puro.
//
// El intento de Function/SSR fallaba consistentemente con FUNCTION_INVOCATION_FAILED
// sin runtime logs que permitan diagnosticar. Esta version evita Functions por completo:
// genera un dist/client/index.html que carga el bundle del cliente y deja que TanStack
// Router maneje todo el routing del lado cliente. La pagina vuelve a estar online.
//
// Trade-off: los server fns (admin login, mutaciones admin) ya no funcionan porque
// no hay servidor. La home y el catalogo publico SI funcionan via los loaders
// del catalogo (que tienen fallback a mock data si Supabase no responde).

import { promises as fs } from "node:fs";
import { join, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, "..");
const distClient = join(projectRoot, "dist", "client");
const assetsDir = join(distClient, "assets");

async function exists(p) {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

if (!(await exists(assetsDir))) {
  console.error("[vercel-pack] Falta dist/client/assets. Corre `npm run build` antes.");
  process.exit(1);
}

// Encontramos el bundle entry y el css principal.
const files = await fs.readdir(assetsDir);
const entryJs = files.find((f) => /^index-.*\.js$/.test(f));
const entryCss = files.find((f) => /^styles-.*\.css$/.test(f));

if (!entryJs) {
  console.error("[vercel-pack] No se encontro assets/index-*.js");
  process.exit(1);
}

// HTML minimo que monta TanStack Router en el cliente.
const html = `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>L&amp;A Multiventas | Tu multitienda online de confianza</title>
<meta name="description" content="Comprá fácil, rápido y seguro en L&A Multiventas." />
<link rel="icon" type="image/jpeg" href="https://res.cloudinary.com/dqhnjdrl8/image/upload/c_thumb,w_64,h_64,g_auto/v1779795525/WhatsApp_Image_2026-05-25_at_17.03.30_1_th8cc3.jpg" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Sora:wght@500;600;700;800&family=Inter:wght@400;500;600;700&display=swap" />
${entryCss ? `<link rel="stylesheet" href="/assets/${entryCss}" />` : ""}
</head>
<body>
<div id="root"></div>
<script type="module" src="/assets/${entryJs}"></script>
</body>
</html>
`;

await fs.writeFile(join(distClient, "index.html"), html, "utf8");
console.log(`[vercel-pack] dist/client/index.html generado con entry=${entryJs}${entryCss ? ", css=" + entryCss : ""}.`);

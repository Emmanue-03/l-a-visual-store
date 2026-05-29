// Post-build de la SPA estatica.
//
// TanStack Start (modo spa) escribe el shell en dist/client/_shell.html y los
// assets en dist/client/. Pero el "Directorio de salida" de Hostinger apunta a
// `dist` (la raiz). Para que funcione SIN depender de ese setting, dejamos el
// index.html y los assets directamente en dist/ (raiz):
//
//   1. _shell.html  ->  dist/client/index.html   (entrada SPA)
//   2. aplanar dist/client/*  ->  dist/           (asi `dist` ya es la raiz web)
//   3. borrar dist/server     (bundle de prerender; no se sirve en estatico)
//
// Resultado: sirve igual con "Directorio de salida" = `dist` o `dist/client`.

import { promises as fs } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const distDir = join(root, "dist");
const clientDir = join(distDir, "client");
const shell = join(clientDir, "_shell.html");
const indexInClient = join(clientDir, "index.html");

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
  for (const entry of await fs.readdir(src, { withFileTypes: true })) {
    const s = join(src, entry.name);
    const d = join(dest, entry.name);
    if (entry.isDirectory()) await copyDir(s, d);
    else if (entry.isFile()) await fs.copyFile(s, d);
  }
}

if (!(await exists(shell))) {
  console.error(
    "[spa-postbuild] No se encontro dist/client/_shell.html. ¿Esta activo spa:{enabled:true} en vite.config?",
  );
  process.exit(1);
}

// 1) Shell -> index.html (entrada SPA y fallback para deep links).
await fs.copyFile(shell, indexInClient);

// 2) Aplanar: copiar el contenido de dist/client a la raiz dist/.
await copyDir(clientDir, distDir);

// 3) Borrar el bundle SSR del prerender (no se sirve en un host estatico).
await fs.rm(join(distDir, "server"), { recursive: true, force: true });

console.log(
  "[spa-postbuild] dist/ listo como raiz estatica (index.html + assets en dist/ y dist/client) ✅",
);

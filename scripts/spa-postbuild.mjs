// Post-build de la SPA estatica.
//
// TanStack Start (modo spa) escribe el shell en dist/client/_shell.html.
// Los hosts estaticos (Hostinger) sirven `index.html` como entrada, asi que
// copiamos el shell a index.html. El mismo index.html sirve de fallback para
// el ruteo del lado cliente (deep links como /catalogo, /producto/...).

import { promises as fs } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const clientDir = join(root, "dist", "client");
const shell = join(clientDir, "_shell.html");
const index = join(clientDir, "index.html");

async function exists(p) {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

if (!(await exists(shell))) {
  console.error(
    "[spa-postbuild] No se encontro dist/client/_shell.html. ¿Esta activo spa:{enabled:true} en vite.config?",
  );
  process.exit(1);
}

await fs.copyFile(shell, index);
console.log("[spa-postbuild] dist/client/index.html generado desde _shell.html ✅");

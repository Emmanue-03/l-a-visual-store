// Archivo de arranque (startup file) para Passenger / Hostinger Node.js.
//
// Passenger (el motor que usa Hostinger para apps Node) a veces NO puede
// cargar directamente un entry ESM (.mjs). Este shim esta en CommonJS (.cjs),
// que Passenger siempre sabe arrancar, y desde aca cargamos el servidor real
// (scripts/node-server.mjs) con import() dinamico — que SI funciona en CJS.
//
// En hPanel -> Node.js, configura este archivo como "Application startup file":
//   app.cjs
//
// Logs: cualquier error de arranque sale por stderr (lo ves en los registros
// de la app en hPanel).

console.log("[app.cjs] iniciando bootstrap del servidor Node...");

import("./scripts/node-server.mjs").catch((error) => {
  console.error("[app.cjs] FALLO al cargar scripts/node-server.mjs:");
  console.error(error && (error.stack || error.message || error));
  // Salir con codigo != 0 para que Passenger marque el arranque como fallido
  // y el error quede visible en los registros, en vez de un timeout mudo.
  process.exit(1);
});

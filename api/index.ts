// Vercel Edge Function entry. Vercel bundlea este archivo como una funcion
// edge y aplica los rewrites de vercel.json: todo lo que no matchea un asset
// estatico cae aca y delega al SSR handler generado por TanStack Start.
//
// IMPORTANTE: Este import apunta al output del build (dist/server/server.js),
// que se genera ANTES de que Vercel construya las funciones (buildCommand en
// vercel.json corre `vite build` primero).
//
// El handler default es el objeto { fetch } estilo Worker que escribe
// src/server.ts. Lo desempaquetamos para Vercel Edge, que espera una funcion
// directa Request -> Response.

// @ts-expect-error — el archivo se genera durante el build, no existe hasta
// que `npm run build` termina. TypeScript no lo puede resolver en static
// analysis pero en runtime sobre Vercel ya esta presente.
import server from "../dist/server/server.js";

export const config = {
  runtime: "edge",
};

type WorkerLikeServer = {
  fetch(request: Request, env: unknown, ctx: unknown): Promise<Response> | Response;
};

export default async function handler(request: Request): Promise<Response> {
  // env y ctx no se usan en CF Worker land; pasamos objetos vacios.
  return (server as WorkerLikeServer).fetch(request, {}, {});
}

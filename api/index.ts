// Vercel Serverless Function (Node runtime). Edge runtime no funciona aqui
// porque el bundle SSR importa @tanstack/router-core/ssr/server y modulos
// equivalentes que dependen de APIs de Node.
//
// Vercel bundlea este archivo como funcion serverless y aplica los rewrites
// de vercel.json: todo lo que no matchea un asset estatico cae aca y delega
// al SSR handler generado por TanStack Start.
//
// El import apunta al output de `npm run build` (dist/server/server.js), que
// Vercel ya genero antes de bundlear esta funcion (ver buildCommand en
// vercel.json).

// @ts-expect-error — el archivo se genera durante el build; TypeScript no
// puede resolverlo en static analysis pero en runtime ya esta presente.
import server from "../dist/server/server.js";

export const config = {
  runtime: "nodejs20.x",
};

type WorkerLikeServer = {
  fetch(request: Request, env: unknown, ctx: unknown): Promise<Response> | Response;
};

export default async function handler(request: Request): Promise<Response> {
  return (server as WorkerLikeServer).fetch(request, {}, {});
}

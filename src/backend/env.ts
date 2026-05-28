// Lectura de variables de entorno isomorfica entre los 3 runtimes del proyecto:
//
//   1. Node directo (scripts/bootstrap-admin.mjs, scripts/admin-tool.mjs):
//      process.env esta poblado desde el .env via dotenv-like loader.
//
//   2. Vercel serverless (npm run vercel-build → .vercel/output):
//      process.env esta poblado por Vercel a partir de Project Settings →
//      Environment Variables. El handler de api/index.mjs recibe Web Request.
//
//   3. Cloudflare Worker simulado (vite dev con @cloudflare/vite-plugin):
//      .dev.vars NO entra a process.env. Los valores llegan al fetch handler
//      como segundo argumento `env`. Si solo leyeramos process.env, el SSR
//      no veria ADMIN_SESSION_SECRET ni los secrets de Supabase.
//
// Estrategia: AsyncLocalStorage acumula el env del worker durante cada
// request. getServerEnv() prueba ese store primero y cae a process.env si
// no encuentra. src/server.ts envuelve cada request en withRequestEnv para
// que la cadena ALS este disponible para todo el SSR del lado servidor.

import { AsyncLocalStorage } from "node:async_hooks";

type EnvRecord = Record<string, string | undefined>;

const requestEnvStorage = new AsyncLocalStorage<EnvRecord>();

export function getServerEnv(name: string): string | undefined {
  const stored = requestEnvStorage.getStore();
  if (stored && stored[name] != null) return stored[name];

  const globalRecord = globalThis as unknown as { process?: { env?: EnvRecord } };
  return globalRecord.process?.env?.[name];
}

export function requiredServerEnv(name: string): string {
  const value = getServerEnv(name);
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

/**
 * Envuelve la ejecucion de `fn` con el env del worker disponible para
 * getServerEnv. Usado por src/server.ts en su fetch handler para que las
 * server fns puedan leer secrets de bindings/`.dev.vars` igual que si
 * fueran process.env.
 */
export function withRequestEnv<T>(env: unknown, fn: () => T | Promise<T>): T | Promise<T> {
  if (!env || typeof env !== "object") return fn();
  const record: EnvRecord = {};
  for (const [key, value] of Object.entries(env)) {
    if (typeof value === "string") record[key] = value;
  }
  return requestEnvStorage.run(record, fn);
}

/**
 * Diagnostico seguro: devuelve si la var existe y su longitud, NO el valor.
 * Usado por logs temporales de runtime. No commitear con esto activado en
 * paths calientes; usar solo durante debug.
 */
export function describeEnv(name: string): { exists: boolean; length: number; source: "request" | "process" | "missing" } {
  const stored = requestEnvStorage.getStore();
  if (stored && stored[name] != null) {
    return { exists: true, length: stored[name]!.length, source: "request" };
  }
  const globalRecord = globalThis as unknown as { process?: { env?: EnvRecord } };
  const fromProcess = globalRecord.process?.env?.[name];
  if (fromProcess != null) {
    return { exists: true, length: fromProcess.length, source: "process" };
  }
  return { exists: false, length: 0, source: "missing" };
}

/**
 * Helper dedicado para el secret de la cookie admin. Acepta un runtimeEnv
 * opcional para que el handler que TIENE el env del worker en la mano lo
 * pueda pasar explicitamente, sin depender de AsyncLocalStorage.
 *
 * Cadena de fuentes:
 *   1. runtimeEnv pasado explicitamente (lo que llega al fetch handler como
 *      segundo arg en CF Workers / dev simulator).
 *   2. AsyncLocalStorage poblado por withRequestEnv (cuando el call site no
 *      tiene env directo, p.ej. una server fn).
 *   3. process.env (Node / Vercel serverless).
 *
 * Lanza ADMIN_SESSION_SECRET_MISSING si no existe o es muy corto.
 */
export function getAdminSessionSecret(runtimeEnv?: Record<string, string | undefined>): string {
  const fromArg = runtimeEnv?.ADMIN_SESSION_SECRET;
  const fromStore = requestEnvStorage.getStore()?.ADMIN_SESSION_SECRET;
  const globalRecord = globalThis as unknown as { process?: { env?: EnvRecord } };
  const fromProcess = globalRecord.process?.env?.ADMIN_SESSION_SECRET;

  const secret = fromArg ?? fromStore ?? fromProcess;

  if (!secret || secret.trim().length < 32) {
    throw new Error("ADMIN_SESSION_SECRET_MISSING");
  }
  return secret.trim();
}

import { getServerEnv } from "./env";

const SCHEMA = "lamultiventas";

function getSupabaseConfig(requireWrite = false) {
  const url = getServerEnv("SUPABASE_URL") ?? getServerEnv("VITE_SUPABASE_URL");
  const anonKey = getServerEnv("SUPABASE_ANON_KEY") ?? getServerEnv("VITE_SUPABASE_ANON_KEY");
  const serviceKey = getServerEnv("SUPABASE_SERVICE_ROLE_KEY");
  const key = serviceKey ?? anonKey;

  if (!url || !key || (requireWrite && !serviceKey)) return null;

  return {
    baseUrl: `${url.replace(/\/$/, "")}/rest/v1`,
    key,
  };
}

type QueryValue = string | number | boolean | null | undefined;

function buildUrl(base: string, path: string, query?: Record<string, QueryValue>) {
  const url = new URL(`${base}/${path}`);
  Object.entries(query ?? {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null) url.searchParams.set(key, String(value));
  });
  return url.toString();
}

async function request<T>(
  path: string,
  init: RequestInit & { query?: Record<string, QueryValue>; write?: boolean } = {},
): Promise<T> {
  const config = getSupabaseConfig(init.write);
  if (!config) throw new Error("Supabase REST is not configured");

  const headers = new Headers(init.headers);
  headers.set("apikey", config.key);
  headers.set("authorization", `Bearer ${config.key}`);
  headers.set(init.write ? "Content-Profile" : "Accept-Profile", SCHEMA);
  headers.set("accept", "application/json");
  if (init.body && !headers.has("content-type")) headers.set("content-type", "application/json");

  const response = await fetch(buildUrl(config.baseUrl, path, init.query), {
    ...init,
    headers,
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`Supabase REST ${response.status}: ${message}`);
  }

  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

export async function restSelect<T>(path: string, query?: Record<string, QueryValue>) {
  return request<T[]>(path, { method: "GET", query });
}

export async function restInsert<T>(path: string, body: unknown, query?: Record<string, QueryValue>) {
  return request<T[]>(path, {
    method: "POST",
    write: true,
    query,
    body: JSON.stringify(body),
    headers: { prefer: "return=representation" },
  });
}

export async function restUpdate<T>(path: string, body: unknown, query?: Record<string, QueryValue>) {
  return request<T[]>(path, {
    method: "PATCH",
    write: true,
    query,
    body: JSON.stringify(body),
    headers: { prefer: "return=representation" },
  });
}

export async function restDelete<T>(path: string, query?: Record<string, QueryValue>) {
  return request<T[]>(path, {
    method: "DELETE",
    write: true,
    query,
    headers: { prefer: "return=representation" },
  });
}

// Cliente REST de Supabase para el NAVEGADOR (SPA estatica).
//
// A diferencia de src/backend/supabase-rest.ts (que corre en el servidor y lee
// secrets via process.env), este lee las variables PUBLICAS VITE_* que Vite
// inyecta en el bundle del cliente. Solo expone lecturas (select) con la anon
// key — las escrituras del admin van por otro camino (Etapa 2: Supabase Auth).
//
// Requisitos en Supabase para que esto funcione desde el navegador:
//   - El schema `lamultiventas` debe estar expuesto en la API (db-schemas).
//   - El rol anon debe tener permiso de SELECT (via RLS o grants) sobre
//     active_products, categories y site_settings.

const SCHEMA = "lamultiventas";

function getConfig(): { baseUrl: string; key: string } | null {
  const rawUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;
  if (!rawUrl || !key) return null;

  // Red de seguridad: si alguien cargo la URL sin protocolo (ej. "api.neura.com.py"),
  // le agregamos https:// para que `new URL()` no explote.
  const url = /^https?:\/\//i.test(rawUrl) ? rawUrl : `https://${rawUrl}`;
  return { baseUrl: `${url.replace(/\/$/, "")}/rest/v1`, key };
}

type QueryValue = string | number | boolean | null | undefined;

function buildUrl(base: string, path: string, query?: Record<string, QueryValue>) {
  const url = new URL(`${base}/${path}`);
  Object.entries(query ?? {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null) url.searchParams.set(key, String(value));
  });
  return url.toString();
}

export async function restSelect<T>(
  path: string,
  query?: Record<string, QueryValue>,
): Promise<T[]> {
  const config = getConfig();
  if (!config) {
    throw new Error(
      "Supabase REST client no configurado (faltan VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY)",
    );
  }

  const headers = new Headers();
  headers.set("apikey", config.key);
  headers.set("authorization", `Bearer ${config.key}`);
  headers.set("accept-profile", SCHEMA);
  headers.set("accept", "application/json");

  const response = await fetch(buildUrl(config.baseUrl, path, query), { headers });
  if (!response.ok) {
    const message = await response.text();
    throw new Error(`Supabase REST ${response.status}: ${message}`);
  }
  return (await response.json()) as T[];
}

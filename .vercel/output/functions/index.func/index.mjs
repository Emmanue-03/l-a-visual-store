import server from "./server-bundle.mjs";

const ssr = server?.default ?? server;

function errorHtml(msg, stack) {
  const safe = (v) => String(v ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  return '<!doctype html><meta charset="utf-8"><title>500</title>'
    + '<style>body{font:14px/1.5 system-ui;padding:2rem;color:#111;max-width:60rem;margin:auto}'
    + 'pre{background:#fff;border:1px solid #ddd;padding:1rem;border-radius:6px;white-space:pre-wrap;word-break:break-word}'
    + 'h1{color:#b91c1c}</style>'
    + '<h1>500 - SSR error</h1><pre>' + safe(msg) + '</pre>'
    + (stack ? '<details open><summary>stack</summary><pre>' + safe(stack) + '</pre></details>' : '');
}

export default async function handler(request) {
  const url = new URL(request.url);

  // Diagnostico: confirma que la funcion arranca.
  if (url.pathname === "/_health") {
    return new Response(JSON.stringify({
      ok: true,
      pathname: url.pathname,
      hasSupabaseUrl: Boolean(process.env.SUPABASE_URL),
      hasServiceRole: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
      hasSessionSecret: Boolean(process.env.ADMIN_SESSION_SECRET),
      nodeVersion: process.version,
      ssrLoaded: typeof ssr?.fetch === "function",
    }, null, 2), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  }

  if (typeof ssr?.fetch !== "function") {
    return new Response(errorHtml("Bundle SSR no expone fetch."), {
      status: 500, headers: { "content-type": "text/html; charset=utf-8" },
    });
  }

  try {
    const ssrPromise = ssr.fetch(request, {}, {});
    const timeout = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("SSR timeout (9s)")), 9000),
    );
    return await Promise.race([ssrPromise, timeout]);
  } catch (error) {
    console.error("[handler] error:", error);
    const msg = error instanceof Error ? error.message : String(error);
    const stack = error instanceof Error ? error.stack ?? "" : "";
    return new Response(errorHtml(msg, stack), {
      status: 500,
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  }
}

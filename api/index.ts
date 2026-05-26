// Vercel Serverless Function (Node runtime). Recibe TODA la request que
// no matchee un asset estatico ni una funcion de /api, y delega al SSR
// handler generado por TanStack Start en dist/server/server.js.

export const config = {
  runtime: "nodejs",
};

type WorkerLikeServer = {
  fetch(request: Request, env: unknown, ctx: unknown): Promise<Response> | Response;
};

// Cache del modulo cargado dinamicamente. El import dinamico evita que
// TypeScript/Vercel intente resolver el path en static analysis.
let serverPromise: Promise<WorkerLikeServer> | undefined;

async function loadServer(): Promise<WorkerLikeServer> {
  if (!serverPromise) {
    serverPromise = (async () => {
      // El path es relativo al archivo bundleado por Vercel; apunta al
      // output que ya existe porque buildCommand corre `npm run build`
      // antes de que Vercel bundlee la funcion.
      // @ts-expect-error — generado durante el build.
      const mod = await import("../dist/server/server.js");
      const server = (mod.default ?? mod) as WorkerLikeServer;
      if (typeof server?.fetch !== "function") {
        throw new Error(
          "El bundle SSR no expone server.fetch. Verifica que `npm run build` haya corrido correctamente.",
        );
      }
      return server;
    })();
  }
  return serverPromise;
}

function errorResponse(error: unknown): Response {
  const message = error instanceof Error ? error.message : String(error);
  const stack = error instanceof Error ? error.stack ?? "" : "";
  const html = `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8" />
<title>Error en SSR</title>
<style>
body { font: 14px/1.5 system-ui, sans-serif; background: #fafafa; color: #111; padding: 2rem; }
pre { background: #fff; border: 1px solid #ddd; border-radius: 6px; padding: 1rem; overflow: auto; max-width: 100%; }
h1 { color: #b91c1c; font-size: 1.25rem; margin-bottom: 1rem; }
small { color: #6b7280; }
</style>
</head>
<body>
<h1>500 — SSR handler fallo</h1>
<p>El bundle del servidor no pudo procesar la request. Detalle:</p>
<pre>${escapeHtml(message)}</pre>
${stack ? `<details><summary><small>Stack trace</small></summary><pre>${escapeHtml(stack)}</pre></details>` : ""}
</body>
</html>`;
  return new Response(html, {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export default async function handler(request: Request): Promise<Response> {
  try {
    const server = await loadServer();
    return await server.fetch(request, {}, {});
  } catch (error) {
    console.error("[api/index] SSR error:", error);
    return errorResponse(error);
  }
}

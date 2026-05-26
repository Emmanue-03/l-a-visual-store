/**
 * Formatea un error capturado en un mensaje corto y legible para mostrar al
 * admin. Si el error contiene un arreglo de issues de zod serializado en JSON
 * (lo que pasa cuando un server fn de TanStack Start re-emite el ZodError),
 * lo descomprime a un listado «campo: mensaje».
 */
export function formatAdminError(error: unknown, fallback: string): string {
  const raw =
    error instanceof Error
      ? error.message
      : typeof error === "string"
        ? error
        : "";

  if (!raw) return fallback;

  const issues = tryParseZodIssues(raw);
  if (issues && issues.length > 0) {
    return issues
      .map((issue) => {
        const field = issue.path.filter(Boolean).join(".") || "campo";
        return `${field}: ${issue.message}`;
      })
      .join(" · ");
  }

  return raw;
}

type MaybeIssue = { path?: unknown; message?: unknown };

function tryParseZodIssues(message: string): { path: string[]; message: string }[] | null {
  // El mensaje puede ser el JSON crudo del array de issues o venir prefijado
  // (ej. "Supabase REST 400: [...]"). Buscamos el primer '[' que abra un array.
  const start = message.indexOf("[");
  const end = message.lastIndexOf("]");
  if (start < 0 || end <= start) return null;

  const candidate = message.slice(start, end + 1);
  let parsed: unknown;
  try {
    parsed = JSON.parse(candidate);
  } catch {
    return null;
  }

  if (!Array.isArray(parsed)) return null;

  const issues = parsed.filter((item): item is MaybeIssue => {
    return Boolean(item) && typeof item === "object";
  });
  if (issues.length === 0) return null;

  return issues
    .map((issue) => {
      const pathRaw = Array.isArray(issue.path) ? issue.path : [];
      const path = pathRaw.map((segment) => String(segment));
      const messageText = typeof issue.message === "string" ? issue.message : "Invalido";
      return { path, message: messageText };
    })
    .filter((issue) => issue.message);
}

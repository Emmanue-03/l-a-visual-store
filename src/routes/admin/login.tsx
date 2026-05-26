import { createFileRoute, redirect } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { FormEvent, useState } from "react";
import { AlertTriangle, Lock, Mail } from "lucide-react";
import { toast } from "sonner";
import { getCurrentAdmin, loginAdmin } from "@/backend/admin-auth";

export const Route = createFileRoute("/admin/login")({
  loader: async () => {
    const admin = await getCurrentAdmin();
    if (admin) throw redirect({ to: "/admin" });
    return null;
  },
  component: AdminLogin,
  head: () => ({ meta: [{ title: "Admin login | L&A Multiventas" }] }),
});

function AdminLogin() {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  // useServerFn wires the thrown redirect from loginAdmin to router.navigate,
  // so a successful login actually moves to /admin.
  const login = useServerFn(loginAdmin);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);
    setLoading(true);
    const form = new FormData(event.currentTarget);

    try {
      const result = await login({
        data: {
          email: String(form.get("email") ?? ""),
          password: String(form.get("password") ?? ""),
        },
      });

      // On success the redirect is consumed by useServerFn and result is void.
      // Only "ok: false" responses reach here.
      if (result && typeof result === "object" && "ok" in result && !result.ok) {
        setErrorMessage(result.message);
        toast.error(result.message);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Error inesperado al iniciar sesion";
      setErrorMessage(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen place-items-center bg-slate-100 px-4">
      <form onSubmit={submit} className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-xl">
        <div className="text-center">
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-brand-royal text-white">
            <Lock className="h-5 w-5" />
          </div>
          <h1 className="mt-4 font-display text-2xl font-bold text-brand-deep">Panel administrador</h1>
          <p className="mt-1 text-sm text-slate-500">Acceso privado de L&A Multiventas</p>
        </div>

        {errorMessage && (
          <div
            role="alert"
            className="mt-5 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700"
          >
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <label className="mt-6 block text-sm font-semibold text-slate-700">
          Email
          <span className="mt-2 flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5">
            <Mail className="h-4 w-4 text-slate-400" />
            <input
              name="email"
              type="email"
              autoComplete="username"
              required
              className="w-full bg-transparent text-sm outline-none"
            />
          </span>
        </label>

        <label className="mt-4 block text-sm font-semibold text-slate-700">
          Password
          <span className="mt-2 flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5">
            <Lock className="h-4 w-4 text-slate-400" />
            <input
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="w-full bg-transparent text-sm outline-none"
            />
          </span>
        </label>

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full rounded-xl bg-brand-royal px-4 py-3 text-sm font-bold text-white transition hover:opacity-90 disabled:opacity-60"
        >
          {loading ? "Ingresando..." : "Ingresar"}
        </button>
      </form>
    </div>
  );
}

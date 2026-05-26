import { createFileRoute, redirect, useNavigate, useRouter } from "@tanstack/react-router";
import { FormEvent, useState } from "react";
import { Lock, Mail } from "lucide-react";
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
  const navigate = useNavigate();
  const router = useRouter();

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    const form = new FormData(event.currentTarget);
    const result = await loginAdmin({
      data: {
        email: String(form.get("email") ?? ""),
        password: String(form.get("password") ?? ""),
      },
    }).finally(() => setLoading(false));

    if (!result.ok) {
      toast.error(result.message);
      return;
    }

    await router.invalidate();
    navigate({ to: "/admin" });
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

        <label className="mt-6 block text-sm font-semibold text-slate-700">
          Email
          <span className="mt-2 flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5">
            <Mail className="h-4 w-4 text-slate-400" />
            <input name="email" type="email" required className="w-full bg-transparent text-sm outline-none" />
          </span>
        </label>

        <label className="mt-4 block text-sm font-semibold text-slate-700">
          Password
          <span className="mt-2 flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5">
            <Lock className="h-4 w-4 text-slate-400" />
            <input name="password" type="password" required className="w-full bg-transparent text-sm outline-none" />
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


import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { Moon, Sun } from "lucide-react";

type ThemeMode = "light" | "dark";

const ThemeContext = createContext<{ mode: ThemeMode; toggle: () => void }>({
  mode: "light",
  toggle: () => {},
});

const STORAGE_KEY = "la-admin-theme";

export function AdminThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>("light");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem(STORAGE_KEY) as ThemeMode | null;
    if (stored === "dark" || stored === "light") setMode(stored);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEY, mode);
  }, [mode]);

  return (
    <ThemeContext.Provider value={{ mode, toggle: () => setMode((m) => (m === "dark" ? "light" : "dark")) }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useAdminTheme() {
  return useContext(ThemeContext);
}

export function ThemeToggle() {
  const { mode, toggle } = useAdminTheme();
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={mode === "dark" ? "Cambiar a claro" : "Cambiar a oscuro"}
      className="relative inline-flex h-9 w-9 items-center justify-center rounded-xl border border-[color:var(--la-line,#E2E8F0)] bg-white/60 text-[color:var(--la-text,#0F172A)] transition hover:border-[color:var(--mg-magenta)]/40 hover:text-[color:var(--mg-magenta)]"
    >
      {mode === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
}

import { createContext, useContext, useState, useCallback, useMemo, type ReactNode } from "react";
import type { Product } from "./mock-data";

export type CartItem = { product: Product; qty: number };

type CartCtx = {
  items: CartItem[];
  count: number;
  total: number;
  isOpen: boolean;
  open: () => void;
  close: () => void;
  add: (p: Product, qty?: number) => void;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
};

const Ctx = createContext<CartCtx | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setOpen] = useState(false);

  const add = useCallback((product: Product, qty = 1) => {
    setItems((prev) => {
      const i = prev.findIndex((x) => x.product.id === product.id);
      if (i >= 0) {
        const next = [...prev];
        next[i] = { ...next[i], qty: next[i].qty + qty };
        return next;
      }
      return [...prev, { product, qty }];
    });
  }, []);

  const remove = useCallback((id: string) => {
    setItems((prev) => prev.filter((x) => x.product.id !== id));
  }, []);

  const setQty = useCallback((id: string, qty: number) => {
    setItems((prev) =>
      prev.map((x) => (x.product.id === id ? { ...x, qty: Math.max(1, qty) } : x))
    );
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const value = useMemo<CartCtx>(
    () => ({
      items,
      count: items.reduce((s, x) => s + x.qty, 0),
      total: items.reduce((s, x) => s + x.qty * x.product.price, 0),
      isOpen,
      open: () => setOpen(true),
      close: () => setOpen(false),
      add, remove, setQty, clear,
    }),
    [items, isOpen, add, remove, setQty, clear]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useCart must be used within CartProvider");
  return c;
}

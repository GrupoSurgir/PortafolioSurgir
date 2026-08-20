import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { productBySlug } from "../data/products.js";

// Carrito global de SURGIR. Compartido entre la vista dentro del monitor y la
// vista a pantalla completa, de modo que ambas muestran siempre el mismo estado.
// Persistencia en localStorage (clave "surgir-cart").

const CART_KEY = "surgir-cart";
const CartContext = createContext(null);

function loadCart() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(loadCart);

  useEffect(() => {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(items));
    } catch {}
  }, [items]);

  const value = useMemo(() => {
    const add = (slug, qty = 1) =>
      setItems((prev) => {
        const found = prev.find((i) => i.slug === slug);
        if (found) {
          return prev.map((i) =>
            i.slug === slug ? { ...i, qty: i.qty + qty } : i
          );
        }
        return [...prev, { slug, qty }];
      });

    const setQty = (slug, qty) =>
      setItems((prev) =>
        qty <= 0
          ? prev.filter((i) => i.slug !== slug)
          : prev.map((i) => (i.slug === slug ? { ...i, qty } : i))
      );

    const remove = (slug) =>
      setItems((prev) => prev.filter((i) => i.slug !== slug));

    const count = items.reduce((s, i) => s + i.qty, 0);
    const total = items.reduce((s, i) => {
      const p = productBySlug(i.slug);
      return s + (p ? p.price * i.qty : 0);
    }, 0);

    return { items, add, setQty, remove, setItems, count, total };
  }, [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart debe usarse dentro de <CartProvider>");
  return ctx;
}
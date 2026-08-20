import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { productBySlug } from "../data/products.js";

// Pedidos de SurgirStudio.
//
// En esta primera versión los pedidos se registran en localStorage del
// navegador (sin backend). La estructura es la definitiva:
//   orderId, userId, email, items[], total, status, createdAt
// Cuando exista backend (Netlify Function), estos pedidos se crearán en el
// servidor y el frontend solo consultará el de la sesión.

const ORDERS_KEY = "surgir-orders";
const OrdersContext = createContext(null);

function loadOrders() {
  try {
    const raw = localStorage.getItem(ORDERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function genOrderId() {
  const t = Date.now().toString(36).toUpperCase();
  const r = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `SE-${t}-${r}`;
}

export function OrdersProvider({ children }) {
  const [orders, setOrders] = useState(loadOrders);

  useEffect(() => {
    try {
      localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
    } catch {}
  }, [orders]);

  const value = useMemo(() => {
    const createOrder = ({ items, user, total, status = "completed" }) => {
      const order = {
        orderId: genOrderId(),
        userId: user?.email || user?.id || "guest",
        email: user?.email || user?.email || "",
        items: items.map((i) => ({
          slug: i.slug,
          qty: i.qty,
          price: productBySlug(i.slug)?.price || 0,
        })),
        total,
        status,
        createdAt: new Date().toISOString(),
      };
      setOrders((prev) => [order, ...prev]);
      return order;
    };

    const ordersForProduct = (slug) =>
      orders.filter(
        (o) => o.status === "completed" && o.items.some((i) => i.slug === slug)
      );

    const hasDownload = (slug) => ordersForProduct(slug).length > 0;

    return { orders, createOrder, ordersForProduct, hasDownload };
  }, [orders]);

  return <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>;
}

export function useOrders() {
  const ctx = useContext(OrdersContext);
  if (!ctx) throw new Error("useOrders debe usarse dentro de <OrdersProvider>");
  return ctx;
}
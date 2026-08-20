import { createContext, useContext, useEffect, useState } from "react";
import { loadPaymentsConfig, savePaymentsConfig } from "./payments.js";

// ÚNICA fuente de verdad de la configuración de pagos durante la sesión.
// Tanto la aplicación SURGIR (StoreApp, montada dentro del monitor y a pantalla
// completa) como el panel de administración consumen este contexto, de modo
// que siempre ven exactamente la misma configuración.
const PaymentsContext = createContext(null);

export function PaymentsProvider({ children }) {
  const [payments, setPayments] = useState(loadPaymentsConfig);

  useEffect(() => {
    try {
      localStorage.setItem("surgir-payments", JSON.stringify(payments));
    } catch {}
  }, [payments]);

  return (
    <PaymentsContext.Provider value={{ payments, setPayments }}>
      {children}
    </PaymentsContext.Provider>
  );
}

export function usePayments() {
  const ctx = useContext(PaymentsContext);
  if (!ctx) throw new Error("usePayments debe usarse dentro de <PaymentsProvider>");
  return ctx;
}

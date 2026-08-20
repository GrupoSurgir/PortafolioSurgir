import { useState } from "react";
import { productBySlug } from "../../data/products.js";
import { PaymentMethods } from "../PaymentMethods.jsx";
import { usePayments } from "../PaymentsContext.jsx";

export default function CheckoutPage({ navigate, cart }) {
  const { payments } = usePayments();
  const [done, setDone] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "" });

  if (cart.items.length === 0 && !done) {
    return (
      <div className="sa-wrap">
        <h1 className="sa-h1">Checkout</h1>
        <div className="sa-empty">No hay productos para pagar.</div>
        <button className="sa-btn" onClick={() => navigate("shop")}>
          Volver a la tienda
        </button>
      </div>
    );
  }

  if (done) {
    return (
      <div className="sa-wrap">
        <h1 className="sa-h1">Pedido confirmado</h1>
        <div className="sa-msg ok" style={{ marginTop: 14 }}>
          Gracias, {form.name || "cliente"}. Hemos registrado tu pedido.
          Próximamente activaremos el pago real.
        </div>
        <button className="sa-btn block" onClick={() => navigate("home")}>
          Volver al inicio
        </button>
      </div>
    );
  }

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <div className="sa-wrap" style={{ maxWidth: 760 }}>
      <h1 className="sa-h1">Checkout</h1>
      <div className="sa-detail" style={{ gridTemplateColumns: "1fr 1fr" }}>
        <div>
          <h2 className="sa-h2">Cliente</h2>
          <label className="sa-label">Nombre</label>
          <input className="sa-input" value={form.name} onChange={set("name")} />
          <label className="sa-label">Correo</label>
          <input
            className="sa-input"
            type="email"
            value={form.email}
            onChange={set("email")}
          />
          <label className="sa-label">Teléfono</label>
          <input className="sa-input" value={form.phone} onChange={set("phone")} />

          <h2 className="sa-h2">Método de pago</h2>
          <div className="sa-pay-list">
            <PaymentMethods cfg={payments} />
          </div>
        </div>

        <div>
          <h2 className="sa-h2">Pedido</h2>
          {cart.items.map((i) => {
            const p = productBySlug(i.slug);
            return (
              <div className="sa-line" key={i.slug}>
                <span className="sa-mini">
                  {p?.name} × {i.qty}
                </span>
                <span className="sa-price">
                  ${p ? p.price * i.qty : 0}
                </span>
              </div>
            );
          })}
          <div className="sa-total">
            <span>Total</span>
            <span className="sa-price">${cart.total}</span>
          </div>
        </div>
      </div>
      <button
        className="sa-btn accent block"
        onClick={() => {
          cart.setItems([]);
          setDone(true);
        }}
      >
        Confirmar pedido
      </button>
      <p className="sa-muted" style={{ fontSize: 11, marginTop: 8 }}>
        La pasarela de pago aún no está activa. Este flujo queda preparado para
        conectar un backend posteriormente.
      </p>
    </div>
  );
}
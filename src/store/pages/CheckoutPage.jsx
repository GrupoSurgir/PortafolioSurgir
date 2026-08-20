import { useState } from "react";
import { productBySlug } from "../../data/products.js";
import { PaymentMethods } from "../PaymentMethods.jsx";
import { usePayments } from "../PaymentsContext.jsx";

export default function CheckoutPage({ navigate, cart, auth, orders }) {
  const { payments } = usePayments();
  const [done, setDone] = useState(false);
  const [order, setOrder] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "" });

  if (cart.items.length === 0 && !done) {
    return (
      <div className="sa-wrap">
        <h1 className="sa-h1">Checkout</h1>
        <div className="sa-empty">No hay productos para obtener.</div>
        <button className="sa-btn" onClick={() => navigate("shop")}>
          Volver a la tienda
        </button>
      </div>
    );
  }

  if (done && order) {
    const freeItems = order.items.filter(
      (i) => (productBySlug(i.slug)?.price || 0) === 0
    );
    return (
      <div className="sa-wrap" style={{ maxWidth: 720 }}>
        <div className="sa-result-card">
          <h1 className="sa-h1">
            {order.status === "completed" ? "Pedido completado" : "Pedido registrado"}
          </h1>
          <p className="sa-lead">
            {order.status === "completed"
              ? `Tu pedido ${order.orderId} fue procesado correctamente.`
              : `Tu pedido ${order.orderId} quedó registrado. Activaremos el pago próximamente.`}
          </p>

          <div className="sa-result-row">
            <span>Producto</span>
            <span>{order.items.map((i) => productBySlug(i.slug)?.name).join(", ")}</span>
          </div>
          <div className="sa-result-row">
            <span>Total</span>
            <span>{order.total === 0 ? "Gratis · $0" : `$${order.total}`}</span>
          </div>
          <div className="sa-result-row">
            <span>Cuenta utilizada</span>
            <span>
              {auth.user?.name} · {auth.user?.email}
            </span>
          </div>
          <div className="sa-result-row">
            <span>Estado</span>
            <span className="sa-result-ok">
              {order.status === "completed" ? "Completado" : "Pendiente de pago"}
            </span>
          </div>

          <div className="sa-result-delivery">
            <div className="sa-result-chan">
              <span className="sa-result-ico">✉</span>
              <div>
                <div className="sa-name">Email</div>
                <div className="sa-mini">
                  Canal preparado para {auth.user?.email || "tu correo"} — el
                  envío real se activa cuando el backend de correo esté conectado.
                </div>
              </div>
            </div>

            {freeItems.length > 0 ? (
              freeItems.map((i) => {
                const p = productBySlug(i.slug);
                if (!p?.downloadUrl) return null;
                return (
                  <div className="sa-result-chan" key={i.slug}>
                    <span className="sa-result-ico">⬇</span>
                    <div>
                      <div className="sa-name">Descarga digital</div>
                      <div className="sa-mini">
                        {p.name} · v{p.version} · {p.studio}
                      </div>
                      <div className="sa-dl-actions" style={{ marginTop: 8 }}>
                        <a
                          className="sa-btn accent"
                          href={p.downloadUrl}
                          download
                        >
                          Descargar {p.name}
                        </a>
                        {p.wiki && (
                          <button
                            className="sa-btn ghost"
                            onClick={() => navigate("wiki", { slug: p.slug })}
                          >
                            Wiki
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="sa-result-chan">
                <span className="sa-result-ico">⬇</span>
                <div>
                  <div className="sa-name">Descarga digital</div>
                  <div className="sa-mini">
                    Disponible en Cuenta → Mis descargas al procesar el pedido.
                  </div>
                </div>
              </div>
            )}
          </div>

          <p className="sa-note" style={{ marginTop: 14 }}>
            Guarda estos archivos. También están disponibles en{" "}
            <b>Cuenta → Mis descargas</b>.
          </p>
        </div>

        <button
          className="sa-btn block"
          style={{ marginTop: 18 }}
          onClick={() => navigate("home")}
        >
          Volver al inicio
        </button>
      </div>
    );
  }

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const total = cart.total;
  const free = total === 0;
  const loggedIn = !!auth.user;

  const confirm = () => {
    const o = orders.createOrder({
      items: cart.items,
      user: auth.user,
      total,
      status: free ? "completed" : "pending",
    });
    setOrder(o);
    cart.setItems([]);
    setDone(true);
  };

  return (
    <div className="sa-wrap" style={{ maxWidth: 900 }}>
      <h1 className="sa-h1">Checkout</h1>
      <p className="sa-lead">
        Revisa tu pedido, inicia sesión si es necesario y confirma.
      </p>

      <div className="sa-checkout-grid">
        <div>
          <div className="sa-login-card">
            <h2 className="sa-h2">Iniciar sesión</h2>
            {loggedIn ? (
              <div className="sa-profile" style={{ margin: "0 0 4px" }}>
                <div className="sa-avatar sm">
                  {auth.user.avatar ? (
                    <img className="sa-avatar-img" src={auth.user.avatar} alt="" />
                  ) : (
                    auth.user.name.charAt(0)
                  )}
                </div>
                <div className="sa-mini">
                  {auth.user.name} · {auth.user.email}
                </div>
              </div>
            ) : (
              <>
                <p className="sa-mini" style={{ marginBottom: 10 }}>
                  {free
                    ? "Inicia sesión para confirmar la obtención de tu producto gratuito."
                    : "Inicia sesión para registrar tu pedido."}
                </p>
                <div className="sa-auth-box">
                  <button
                    className="sa-auth-btn"
                    onClick={() => auth.signIn("google")}
                  >
                    <span className="sa-auth-ico">G</span> Continuar con Google
                  </button>
                  <button
                    className="sa-auth-btn"
                    onClick={() => auth.signIn("discord")}
                  >
                    <span className="sa-auth-ico">D</span> Continuar con Discord
                  </button>
                </div>
                <p className="sa-muted" style={{ fontSize: 11, marginTop: 10 }}>
                  {auth.demo
                    ? "Modo demo: la sesión se simula."
                    : "Serás redirigido al proveedor."}
                </p>
              </>
            )}
          </div>

          <h2 className="sa-h2">Cliente</h2>
          <label className="sa-label">Nombre</label>
          <input
            className="sa-input"
            value={form.name || auth.user?.name || ""}
            onChange={set("name")}
          />
          <label className="sa-label">Correo</label>
          <input
            className="sa-input"
            type="email"
            value={form.email || auth.user?.email || ""}
            onChange={set("email")}
          />
          <label className="sa-label">Teléfono (opcional)</label>
          <input className="sa-input" value={form.phone} onChange={set("phone")} />

          {!free && (
            <>
              <h2 className="sa-h2">Método de pago</h2>
              <div className="sa-pay-list">
                <PaymentMethods cfg={payments} />
              </div>
              <p className="sa-muted" style={{ fontSize: 11, marginTop: 8 }}>
                La pasarela de pago se activará próximamente. Al confirmar se
                registra tu pedido como pendiente (no se cobra nada aún).
              </p>
            </>
          )}
        </div>

        <div>
          <div className="sa-order-card">
            <h2 className="sa-h2" style={{ marginTop: 0 }}>
              Resumen del pedido
            </h2>
            {cart.items.map((i) => {
              const p = productBySlug(i.slug);
              return (
                <div className="sa-line" key={i.slug}>
                  <span className="sa-mini">
                    {p?.name} × {i.qty}
                  </span>
                  <span className="sa-price">${p ? p.price * i.qty : 0}</span>
                </div>
              );
            })}
            <div className="sa-subtotal">
              <span>Subtotal</span>
              <span>${total}</span>
            </div>
            <div className="sa-total" style={{ padding: "14px 0" }}>
              <span>Total</span>
              <span className="sa-price">
                {free ? "Gratis · $0" : `$${total}`}
              </span>
            </div>

            <div className="sa-result-row">
              <span>Cuenta utilizada</span>
              <span>{loggedIn ? auth.user.name : "Pendiente de inicio de sesión"}</span>
            </div>
            <div className="sa-result-row">
              <span>Estado del pedido</span>
              <span>{free ? "Se completará al confirmar" : "Pendiente de pago"}</span>
            </div>

            <button
              className="sa-btn accent block"
              disabled={!loggedIn}
              onClick={confirm}
            >
              {!loggedIn
                ? "Inicia sesión para continuar"
                : free
                ? "Confirmar obtención gratuita"
                : "Registrar pedido (pago próximamente)"}
            </button>
            <p className="sa-muted" style={{ fontSize: 11, marginTop: 10 }}>
              Al confirmar{" "}
              {free
                ? "se crea tu pedido y se desbloquea la descarga."
                : "se registra el pedido; no se cobra nada hasta activar la pasarela."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
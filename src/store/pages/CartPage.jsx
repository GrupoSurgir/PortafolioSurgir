import { productBySlug } from "../../data/products.js";

export default function CartPage({ navigate, cart }) {
  if (cart.items.length === 0) {
    return (
      <div className="sa-wrap">
        <h1 className="sa-h1">Carrito</h1>
        <div className="sa-empty">Tu carrito está vacío.</div>
        <button className="sa-btn accent" onClick={() => navigate("shop")}>
          Explorar tienda
        </button>
      </div>
    );
  }

  return (
    <div className="sa-wrap" style={{ maxWidth: 720 }}>
      <h1 className="sa-h1">Carrito</h1>
      <div style={{ margin: "18px 0" }}>
        {cart.items.map((i) => {
          const p = productBySlug(i.slug);
          if (!p) return null;
          return (
            <div className="sa-line" key={i.slug}>
              <div>
                <div className="sa-name">{p.name}</div>
                <div className="sa-mini">${p.price} c/u</div>
              </div>
              <div className="sa-qty sa-qty-sm">
                <button onClick={() => cart.setQty(i.slug, i.qty - 1)}>−</button>
                <span>{i.qty}</span>
                <button onClick={() => cart.setQty(i.slug, i.qty + 1)}>+</button>
              </div>
              <div className="sa-price">${p.price * i.qty}</div>
              <button className="sa-remove" onClick={() => cart.remove(i.slug)}>
                Eliminar
              </button>
            </div>
          );
        })}
      </div>
      <div className="sa-total">
        <span>Total</span>
        <span className="sa-price">${cart.total}</span>
      </div>
      <button className="sa-btn accent block" onClick={() => navigate("checkout")}>
        Continuar al pago
      </button>
    </div>
  );
}
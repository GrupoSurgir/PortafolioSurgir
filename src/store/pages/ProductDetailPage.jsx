import { useState } from "react";
import { productBySlug, categoryName } from "../../data/products.js";
import { StatusPill } from "../ui.jsx";

export default function ProductDetailPage({ navigate, cart, params }) {
  const p = productBySlug(params.slug);
  const [qty, setQty] = useState(1);

  if (!p) {
    return (
      <div className="sa-wrap">
        <div className="sa-empty">Producto no encontrado.</div>
        <button className="sa-btn" onClick={() => navigate("shop")}>
          Volver a la tienda
        </button>
      </div>
    );
  }

  const unavailable = p.status === "Próximamente" || p.status === "En preparación";
  const free = p.price === 0;

  const links = [];
  if (p.downloadUrl) links.push({ label: "Descargar", href: p.downloadUrl });
  if (p.documentationUrl) links.push({ label: "Documentación", href: p.documentationUrl });
  if (p.repositoryUrl) links.push({ label: "Repositorio", href: p.repositoryUrl });
  if (p.purchaseUrl) links.push({ label: "Comprar", href: p.purchaseUrl });

  return (
    <div className="sa-wrap">
      <span className="sa-back" onClick={() => navigate("shop")}>
        ← Volver a la tienda
      </span>

      <div className="sa-detail">
        <div className="sa-detail-media">{p.icon || p.name.charAt(0)}</div>

        <div className="sa-detail-info">
          <div className="sa-cat">{categoryName(p.category)}</div>
          <div className="sa-name-lg">{p.name}</div>

          <div className="sa-meta">
            <span className="sa-meta-item">{p.version ? `v${p.version}` : "v—"}</span>
            {p.compatibility && <span className="sa-meta-item">{p.compatibility}</span>}
            <StatusPill status={p.status} />
          </div>

          <p className="sa-desc">{p.description}</p>

          {p.features?.length > 0 && (
            <ul className="sa-features">
              {p.features.map((f, i) => (
                <li key={i}>{f}</li>
              ))}
            </ul>
          )}

          {p.tags?.length > 0 && (
            <div className="sa-tags">
              {p.tags.map((t) => (
                <span key={t} className="sa-tag">
                  #{t}
                </span>
              ))}
            </div>
          )}

          <div className="sa-price-lg">{free ? "Gratis" : `$${p.price}`}</div>

          {free ? (
            <>
              <a
                className="sa-btn accent block sa-download"
                href={p.downloadUrl}
                download
                target="_blank"
                rel="noreferrer noopener"
              >
                ⬇ Descargar plugin (0 pesos)
              </a>
              <p className="sa-muted" style={{ fontSize: 12, marginTop: 8 }}>
                Gratis y configurable: descarga el ZIP, edita su config.yml y
                pruébalo en tu servidor.
              </p>
            </>
          ) : (
            <>
              <div className="sa-qty">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))}>−</button>
                <span>{qty}</span>
                <button onClick={() => setQty((q) => q + 1)}>+</button>
              </div>

              <button
                className="sa-btn accent block"
                disabled={unavailable}
                onClick={() => {
                  cart.add(p.slug, qty);
                  navigate("cart");
                }}
              >
                {unavailable ? "Próximamente" : "Agregar al carrito"}
              </button>
            </>
          )}

          {links.length > 0 && (
            <div className="sa-links">
              {links.map((l) => (
                <a
                  key={l.label}
                  className="sa-link-ext"
                  href={l.href}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  {l.label} ↗
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
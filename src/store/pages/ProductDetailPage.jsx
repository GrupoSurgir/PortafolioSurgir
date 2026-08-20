import { useState } from "react";
import { productBySlug, categoryName } from "../../data/products.js";
import { StatusPill } from "../ui.jsx";

export default function ProductDetailPage({ navigate, cart, params, auth, orders }) {
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
  const hasDownload = orders?.hasDownload(p.slug);

  const links = [];
  if (p.wiki) links.push({ label: "Wiki / Documentación", action: () => navigate("wiki", { slug: p.slug }) });
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
          <div className="sa-cat">
            {categoryName(p.category)} · {free ? "Gratis" : "Pago"}
          </div>
          <div className="sa-name-lg">{p.name}</div>

          <div className="sa-meta">
            <span className="sa-meta-item">{p.version ? `v${p.version}` : "v—"}</span>
            {p.compatibility && <span className="sa-meta-item">{p.compatibility}</span>}
            {p.author && <span className="sa-meta-item">por {p.author}</span>}
            <StatusPill status={p.status} />
          </div>

          <p className="sa-desc">{p.description}</p>

          {p.features?.length > 0 && (
            <>
              <h3 className="sa-sub-h">Características</h3>
              <ul className="sa-features">
                {p.features.map((f, i) => (
                  <li key={i}>{f}</li>
                ))}
              </ul>
            </>
          )}

          {p.requirements?.length > 0 && (
            <>
              <h3 className="sa-sub-h">Requisitos</h3>
              <ul className="sa-features">
                {p.requirements.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </>
          )}

          {p.installation?.length > 0 && (
            <>
              <h3 className="sa-sub-h">Instalación</h3>
              <ol className="sa-steps">
                {p.installation.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ol>
            </>
          )}

          {p.commands?.length > 0 && (
            <>
              <h3 className="sa-sub-h">Comandos</h3>
              <div className="sa-wiki-table">
                {p.commands.map((c) => (
                  <div className="sa-wiki-row" key={c.cmd}>
                    <code className="sa-wiki-code">{c.cmd}</code>
                    <span>{c.desc}</span>
                  </div>
                ))}
              </div>
            </>
          )}

          {p.permissions?.length > 0 && (
            <>
              <h3 className="sa-sub-h">Permisos</h3>
              <div className="sa-wiki-table">
                {p.permissions.map((pp) => (
                  <div className="sa-wiki-row" key={pp.node}>
                    <code className="sa-wiki-code">{pp.node}</code>
                    <span>{pp.def}</span>
                  </div>
                ))}
              </div>
            </>
          )}

          {p.changelog?.length > 0 && (
            <>
              <h3 className="sa-sub-h">Changelog</h3>
              <div className="sa-wiki-table">
                {p.changelog.map((c) => (
                  <div className="sa-wiki-row" key={c.version}>
                    <code className="sa-wiki-code">v{c.version}</code>
                    <span>{c.date}</span>
                  </div>
                ))}
              </div>
            </>
          )}

          {p.tags?.length > 0 && (
            <div className="sa-tags" style={{ marginTop: 16 }}>
              {p.tags.map((t) => (
                <span key={t} className="sa-tag">
                  #{t}
                </span>
              ))}
            </div>
          )}

          <div className="sa-price-lg">{free ? "Gratis · $0" : `$${p.price}`}</div>

          {hasDownload ? (
            <a
              className="sa-btn accent block sa-download"
              href={p.downloadUrl}
              download
            >
              ⬇ Descargar {p.name} v{p.version}
            </a>
          ) : (
            <>
              {!free && (
                <div className="sa-qty">
                  <button onClick={() => setQty((q) => Math.max(1, q - 1))}>−</button>
                  <span>{qty}</span>
                  <button onClick={() => setQty((q) => q + 1)}>+</button>
                </div>
              )}

              <button
                className="sa-btn accent block"
                disabled={unavailable}
                onClick={() => {
                  cart.add(p.slug, qty);
                  navigate("cart");
                }}
              >
                {unavailable
                  ? "Próximamente"
                  : free
                  ? "Agregar al carrito · $0"
                  : "Agregar al carrito"}
              </button>

              <p className="sa-muted" style={{ fontSize: 12, marginTop: 8 }}>
                {free
                  ? "Gratis: añádelo al carrito, confirma el pedido con tu cuenta y la descarga se desbloquea aquí."
                  : "Pago: registra tu pedido; la pasarela se activará próximamente."}
              </p>
            </>
          )}

          {links.length > 0 && (
            <div className="sa-links" style={{ marginTop: 14 }}>
              {links.map((l, i) =>
                l.href ? (
                  <a
                    key={i}
                    className="sa-link-ext"
                    href={l.href}
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    {l.label} ↗
                  </a>
                ) : (
                  <button key={i} className="sa-link-ext btn" onClick={l.action}>
                    {l.label} →
                  </button>
                )
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
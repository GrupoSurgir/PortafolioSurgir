import { useState } from "react";
import { productBySlug, categoryName } from "../../data/products.js";
import { StatusPill } from "../ui.jsx";
import { hasDownload, grantDownload, getLastEmail } from "../downloads.js";

export default function ProductDetailPage({ navigate, params }) {
  const p = productBySlug(params.slug);
  const [email, setEmail] = useState(getLastEmail());
  const [error, setError] = useState("");
  const [justGranted, setJustGranted] = useState(false);

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

  const free = p.price === 0;
  const unlocked = hasDownload(p.slug) || justGranted;

  const activate = () => {
    const value = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) {
      setError("Escribe un correo electrónico válido.");
      return;
    }
    setError("");
    grantDownload(p.slug, value);
    setJustGranted(true);
  };

  const links = [];
  if (p.wiki) links.push({ label: "Wiki / Documentación", action: () => navigate("wiki", { slug: p.slug }) });
  if (p.documentationUrl) links.push({ label: "Documentación", href: p.documentationUrl });
  if (p.repositoryUrl) links.push({ label: "Repositorio", href: p.repositoryUrl });

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

          {unlocked ? (
            <div className="sa-grant">
              <div className="sa-name-lg" style={{ fontSize: 16 }}>
                Descarga activada
              </div>
              <p className="sa-mini" style={{ margin: "4px 0 12px" }}>
                Gracias. Tu descarga está disponible:
              </p>
              <a
                className="sa-btn accent block sa-download"
                href={p.downloadUrl}
                download
              >
                ⬇ Descargar {p.name} v{p.version}
              </a>
              <p className="sa-muted" style={{ fontSize: 12, marginTop: 8 }}>
                Guarda el archivo. También puedes abrir la Wiki para ver
                instalación, comandos y permisos.
              </p>
            </div>
          ) : (
            <div className="sa-grant">
              <div className="sa-name-lg" style={{ fontSize: 16 }}>
                Descarga gratis
              </div>
              <p className="sa-mini" style={{ margin: "4px 0 10px" }}>
                Deja tu correo electrónico y se activa la descarga de{" "}
                {p.name}.
              </p>
              <label className="sa-label" htmlFor="dl-email">
                Correo electrónico
              </label>
              <input
                id="dl-email"
                className="sa-input"
                type="email"
                placeholder="tu@correo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {error && (
                <div className="sa-msg err" style={{ marginTop: 8 }}>
                  {error}
                </div>
              )}
              <button className="sa-btn accent block" onClick={activate}>
                Activar descarga
              </button>
              <p className="sa-muted" style={{ fontSize: 12, marginTop: 10 }}>
                No se enviará correo automáticamente todavía. Al conectar el
                backend, el enlace de descarga también llegará a tu correo.
              </p>
            </div>
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
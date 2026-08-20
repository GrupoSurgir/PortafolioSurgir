import { productBySlug } from "../../data/products.js";

function Block({ title, children }) {
  return (
    <div className="sa-wiki-block">
      <h3 className="sa-wiki-h">{title}</h3>
      {children}
    </div>
  );
}

export default function WikiPage({ navigate, params, cart, orders, auth }) {
  const p = productBySlug(params.slug);

  if (!p || !p.wiki) {
    return (
      <div className="sa-wrap">
        <div className="sa-empty">No hay documentación para este producto.</div>
        <button className="sa-btn" onClick={() => navigate("shop")}>
          Volver a la tienda
        </button>
      </div>
    );
  }

  const hasDownload = orders.hasDownload(p.slug);
  const w = p.wiki;

  return (
    <div className="sa-wrap" style={{ maxWidth: 820 }}>
      <span className="sa-back" onClick={() => navigate("product", { slug: p.slug })}>
        ← Volver a {p.name}
      </span>

      <div className="sa-wiki-head">
        <div className="sa-icon lg">{p.icon}</div>
        <div>
          <div className="sa-cat">Wiki · {p.name}</div>
          <h1 className="sa-h1" style={{ marginTop: 4 }}>
            Documentación de {p.name}
          </h1>
          <div className="sa-mini">
            v{p.version} · {p.compatibility} · por {p.author} · {p.studio}
          </div>
        </div>
      </div>

      <Block title="Qué es">
        <p className="sa-desc">{w.what}</p>
      </Block>

      <Block title="Instalación">
        <ol className="sa-steps">
          {p.installation.map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ol>
      </Block>

      <Block title="Requisitos">
        <ul className="sa-features">
          {p.requirements.map((r, i) => (
            <li key={i}>{r}</li>
          ))}
        </ul>
      </Block>

      <Block title="Configuración">
        <ul className="sa-features">
          {w.config.map((c, i) => (
            <li key={i}>{c}</li>
          ))}
        </ul>
      </Block>

      <Block title="Comandos">
        <div className="sa-wiki-table">
          {p.commands.map((c) => (
            <div className="sa-wiki-row" key={c.cmd}>
              <code className="sa-wiki-code">{c.cmd}</code>
              <span>{c.desc}</span>
            </div>
          ))}
        </div>
      </Block>

      <Block title="Permisos">
        <div className="sa-wiki-table">
          {p.permissions.map((pp) => (
            <div className="sa-wiki-row" key={pp.node}>
              <code className="sa-wiki-code">{pp.node}</code>
              <span>
                {pp.desc} · <b>{pp.def}</b>
              </span>
            </div>
          ))}
        </div>
      </Block>

      {w.economy && <Block title="Economía"><p className="sa-desc">{w.economy}</p></Block>}
      {w.ads && <Block title="Anuncios"><p className="sa-desc">{w.ads}</p></Block>}
      {w.architecture && <Block title="Arquitectura"><p className="sa-desc">{w.architecture}</p></Block>}
      {w.tech?.length > 0 && (
        <Block title="Tecnologías">
          <div className="sa-tags">
            {w.tech.map((t) => (
              <span key={t} className="sa-tag">
                {t}
              </span>
            ))}
          </div>
        </Block>
      )}

      <Block title="Changelog">
        {p.changelog.map((c) => (
          <div className="sa-wiki-chg" key={c.version}>
            <div className="sa-mini">
              v{c.version} · {c.date}
            </div>
            <ul className="sa-features">
              {c.notes.map((n, i) => (
                <li key={i}>{n}</li>
              ))}
            </ul>
          </div>
        ))}
      </Block>

      <Block title="Obtener {p.name}">
        {hasDownload ? (
          <>
            <a
              className="sa-btn accent block sa-download"
              href={p.downloadUrl}
              download
            >
              ⬇ Descargar {p.name} v{p.version}
            </a>
            <p className="sa-muted" style={{ fontSize: 12, marginTop: 8 }}>
              Ya tienes acceso: lo obtuviste en un pedido confirmado.
            </p>
          </>
        ) : (
          <>
            <button className="sa-btn accent block" onClick={() => navigate("product", { slug: p.slug })}>
              Obtener gratis (0 pesos)
            </button>
            <p className="sa-muted" style={{ fontSize: 12, marginTop: 8 }}>
              {auth.user
                ? "Añádelo al carrito y confirma el pedido para desbloquear la descarga."
                : "Inicia sesión y confirma el pedido para desbloquear la descarga."}
            </p>
          </>
        )}
      </Block>

      <Block title="Autor">
        <p className="sa-desc">
          Desarrollado por <b>{p.author}</b> como parte de <b>{p.studio}</b>.
        </p>
      </Block>
    </div>
  );
}
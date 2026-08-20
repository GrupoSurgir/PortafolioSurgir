import { productBySlug, products } from "../../data/products.js";
import { hasDownload } from "../downloads.js";

function Block({ title, children }) {
  return (
    <div className="sa-wiki-block">
      <h3 className="sa-wiki-h">{title}</h3>
      {children}
    </div>
  );
}

function WikiIndex({ navigate }) {
  const withDocs = products.filter((p) => p.wiki);
  const planned = [
    { name: "SurgirMenu", type: "Plugin Minecraft" },
    { name: "SurgirAgente", type: "Inteligencia artificial" },
  ];
  return (
    <div className="sa-wrap" style={{ maxWidth: 720 }}>
      <h1 className="sa-h1">Wiki</h1>
      <p className="sa-lead">Documentación SURGIR</p>

      <div className="sa-wiki-index">
        {withDocs.map((p) => (
          <div className="sa-wiki-card" key={p.id}>
            <div className="sa-wiki-card-main">
              <div className="sa-name">{p.name}</div>
              <div className="sa-cat">{p.type || "Documentación"}</div>
            </div>
            <button
              className="sa-btn ghost"
              onClick={() => navigate("wiki", { slug: p.slug })}
            >
              Ver documentación →
            </button>
          </div>
        ))}

        {planned.map((x) => (
          <div className="sa-wiki-card muted" key={x.name}>
            <div className="sa-wiki-card-main">
              <div className="sa-name">{x.name}</div>
              <div className="sa-cat">{x.type}</div>
            </div>
            <span className="sa-pill soon">Próximamente</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function WikiPage({ navigate, params }) {
  if (!params.slug) return <WikiIndex navigate={navigate} />;

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

  const hasDl = hasDownload(p.slug);
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
        {hasDl ? (
          <>
            <a
              className="sa-btn accent block sa-download"
              href={p.downloadUrl}
              download
            >
              ⬇ Descargar {p.name} v{p.version}
            </a>
            <p className="sa-muted" style={{ fontSize: 12, marginTop: 8 }}>
              Ya tienes acceso: activaste la descarga con tu correo.
            </p>
          </>
        ) : (
          <>
            <button className="sa-btn accent block" onClick={() => navigate("product", { slug: p.slug })}>
              Obtener gratis (0 pesos)
            </button>
            <p className="sa-muted" style={{ fontSize: 12, marginTop: 8 }}>
              Deja tu correo en la ficha del producto para activar la descarga.
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
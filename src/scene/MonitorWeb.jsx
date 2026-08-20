import { useEffect, useState } from "react";
import { site } from "../data/site.js";
import {
  products,
  categories,
  categoryName,
  productBySlug,
} from "../data/products.js";
import { services } from "../data/services.js";
import { projects } from "../data/projects.js";

// Representación LIGERA y NO interactiva de la última página de la web SURGIR
// que se proyecta en la pantalla del PC 3D. Evita montar una segunda instancia
// completa de la aplicación: la pantalla muestra la vista actual (ruta, página,
// categoría) sincronizada por hash, y el click en el monitor abre la app real.
function parseRoute() {
  const raw = window.location.hash.replace(/^#/, "") || "/";
  const [pathPart, queryPart] = raw.split("?");
  const segs = pathPart.split("/").filter(Boolean);
  const params = new URLSearchParams(queryPart || "");
  if (segs.length === 0 || segs[0] === "home") return { page: "home", params };
  return { page: segs[0], slug: segs[1], params };
}

export default function MonitorWeb() {
  const [route, setRoute] = useState(parseRoute);
  useEffect(() => {
    const onHash = () => setRoute(parseRoute());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const { page, slug, params } = route;
  const product = slug ? productBySlug(slug) : null;

  const renderContent = () => {
    switch (page) {
      case "shop": {
        const cat = params.get("category");
        const list = cat
          ? products.filter((x) => x.category === cat)
          : products;
        return (
          <>
            <div className="mw-h1">Tienda</div>
            <div className="mw-chips">
              {categories.slice(0, 4).map((c) => (
                <span
                  key={c.slug}
                  className={`mw-chip ${cat === c.slug ? "active" : ""}`}
                >
                  {c.name}
                </span>
              ))}
            </div>
            <div className="mw-cards">
              {list.map((x) => (
                <div key={x.id} className="mw-card">
                  <div className="mw-card-icon">{x.icon}</div>
                  <div className="mw-card-name">{x.name}</div>
                  <div className="mw-card-cat">{categoryName(x.category)}</div>
                </div>
              ))}
            </div>
          </>
        );
      }
      case "product":
        return product ? (
          <>
            <div className="mw-h1">{product.name}</div>
            <div className="mw-meta">
              {categoryName(product.category)} · {product.status} · v
              {product.version}
            </div>
            <div className="mw-p">{product.tagline}</div>
            <ul className="mw-list">
              {product.features.slice(0, 4).map((f, i) => (
                <li key={i}>{f}</li>
              ))}
            </ul>
            <div className="mw-btn">Descargar</div>
          </>
        ) : (
          <div className="mw-h1">Producto</div>
        );
      case "wiki": {
        const docs = products.filter((x) => x.wiki);
        if (slug && product) {
          return (
            <>
              <div className="mw-h1">Wiki</div>
              <div className="mw-bread">
                Documentación → <b>{product.name}</b>
              </div>
              <div className="mw-p">{product.wiki.what}</div>
              {(product.wiki.config || []).slice(0, 3).map((c, i) => (
                <div key={i} className="mw-line">
                  {c}
                </div>
              ))}
            </>
          );
        }
        return (
          <>
            <div className="mw-h1">Wiki</div>
            <div className="mw-bread">Documentación</div>
            {docs.map((x) => (
              <div key={x.id} className="mw-row">
                <span>
                  {x.icon} {x.name}
                </span>
                <span className="mw-pill">Doc</span>
              </div>
            ))}
          </>
        );
      }
      case "services":
        return (
          <>
            <div className="mw-h1">Servicios</div>
            {services.map((s) => (
              <div key={s.id} className="mw-card">
                <div className="mw-card-name">{s.title}</div>
                <div className="mw-card-cat">{s.tagline}</div>
              </div>
            ))}
          </>
        );
      case "projects":
        return (
          <>
            <div className="mw-h1">Proyectos</div>
            {projects.map((x) => (
              <div key={x.id} className="mw-row">
                <span>
                  <b>{x.name}</b>
                  <span className="mw-card-cat"> · {x.type}</span>
                </span>
                <span className="mw-pill">{x.status}</span>
              </div>
            ))}
          </>
        );
      case "about":
        return (
          <>
            <div className="mw-h1">SurgirStudio</div>
            <div className="mw-p">
              Estudio digital que ofrece soluciones técnicas para Servidores de
              Minecraft, Aplicaciones web, desarrollo de automatizaciones
              conformes a tu objetivo y resultados listos para producción.
            </div>
          </>
        );
      case "contact":
        return (
          <>
            <div className="mw-h1">Contacto</div>
            <div className="mw-field" />
            <div className="mw-field" />
            <div className="mw-field tall" />
            <div className="mw-btn">Enviar</div>
          </>
        );
      case "settings":
        return (
          <>
            <div className="mw-h1">Configuraciones</div>
            <div className="mw-chips">
              <span className="mw-chip active">Sistema</span>
              <span className="mw-chip">Claro</span>
              <span className="mw-chip">Oscuro</span>
            </div>
          </>
        );
      case "notfound":
        return <div className="mw-h1">No encontrada</div>;
      case "home":
      default:
        return (
          <>
            <div className="mw-kicker">Experiencia SURGIR</div>
            <div className="mw-h1">{site.name}</div>
            <div className="mw-p">{site.tagline}.</div>
            <div className="mw-cards">
              {services.map((s) => (
                <div key={s.id} className="mw-card">
                  <div className="mw-card-name">{s.title}</div>
                  <div className="mw-card-cat">{s.tagline}</div>
                </div>
              ))}
            </div>
          </>
        );
    }
  };

  return (
    <div className="mw">
      <div className="mw-bar">
        <span className="mw-bar-l">Contacto</span>
        <b className="mw-bar-c">{site.shortName}</b>
        <span className="mw-bar-r">Categorías ▾</span>
      </div>
      <div className="mw-body">{renderContent()}</div>
    </div>
  );
}
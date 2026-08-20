import { useEffect, useState } from "react";
import { site } from "../data/site.js";
import { categories } from "../data/products.js";
import HomePage from "./pages/HomePage.jsx";
import StorePage from "./pages/StorePage.jsx";
import ProductDetailPage from "./pages/ProductDetailPage.jsx";
import ServicesPage from "./pages/ServicesPage.jsx";
import ProjectsPage from "./pages/ProjectsPage.jsx";
import AboutPage from "./pages/AboutPage.jsx";
import ContactPage from "./pages/ContactPage.jsx";
import WikiPage from "./pages/WikiPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";
import "./store.css";

const NAV = [
  { id: "home", label: "Inicio" },
  { id: "shop", label: "Tienda" },
  { id: "services", label: "Servicios" },
  { id: "projects", label: "Proyectos" },
  { id: "about", label: "Sobre" },
  { id: "contact", label: "Contacto" },
];

// Routing por hash: URLs directas (/#/store, /#/product/surgir-entregas, …)
// que funcionan al recargar gracias al SPA fallback de Netlify.
function parseHash() {
  const raw = window.location.hash.replace(/^#/, "") || "/";
  const [pathPart, queryPart] = raw.split("?");
  const segs = pathPart.split("/").filter(Boolean);
  const params = {};
  if (queryPart) {
    new URLSearchParams(queryPart).forEach((v, k) => {
      params[k] = v;
    });
  }
  if (segs.length === 0 || segs[0] === "home") return { page: "home", params };
  switch (segs[0]) {
    case "store":
      return { page: "shop", params };
    case "product":
      return { page: "product", params: { ...params, slug: segs[1] } };
    case "wiki":
      return { page: "wiki", params: { ...params, slug: segs[1] } };
    case "services":
      return { page: "services", params };
    case "projects":
      return { page: "projects", params };
    case "about":
      return { page: "about", params };
    case "contact":
      return { page: "contact", params };
    default:
      return { page: "notfound", params };
  }
}

function pathFor(page, params = {}) {
  switch (page) {
    case "shop": {
      const qs = [];
      if (params.q) qs.push(`q=${encodeURIComponent(params.q)}`);
      if (params.category) qs.push(`category=${encodeURIComponent(params.category)}`);
      return "#/store" + (qs.length ? `?${qs.join("&")}` : "");
    }
    case "product":
      return `#/product/${params.slug}`;
    case "wiki":
      return `#/wiki/${params.slug}`;
    case "services":
      return "#/services";
    case "projects":
      return "#/projects";
    case "about":
      return "#/about";
    case "contact":
      return "#/contact";
    case "notfound":
      return "#/notfound";
    default:
      return "#/";
  }
}

function StoreAppInner({ storeId }) {
  const [route, setRoute] = useState(parseHash);
  const [search, setSearch] = useState("");
  // Menú móvil (hamburguesa). `leaving` mantiene montado el panel durante la
  // animación de cierre; el botón ☰ se transforma en ✕ vía CSS.
  const [menu, setMenu] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [catOpen, setCatOpen] = useState(false);

  // Sincronizar con el hash (botones atrás/adelante y recargas).
  useEffect(() => {
    const onHash = () => setRoute(parseHash());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const navigate = (page, params = {}) => {
    const hash = pathFor(page, params);
    if (window.location.hash === hash) setRoute(parseHash());
    else window.location.hash = hash;
    const el = document.querySelector(".sa-content");
    if (el) el.scrollTop = 0;
  };

  const go = (page, params = {}) => {
    closeMenu();
    navigate(page, params);
  };

  const openMenu = () => {
    setLeaving(false);
    setMenu(true);
  };

  const closeMenu = () => {
    if (!menu) return;
    setLeaving(true);
    setTimeout(() => {
      setMenu(false);
      setLeaving(false);
      setCatOpen(false);
    }, 200);
  };

  const renderPage = () => {
    const props = { navigate, params: route.params, storeId };
    switch (route.page) {
      case "shop":
        return <StorePage {...props} />;
      case "product":
        return <ProductDetailPage {...props} />;
      case "wiki":
        return <WikiPage {...props} />;
      case "services":
        return <ServicesPage {...props} />;
      case "projects":
        return <ProjectsPage {...props} />;
      case "about":
        return <AboutPage {...props} />;
      case "contact":
        return <ContactPage {...props} />;
      case "notfound":
        return <NotFoundPage {...props} />;
      case "home":
      default:
        return <HomePage {...props} />;
    }
  };

  const onSearch = () => {
    const q = search.trim();
    if (q) go("shop", { q });
  };

  return (
    <div className="surgir-app">
      <div className="sa-nav">
        <button
          className={`sa-burger ${menu || leaving ? "open" : ""}`}
          aria-label={menu ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={menu}
          onClick={menu || leaving ? closeMenu : openMenu}
        >
          <span />
          <span />
          <span />
        </button>

        <div
          className="sa-logo"
          onClick={() => go("home")}
          role="link"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && go("home")}
        >
          {site.name}
          <span className="sa-logo-dot">◆</span>
        </div>

        <div className="sa-links">
          {NAV.map((n) => (
            <span
              key={n.id}
              className={`sa-link ${route.page === n.id ? "active" : ""}`}
              onClick={() => navigate(n.id)}
            >
              {n.label}
            </span>
          ))}
        </div>
        <span className="sa-spacer" />
        <input
          className="sa-search"
          placeholder="Buscar..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onSearch()}
        />
        <button className="sa-mobile-contact" onClick={() => go("contact")}>
          Contacto
        </button>
      </div>

      {/* Menú móvil: panel deslizante con navegación priorizada. Solo visible
          en mobile/tablet (CSS); en desktop no se renderiza por encima. */}
      {(menu || leaving) && (
        <div className={`sa-mmenu ${leaving ? "leaving" : ""}`} role="dialog" aria-modal="true">
          <div className="sa-mmenu-inner">
            <div className="sa-mmenu-search">
              <input
                className="sa-search"
                placeholder="Buscar en la tienda..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && onSearch()}
              />
            </div>

            <div className="sa-mmenu-group">
              <button className="sa-mmenu-item" onClick={() => go("home")}>
                Inicio
              </button>
              <button className="sa-mmenu-item" onClick={() => go("about")}>
                SurgirStudio
              </button>
              <button className="sa-mmenu-item" onClick={() => go("contact")}>
                Contacto
              </button>
            </div>

            <div className="sa-mmenu-group">
              <button
                className="sa-mmenu-item sa-mmenu-cat"
                aria-expanded={catOpen}
                onClick={() => setCatOpen((o) => !o)}
              >
                <span>Categorías</span>
                <span className={`sa-mmenu-caret ${catOpen ? "open" : ""}`}>▸</span>
              </button>
              {catOpen && (
                <div className="sa-mmenu-sublist">
                  {categories.map((c) => (
                    <button
                      key={c.slug}
                      className="sa-mmenu-sub"
                      onClick={() => go("shop", { category: c.slug })}
                    >
                      {c.name}
                    </button>
                  ))}
                  <button className="sa-mmenu-sub" onClick={() => go("services")}>
                    Servicios
                  </button>
                  <button className="sa-mmenu-sub" onClick={() => go("projects")}>
                    Proyectos
                  </button>
                </div>
              )}
            </div>

            <button className="sa-mmenu-close" onClick={closeMenu}>
              Cerrar
            </button>
          </div>
        </div>
      )}

      <div className="sa-content">{renderPage()}</div>

      <div className="sa-footer">
        <div>
          <b>{site.name}</b>
          <a onClick={() => go("about")}>Sobre SurgirStudio</a>
          <a onClick={() => go("projects")}>Proyectos</a>
        </div>
        <div>
          <b>Explorar</b>
          <a onClick={() => go("shop")}>Tienda</a>
          <a onClick={() => go("services")}>Servicios</a>
          <a onClick={() => go("contact")}>Contacto</a>
        </div>
        <div className="sa-foot-brand">
          © {new Date().getFullYear()} {site.name} · {site.author}. Todos los
          derechos reservados.
        </div>
      </div>
    </div>
  );
}

export default function StoreApp({ storeId = "surgir" }) {
  return <StoreAppInner storeId={storeId} />;
}
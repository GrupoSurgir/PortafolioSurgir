import { useEffect, useRef, useState } from "react";
import { site } from "../data/site.js";
import HomePage from "./pages/HomePage.jsx";
import StorePage from "./pages/StorePage.jsx";
import ProductDetailPage from "./pages/ProductDetailPage.jsx";
import ServicesPage from "./pages/ServicesPage.jsx";
import ProjectsPage from "./pages/ProjectsPage.jsx";
import AboutPage from "./pages/AboutPage.jsx";
import ContactPage from "./pages/ContactPage.jsx";
import WikiPage from "./pages/WikiPage.jsx";
import SettingsPage from "./pages/SettingsPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";
import "./store.css";

const THEME_KEY = "surgir-theme";

// Opciones principales: siempre visibles arriba (PC y móvil).
const NAV = [
  { id: "home", label: "Inicio" },
  { id: "about", label: "SurgirStudio" },
  { id: "contact", label: "Contacto" },
];

// El resto vive dentro de "Categorías" (mismo concepto en PC y móvil).
const CATEGORIES = [
  { id: "shop", label: "Tienda", icon: "🛒" },
  { id: "wiki", label: "Wiki", icon: "📚" },
  { id: "settings", label: "Configuraciones", icon: "⚙️" },
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
    case "settings":
      return { page: "settings", params };
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
      return params.slug ? `#/wiki/${params.slug}` : "#/wiki";
    case "services":
      return "#/services";
    case "projects":
      return "#/projects";
    case "about":
      return "#/about";
    case "contact":
      return "#/contact";
    case "settings":
      return "#/settings";
    case "notfound":
      return "#/notfound";
    default:
      return "#/";
  }
}

function systemPrefersDark() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  );
}

function StoreAppInner({ storeId, onExit }) {
  const [route, setRoute] = useState(parseHash);
  // Menú móvil (hamburguesa). `leaving` mantiene montado el panel durante la
  // animación de cierre; el botón ☰ se transforma en ✕ vía CSS.
  const [menu, setMenu] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [catOpen, setCatOpen] = useState(false);
  // Panel "Categorías" del desktop (se cierra al pulsar fuera / Escape).
  const [catMenu, setCatMenu] = useState(false);
  const catRef = useRef(null);
  // Ref del estado del menú para handlers con ciclo de vida largo (Escape).
  const menuRef = useRef(false);
  useEffect(() => {
    menuRef.current = menu;
  }, [menu]);
  // Preferencia de apariencia: "system" | "light" | "dark" (persistida).
  const [theme, setTheme] = useState(
    () => localStorage.getItem(THEME_KEY) || "system"
  );
  const [systemDark, setSystemDark] = useState(systemPrefersDark);

  // Seguir el tema del sistema cuando la preferencia es "system".
  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = (e) => setSystemDark(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // Persistir la preferencia de tema.
  useEffect(() => {
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  const effectiveTheme =
    theme === "system" ? (systemDark ? "dark" : "light") : theme;

  // Sincronizar con el hash (botones atrás/adelante y recargas).
  useEffect(() => {
    const onHash = () => setRoute(parseHash());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  // Cerrar paneles al pulsar fuera o con Escape.
  useEffect(() => {
    const onDown = (e) => {
      if (catRef.current && !catRef.current.contains(e.target)) setCatMenu(false);
    };
    const onKey = (e) => {
      if (e.key === "Escape") {
        setCatMenu(false);
        closeMenu();
      }
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const navigate = (page, params = {}) => {
    setCatMenu(false);
    const hash = pathFor(page, params);
    if (window.location.hash === hash) setRoute(parseHash());
    else window.location.hash = hash;
    const app = document.querySelector(".surgir-app");
    if (app) app.scrollTop = 0;
  };

  const go = (page, params = {}) => {
    closeMenu();
    navigate(page, params);
  };

  const goBack = () => {
    closeMenu();
    // El botón "Regresar" vuelve a la experiencia 3D (no al historial externo).
    if (onExit) {
      onExit();
      return;
    }
    if (window.history.length > 1) window.history.back();
    else go("home");
  };

  const openMenu = () => {
    setLeaving(false);
    setMenu(true);
  };

  const closeMenu = () => {
    if (!menuRef.current) return;
    setLeaving(true);
    setTimeout(() => {
      setMenu(false);
      setLeaving(false);
      setCatOpen(false);
    }, 200);
  };

  const renderPage = () => {
    const props = {
      navigate,
      params: route.params,
      storeId,
      theme,
      onTheme: setTheme,
    };
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
      case "settings":
        return <SettingsPage {...props} />;
      case "notfound":
        return <NotFoundPage {...props} />;
      case "home":
      default:
        return <HomePage {...props} />;
    }
  };

  return (
    <div className="surgir-app" data-theme={effectiveTheme}>
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

        <button className="sa-nav-back" onClick={goBack} aria-label="Regresar">
          <span className="sa-nav-back-icon">←</span>
          <span className="sa-nav-back-label">Regresar</span>
        </button>

        <div
          className="sa-logo"
          onClick={() => go("home")}
          role="link"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && go("home")}
        >
          {site.shortName}
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

        <div className="sa-catmenu" ref={catRef}>
          <button
            className={`sa-link sa-cat-btn ${catMenu ? "active" : ""}`}
            aria-expanded={catMenu}
            aria-haspopup="true"
            onClick={() => setCatMenu((o) => !o)}
          >
            Categorías
            <span className={`sa-cat-caret ${catMenu ? "open" : ""}`}>▾</span>
          </button>
          {catMenu && (
            <div className="sa-dropdown" role="menu">
              {CATEGORIES.map((c) => (
                <button
                  key={c.id}
                  className="sa-drop-item"
                  role="menuitem"
                  onClick={() => {
                    setCatMenu(false);
                    go(c.id);
                  }}
                >
                  <span className="sa-drop-icon">{c.icon}</span>
                  {c.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <button className="sa-mobile-contact" onClick={() => go("contact")}>
          Contacto
        </button>
      </div>

      {/* Menú móvil: mismo concepto que el desktop (opciones principales +
          Categorías). Solo visible en mobile/tablet (CSS). */}
      {(menu || leaving) && (
        <div
          className={`sa-mmenu ${leaving ? "leaving" : ""}`}
          role="dialog"
          aria-modal="true"
        >
          <div className="sa-mmenu-inner">
            <div className="sa-mmenu-head">
              <b>{site.name}</b>
              <button
                className="sa-mmenu-close-x"
                onClick={closeMenu}
                aria-label="Cerrar menú"
              >
                ✕
              </button>
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
                  {CATEGORIES.map((c) => (
                    <button
                      key={c.id}
                      className="sa-mmenu-sub"
                      onClick={() => go(c.id)}
                    >
                      <span className="sa-drop-icon">{c.icon}</span>
                      {c.label}
                    </button>
                  ))}
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

export default function StoreApp({ storeId = "surgir", onExit }) {
  return <StoreAppInner storeId={storeId} onExit={onExit} />;
}
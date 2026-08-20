import { useEffect, useState } from "react";
import { site } from "../data/site.js";
import { useCart } from "../hooks/useCart.jsx";
import { usePayments } from "./PaymentsContext.jsx";
import { useAuth } from "./AuthContext.jsx";
import { useOrders } from "./OrdersContext.jsx";
import HomePage from "./pages/HomePage.jsx";
import StorePage from "./pages/StorePage.jsx";
import ProductDetailPage from "./pages/ProductDetailPage.jsx";
import ServicesPage from "./pages/ServicesPage.jsx";
import ProjectsPage from "./pages/ProjectsPage.jsx";
import AboutPage from "./pages/AboutPage.jsx";
import ContactPage from "./pages/ContactPage.jsx";
import CartPage from "./pages/CartPage.jsx";
import CheckoutPage from "./pages/CheckoutPage.jsx";
import AccountPage from "./pages/AccountPage.jsx";
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
  { id: "account", label: "Cuenta" },
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
    case "account":
      return { page: "account", params };
    case "cart":
      return { page: "cart", params };
    case "checkout":
      return { page: "checkout", params };
    default:
      return { page: "notfound", params };
  }
}

function pathFor(page, params = {}) {
  switch (page) {
    case "shop":
      return "#/store" + (params.q ? `?q=${encodeURIComponent(params.q)}` : "");
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
    case "account":
      return "#/account";
    case "cart":
      return "#/cart";
    case "checkout":
      return "#/checkout";
    case "notfound":
      return "#/notfound";
    default:
      return "#/";
  }
}

function StoreAppInner({ storeId }) {
  usePayments();
  const cart = useCart();
  const auth = useAuth();
  const orders = useOrders();
  const [route, setRoute] = useState(parseHash);
  const [search, setSearch] = useState("");

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

  const renderPage = () => {
    const props = { navigate, cart, params: route.params, auth, orders, storeId };
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
      case "cart":
        return <CartPage {...props} />;
      case "checkout":
        return <CheckoutPage {...props} />;
      case "account":
        return <AccountPage {...props} />;
      case "notfound":
        return <NotFoundPage {...props} />;
      case "home":
      default:
        return <HomePage {...props} />;
    }
  };

  const onSearch = () => {
    const q = search.trim();
    if (q) navigate("shop", { q });
  };

  return (
    <div className="surgir-app">
      <div className="sa-nav">
        <div className="sa-logo" onClick={() => navigate("home")}>
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
        <button
          className="sa-account-btn"
          title={auth.user ? "Mi cuenta" : "Iniciar sesión"}
          onClick={() => navigate("account")}
        >
          {auth.user ? (
            <span className="sa-avatar sm">
              {auth.user.avatar ? (
                <img className="sa-avatar-img" src={auth.user.avatar} alt="" />
              ) : (
                auth.user.name.charAt(0)
              )}
            </span>
          ) : (
            "Cuenta"
          )}
        </button>
        <button className="sa-cart-btn" onClick={() => navigate("cart")}>
          Carrito {cart.count > 0 && <span className="sa-cart-count">{cart.count}</span>}
        </button>
      </div>

      <div className="sa-content">{renderPage()}</div>

      <div className="sa-footer">
        <div>
          <b>{site.name}</b>
          <a onClick={() => navigate("about")}>Sobre SurgirStudio</a>
          <a onClick={() => navigate("projects")}>Proyectos</a>
        </div>
        <div>
          <b>Explorar</b>
          <a onClick={() => navigate("shop")}>Tienda</a>
          <a onClick={() => navigate("services")}>Servicios</a>
          <a onClick={() => navigate("contact")}>Contacto</a>
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
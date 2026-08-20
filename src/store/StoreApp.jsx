import { useState } from "react";
import { site } from "../data/site.js";
import { useCart } from "../hooks/useCart.jsx";
import { usePayments } from "./PaymentsContext.jsx";
import HomePage from "./pages/HomePage.jsx";
import StorePage from "./pages/StorePage.jsx";
import ProductDetailPage from "./pages/ProductDetailPage.jsx";
import ServicesPage from "./pages/ServicesPage.jsx";
import ProjectsPage from "./pages/ProjectsPage.jsx";
import AboutPage from "./pages/AboutPage.jsx";
import ContactPage from "./pages/ContactPage.jsx";
import CartPage from "./pages/CartPage.jsx";
import CheckoutPage from "./pages/CheckoutPage.jsx";
import "./store.css";

const NAV = [
  { id: "home", label: "Inicio" },
  { id: "shop", label: "Tienda" },
  { id: "services", label: "Servicios" },
  { id: "projects", label: "Proyectos" },
  { id: "about", label: "Sobre" },
  { id: "contact", label: "Contacto" },
];

function StoreAppInner() {
  usePayments();
  const cart = useCart();
  const [route, setRoute] = useState({ page: "home", params: {} });
  const [search, setSearch] = useState("");

  const navigate = (page, params = {}) => {
    setRoute({ page, params });
    const el = document.querySelector(".sa-content");
    if (el) el.scrollTop = 0;
  };

  const renderPage = () => {
    const props = { navigate, cart, params: route.params };
    switch (route.page) {
      case "shop":
        return <StorePage {...props} />;
      case "product":
        return <ProductDetailPage {...props} />;
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
        <button className="sa-cart-btn" onClick={() => navigate("cart")}>
          Carrito {cart.count > 0 && <span className="sa-cart-count">{cart.count}</span>}
        </button>
      </div>

      <div className="sa-content">{renderPage()}</div>

      <div className="sa-footer">
        <div>
          <b>SURGIR</b>
          <a onClick={() => navigate("about")}>Sobre SURGIR</a>
          <a onClick={() => navigate("projects")}>Proyectos</a>
        </div>
        <div>
          <b>Explorar</b>
          <a onClick={() => navigate("shop")}>Tienda</a>
          <a onClick={() => navigate("services")}>Servicios</a>
          <a onClick={() => navigate("contact")}>Contacto</a>
        </div>
        <div className="sa-foot-brand">
          © {new Date().getFullYear()} {site.name}. Todos los derechos reservados.
        </div>
      </div>
    </div>
  );
}

export default function StoreApp() {
  return <StoreAppInner />;
}
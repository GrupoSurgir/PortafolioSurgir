import { site } from "../../data/site.js";
import { services } from "../../data/services.js";
import { featuredProducts, categories } from "../../data/products.js";
import { ProductCard } from "../ui.jsx";

export default function HomePage({ navigate }) {
  return (
    <div className="sa-wrap">
      <div className="sa-hero">
        <p className="sa-kicker">Experiencia SURGIR</p>
        <h1>{site.name}</h1>
        <p>
          {site.tagline}. El estudio digital de Samuel Buritica: soluciones
          técnicas para el ecosistema Minecraft y la web, desarrolladas con
          criterio y listas para producción.
        </p>
        <div className="sa-cta-row">
          <button className="sa-btn accent" onClick={() => navigate("shop")}>
            Explorar tienda
          </button>
          <button className="sa-btn ghost" onClick={() => navigate("services")}>
            Ver servicios
          </button>
        </div>
      </div>

      <h2 className="sa-h2">Qué hacemos</h2>
      <div className="sa-cards" style={{ marginTop: 14 }}>
        {services.map((s) => (
          <div key={s.id} className="sa-service">
            <h3>{s.title}</h3>
            {s.tagline && <div className="sa-tagline">{s.tagline}</div>}
            <p>{s.description}</p>
            <button
              className="sa-btn ghost block"
              onClick={() => navigate("services")}
            >
              Ver servicios
            </button>
          </div>
        ))}
      </div>

      <h2 className="sa-h2">Descargas gratis</h2>
      <div className="sa-grid">
        {featuredProducts.map((p) => (
          <ProductCard
            key={p.slug}
            p={p}
            onOpen={(s) => navigate("product", { slug: s })}
          />
        ))}
      </div>

      <h2 className="sa-h2">Categorías</h2>
      <div className="sa-filters">
        {categories.map((c) => (
          <button
            key={c.slug}
            className="sa-chip"
            onClick={() => navigate("shop", { category: c.slug })}
          >
            {c.name}
          </button>
        ))}
      </div>
    </div>
  );
}
import { site } from "../../data/site.js";
import { featuredProducts, categories } from "../../data/products.js";
import { ProductCard } from "../ui.jsx";

export default function HomePage({ navigate }) {
  return (
    <div className="sa-wrap">
      <div className="sa-hero">
        <p className="sa-kicker">Experiencia SURGIR</p>
        <h1>{site.name}</h1>
        <p>
          {site.tagline}. Plugins, sistemas e integraciones para servidores
          Minecraft, aplicaciones web y automatización. Productos sobrios,
          técnicos y listos para producción.
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
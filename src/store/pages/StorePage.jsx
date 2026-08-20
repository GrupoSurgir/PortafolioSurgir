import { useEffect, useMemo, useState } from "react";
import { products, categories, categoryName } from "../../data/products.js";
import { ProductCard } from "../ui.jsx";

export default function StorePage({ navigate, params }) {
  const [selected, setSelected] = useState(params.category || "all");
  const [q, setQ] = useState(params.q || "");

  // Sincronizar filtros cuando llegan por URL (menú mobile / enlaces directos).
  useEffect(() => {
    setSelected(params.category || "all");
    setQ(params.q || "");
  }, [params.category, params.q]);

  const list = useMemo(() => {
    const t = q.trim().toLowerCase();
    return products.filter((p) => {
      const byCat = selected === "all" || p.category === selected;
      if (!byCat) return false;
      if (!t) return true;
      return (
        p.name.toLowerCase().includes(t) ||
        p.tagline.toLowerCase().includes(t) ||
        p.description.toLowerCase().includes(t) ||
        categoryName(p.category).toLowerCase().includes(t)
      );
    });
  }, [selected, q]);

  // Los productos de personalización abren el Workplace Builder (3D) en su
  // slot correspondiente; el resto abre la ficha de producto.
  const openProduct = (slug) => {
    const p = products.find((x) => x.slug === slug);
    if (p && p.category === "personalizacion") {
      navigate("builder", { slot: p.slot, product: slug });
    } else {
      navigate("product", { slug });
    }
  };

  return (
    <div className="sa-wrap">
      <h1 className="sa-h1">Tienda</h1>
      <p className="sa-lead">
        Plugins, recursos, herramientas y personalización de tu puesto. Precios
        en USD.
      </p>

      {selected === "personalizacion" && (
        <div className="sa-perso-banner">
          <div>
            <div className="sa-perso-title">🖥️ PERSONALIZA TU PUESTO</div>
            <p className="sa-perso-desc">
              Arma tu espacio de trabajo en 3D: pantallas, PC, teclado, mouse y
              aro de luz. Todo en tiempo real, sin comprar nada todavía.
            </p>
          </div>
          <button
            className="sa-btn accent"
            onClick={() => navigate("builder")}
          >
            Personalizar mi puesto →
          </button>
        </div>
      )}

      <div className="sa-filters">
        <button
          className={`sa-chip ${selected === "all" ? "active" : ""}`}
          onClick={() => setSelected("all")}
        >
          Todos
        </button>
        {categories.map((c) => (
          <button
            key={c.slug}
            className={`sa-chip ${selected === c.slug ? "active" : ""}`}
            onClick={() => setSelected(c.slug)}
          >
            {c.name}
          </button>
        ))}
      </div>

      <input
        className="sa-search"
        style={{ width: "100%", maxWidth: 360, marginBottom: 18 }}
        placeholder="Buscar productos..."
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />

      {list.length === 0 ? (
        <div className="sa-empty">
          No hay productos que coincidan con tu búsqueda.
        </div>
      ) : (
        <div className="sa-grid">
          {list.map((p) => (
            <ProductCard key={p.slug} p={p} onOpen={openProduct} />
          ))}
        </div>
      )}
    </div>
  );
}
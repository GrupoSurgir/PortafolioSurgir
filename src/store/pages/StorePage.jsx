import { useMemo, useState } from "react";
import { products, categories, categoryName } from "../../data/products.js";
import { ProductCard } from "../ui.jsx";

export default function StorePage({ navigate, params }) {
  const [selected, setSelected] = useState(params.category || "all");
  const [q, setQ] = useState(params.q || "");

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

  return (
    <div className="sa-wrap">
      <h1 className="sa-h1">Tienda</h1>
      <p className="sa-lead">
        Plugins, recursos y herramientas de SURGIR. Precios en USD.
      </p>

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
            <ProductCard
              key={p.slug}
              p={p}
              onOpen={(s) => navigate("product", { slug: s })}
            />
          ))}
        </div>
      )}
    </div>
  );
}
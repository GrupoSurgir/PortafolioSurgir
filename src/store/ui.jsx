import { categoryName } from "../data/products.js";

// Componentes UI compartidos de la aplicación SURGIR.

export function StatusPill({ status }) {
  const cls =
    status === "EN DESARROLLO" ||
    status === "Próximamente" ||
    status === "En preparación"
      ? "soon"
      : status === "ACTIVO" || status === "Disponible"
      ? ""
      : "off";
  return <span className={`sa-pill ${cls}`}>{status}</span>;
}

export function ProductCard({ p, onOpen }) {
  const unavailable = p.status === "Próximamente" || p.status === "En preparación";
  const free = p.price === 0;
  const perso = p.category === "personalizacion";
  return (
    <div className="sa-card" onClick={() => onOpen(p.slug)}>
      <div className="sa-icon">{p.icon || p.name.charAt(0)}</div>
      <div className="sa-name">{p.name}</div>
      <div className="sa-cat">{categoryName(p.category)}</div>
      <p className="sa-desc">{p.shortDescription || p.tagline}</p>
      <div className="sa-price-row">
        <span className="sa-price">{free ? "Gratis" : `$${p.price}`}</span>
        <StatusPill status={p.status} />
      </div>
      <button
        className="sa-btn ghost block"
        disabled={unavailable}
        onClick={(e) => {
          e.stopPropagation();
          onOpen(p.slug);
        }}
      >
        {unavailable
          ? "Próximamente"
          : perso
          ? "Personalizar →"
          : free
          ? "Descargar gratis"
          : "Ver producto"}
      </button>
    </div>
  );
}

export function SectionHeader({ title, lead }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <h1 className="sa-h1">{title}</h1>
      {lead && <p className="sa-lead">{lead}</p>}
    </div>
  );
}
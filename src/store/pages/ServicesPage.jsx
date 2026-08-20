import { services } from "../../data/services.js";

export default function ServicesPage({ navigate }) {
  return (
    <div className="sa-wrap">
      <h1 className="sa-h1">Servicios</h1>
      <p className="sa-lead">
        Desarrollo a medida de plugins, integraciones, sistemas, automatización
        y aplicaciones web. Precios, plazos y alcance se acuerdan según el
        proyecto.
      </p>

      <div className="sa-cards" style={{ marginTop: 20 }}>
        {services.map((s) => (
          <div key={s.id} className="sa-service">
            <h3>{s.title}</h3>
            <p>{s.description}</p>
            <ul className="sa-features" style={{ marginTop: 10 }}>
              {s.features.map((f, i) => (
                <li key={i}>{f}</li>
              ))}
            </ul>
            <div className="sa-from">Desde: {s.priceFrom}</div>
            <button
              className="sa-btn ghost block"
              onClick={() => navigate("contact")}
            >
              Solicitar desarrollo
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
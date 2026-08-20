import { projects } from "../../data/projects.js";
import { StatusPill } from "../ui.jsx";

export default function ProjectsPage({ navigate }) {
  return (
    <div className="sa-wrap">
      <h1 className="sa-h1">Proyectos</h1>
      <p className="sa-lead">
        Proyectos del ecosistema SURGIR: sistemas, plugins y aplicaciones
        construidas por SurgirStudio.
      </p>

      <div className="sa-cards" style={{ marginTop: 20 }}>
        {projects.map((p) => (
          <div
            key={p.id}
            className={`sa-project${p.experimental ? " experimental" : ""}`}
          >
            <div className="sa-name">{p.name}</div>
            <div className="sa-type">{p.type}</div>
            {p.tagline && <div className="sa-tagline">{p.tagline}</div>}
            <p style={{ marginTop: 8 }}>{p.description}</p>
            <div className="sa-foot">
              <span className="sa-cat">{p.year}</span>
              <StatusPill status={p.status} />
            </div>
            <button
              className="sa-btn ghost block"
              disabled={!p.route}
              onClick={() => p.route && navigate(p.route.page, p.route.params)}
            >
              {p.route ? `${p.routeLabel} →` : p.routeLabel}
            </button>
          </div>
        ))}
      </div>

      <p className="sa-project-note">
        Estos son los proyectos que estamos construyendo dentro de SURGIR.
        SurgirEntregas y SurgirMenu representan proyectos funcionales del
        ecosistema. SurgirAgente permanece en desarrollo mientras seguimos
        investigando cómo llevar una IA capaz de interactuar de forma natural
        dentro de Minecraft.
      </p>
    </div>
  );
}
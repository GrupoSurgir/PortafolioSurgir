import { projects } from "../../data/projects.js";
import { StatusPill } from "../ui.jsx";

export default function ProjectsPage() {
  return (
    <div className="sa-wrap">
      <h1 className="sa-h1">Proyectos</h1>
      <p className="sa-lead">
        Proyectos realizados por SurgirStudio dentro del ecosistema de plugins,
        sistemas y aplicaciones web.
      </p>

      <div className="sa-cards" style={{ marginTop: 20 }}>
        {projects.map((p) => (
          <div key={p.id} className="sa-project">
            <div className="sa-name">{p.name}</div>
            <div className="sa-type">{p.type}</div>
            <p style={{ marginTop: 8 }}>{p.description}</p>
            <div className="sa-foot">
              <span className="sa-cat">{p.year}</span>
              <StatusPill status={p.status} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
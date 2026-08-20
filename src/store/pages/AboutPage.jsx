import { site } from "../../data/site.js";

export default function AboutPage() {
  return (
    <div className="sa-wrap">
      <h1 className="sa-h1">Sobre SURGIR</h1>
      <p className="sa-lead">
        SURGIR es un estudio de desarrollo de herramientas digitales: plugins
        para servidores Minecraft, sistemas de integración, automatización e
        inteligencia artificial, y aplicaciones web con identidad propia.
      </p>

      <div className="sa-hero" style={{ marginTop: 22 }}>
        <p className="sa-kicker">Filosofía</p>
        <h2 className="sa-h2" style={{ marginTop: 4 }}>
          {site.tagline}
        </h2>
        <p>
          {site.description}
        </p>
      </div>

      <div className="sa-cards">
        <div className="sa-service">
          <h3>Enfoque técnico</h3>
          <p>
            Arquitectura limpia, código mantenible y rendimiento. Cada producto
            está pensado para integrarse con el ecosistema SURGIR.
          </p>
        </div>
        <div className="sa-service">
          <h3>Diseño sobrio</h3>
          <p>
            Sin ruido visual. Interfaces oscuras, funcionales y con espacio
            para respirar, coherentes con la identidad del estudio.
          </p>
        </div>
        <div className="sa-service">
          <h3>Listo para producción</h3>
          <p>
            Los proyectos se entregan probados, documentados y preparados para
            desplegarse en producción.
          </p>
        </div>
      </div>
    </div>
  );
}
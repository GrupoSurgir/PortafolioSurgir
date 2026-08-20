export default function NotFoundPage({ navigate }) {
  return (
    <div className="sa-wrap" style={{ textAlign: "center", paddingTop: 60 }}>
      <div className="sa-404">404</div>
      <h1 className="sa-h1">Sector no encontrado</h1>
      <p className="sa-lead">
        Esta ruta no existe en SurgirStudio. El sistema sigue funcionando: vuelve
        al inicio o explora la tienda.
      </p>
      <div className="sa-cta-row" style={{ justifyContent: "center" }}>
        <button className="sa-btn accent" onClick={() => navigate("home")}>
          Inicio
        </button>
        <button className="sa-btn ghost" onClick={() => navigate("shop")}>
          Tienda
        </button>
        <button className="sa-btn ghost" onClick={() => navigate("projects")}>
          Proyectos
        </button>
      </div>
    </div>
  );
}
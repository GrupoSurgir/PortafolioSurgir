const THEME_OPTIONS = [
  { value: "system", label: "Sistema" },
  { value: "light", label: "Claro" },
  { value: "dark", label: "Oscuro" },
];

export default function SettingsPage({ theme, onTheme }) {
  return (
    <div className="sa-wrap" style={{ maxWidth: 560 }}>
      <h1 className="sa-h1">Configuraciones</h1>
      <p className="sa-lead">Preferencias de la aplicación SURGIR.</p>

      <div className="sa-settings">
        <h3>Apariencia</h3>
        <p className="sa-muted">
          Elige el tema de la aplicación. "Sistema" sigue la configuración de tu
          dispositivo.
        </p>
        <div className="sa-theme-opts">
          {THEME_OPTIONS.map((o) => (
            <label
              key={o.value}
              className={`sa-theme-opt ${theme === o.value ? "active" : ""}`}
            >
              <input
                type="radio"
                name="theme"
                value={o.value}
                checked={theme === o.value}
                onChange={() => onTheme(o.value)}
              />
              <span className="sa-radio-dot" />
              {o.label}
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
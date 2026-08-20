import { useAuth } from "../AuthContext.jsx";

const PROVIDER_ICONS = {
  google: "G",
  discord: "D",
};

export default function AccountPage() {
  const { user, busy, signIn, signOut, providers, demo } = useAuth();

  if (!user) {
    return (
      <div className="sa-wrap" style={{ maxWidth: 640 }}>
        <h1 className="sa-h1">Cuenta</h1>
        <p className="sa-lead">
          Regístrate o inicia sesión para administrar tus descargas y
          contenido digital de SURGIR.
        </p>

        <div className="sa-auth-box">
          <button
            className="sa-auth-btn"
            onClick={() => signIn("google")}
            disabled={busy}
          >
            <span className="sa-auth-ico">{PROVIDER_ICONS.google}</span>
            Continuar con {providers.google.label}
          </button>
          <button
            className="sa-auth-btn"
            onClick={() => signIn("discord")}
            disabled={busy}
          >
            <span className="sa-auth-ico">{PROVIDER_ICONS.discord}</span>
            Continuar con {providers.discord.label}
          </button>
        </div>

        <p className="sa-muted" style={{ fontSize: 12, marginTop: 14 }}>
          {demo
            ? "Modo demostración: el inicio de sesión se simula. Para activar el registro real con Google o Discord, configura los OAuth en src/data/auth.js."
            : "Al continuar serás redirigido al proveedor para autorizar el acceso."}
        </p>
      </div>
    );
  }

  return (
    <div className="sa-wrap" style={{ maxWidth: 720 }}>
      <h1 className="sa-h1">Mi cuenta</h1>

      <div className="sa-profile">
        <div className="sa-avatar">{user.avatar || user.name.charAt(0)}</div>
        <div>
          <div className="sa-name-lg">{user.name}</div>
          <div className="sa-mini">
            {user.email} · vía {user.providerLabel || user.provider}
          </div>
        </div>
        <button className="sa-btn ghost" onClick={signOut}>
          Cerrar sesión
        </button>
      </div>

      <h2 className="sa-h2">Publicar contenido digital</h2>
      <p className="sa-lead">
        Así se publica un producto (plugin, recurso o archivo) en la web:
      </p>
      <ol className="sa-steps">
        <li>
          <b>Agrega el producto</b> en <code>src/data/products.js</code>{" "}
          (nombre, precio o <code>price: 0</code> para gratis, descripción,
          etiquetas).
        </li>
        <li>
          <b>Sube tu archivo</b> a <code>public/downloads/</code> y coloca su
          ruta en <code>downloadUrl</code> (ej:{" "}
          <code>/downloads/mi-archivo.zip</code>).
        </li>
        <li>
          <b>Compila y publica</b>: <code>npm run build</code> y luego{" "}
          <code>git push</code>. Netlify despliega automáticamente.
        </li>
        <li>
          <b>Cobra con pagos</b>: abre el engranaje ⚙ (Administración →
          Pagos), elige el proveedor y configura los métodos que aceptas.
        </li>
      </ol>

      <p className="sa-note" style={{ marginTop: 16 }}>
        Tu usuario quedó vinculado a esta sesión. Cuando actives el OAuth real,
        el mismo flujo mostrará tu perfil de Google o Discord.
      </p>
    </div>
  );
}
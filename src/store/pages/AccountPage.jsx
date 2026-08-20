import { useAuth } from "../AuthContext.jsx";
import { useOrders } from "../OrdersContext.jsx";
import { productBySlug } from "../../data/products.js";

const PROVIDER_ICONS = { google: "G", discord: "D" };

export default function AccountPage({ navigate, params }) {
  const { user, loading, busy, signIn, signOut, providers, demo } = useAuth();
  const orders = useOrders();
  const oauthError = params?.oauth === "error" ? params.reason : "";

  if (loading) {
    return (
      <div className="sa-wrap">
        <h1 className="sa-h1">Cuenta</h1>
        <div className="sa-empty">Cargando sesión…</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="sa-wrap" style={{ maxWidth: 640 }}>
        <h1 className="sa-h1">Cuenta</h1>
        <p className="sa-lead">
          Regístrate o inicia sesión para administrar tus descargas y contenido
          digital de SurgirStudio.
        </p>

        {oauthError && (
          <div className="sa-msg err" style={{ marginTop: 6 }}>
            Error al iniciar sesión: {oauthError}
          </div>
        )}

        <div className="sa-auth-box">
          <button className="sa-auth-btn" onClick={() => signIn("google")} disabled={busy}>
            <span className="sa-auth-ico">{PROVIDER_ICONS.google}</span>
            Continuar con {providers.google.label}
          </button>
          <button className="sa-auth-btn" onClick={() => signIn("discord")} disabled={busy}>
            <span className="sa-auth-ico">{PROVIDER_ICONS.discord}</span>
            Continuar con {providers.discord.label}
          </button>
        </div>

        <p className="sa-muted" style={{ fontSize: 12, marginTop: 14 }}>
          {demo
            ? "Modo demostración: la sesión se simula. Para activar el registro real, compila con VITE_AUTH_DEMO=false y configura las variables en Netlify."
            : "Al continuar serás redirigido al proveedor para autorizar el acceso."}
        </p>
      </div>
    );
  }

  const downloads = orders.orders
    .filter((o) => o.status === "completed")
    .flatMap((o) => o.items)
    .map((i) => ({ ...i, product: productBySlug(i.slug) }))
    .filter((i) => i.product?.downloadUrl);

  return (
    <div className="sa-wrap" style={{ maxWidth: 760 }}>
      <h1 className="sa-h1">Mi cuenta</h1>

      <div className="sa-profile">
        <div className="sa-avatar">
          {user.avatar ? (
            <img className="sa-avatar-img" src={user.avatar} alt="" />
          ) : (
            user.name.charAt(0)
          )}
        </div>
        <div>
          <div className="sa-name-lg">{user.name}</div>
          <div className="sa-mini">
            {user.email} · vía {user.providerLabel || user.provider}
          </div>
          {user.registeredAt && (
            <div className="sa-mini">
              Registro: {new Date(user.registeredAt).toLocaleDateString()}
            </div>
          )}
        </div>
        <button className="sa-btn ghost" onClick={signOut}>
          Cerrar sesión
        </button>
      </div>

      <h2 className="sa-h2">Mis descargas</h2>
      {downloads.length === 0 ? (
        <div className="sa-note" style={{ marginTop: 8 }}>
          Aún no tienes productos obtenidos. Explora la tienda para obtener
          SurgirEntregas gratis.
        </div>
      ) : (
        <div className="sa-dl-list">
          {downloads.map((d, i) => (
            <div className="sa-dl-item" key={`${d.slug}-${i}`}>
              <div>
                <div className="sa-name">{d.product.name}</div>
                <div className="sa-mini">
                  v{d.product.version} · Gratis · {d.product.studio}
                </div>
              </div>
              <div className="sa-dl-actions">
                <a className="sa-btn accent" href={d.product.downloadUrl} download>
                  ⬇ Descargar
                </a>
                {d.product.wiki && (
                  <button
                    className="sa-btn ghost"
                    onClick={() => navigate("wiki", { slug: d.slug })}
                  >
                    Wiki
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <h2 className="sa-h2">Publicar contenido digital</h2>
      <p className="sa-lead">Así se publica un producto en SurgirStudio:</p>
      <ol className="sa-steps">
        <li>
          <b>Agrega el producto</b> en <code>src/data/products.js</code>{" "}
          (nombre, precio o <code>price: 0</code>, descripción, comandos, wiki).
        </li>
        <li>
          <b>Sube tu archivo</b> a <code>public/downloads/</code> y coloca su
          ruta en <code>downloadUrl</code>.
        </li>
        <li>
          <b>Compila y publica</b>: <code>npm run build</code> y{" "}
          <code>git push</code>. Netlify despliega automáticamente.
        </li>
        <li>
          <b>Cobra con pagos</b>: engranaje ⚙ → Administración → Pagos para
          configurar el proveedor y los datos de cobro.
        </li>
      </ol>
    </div>
  );
}
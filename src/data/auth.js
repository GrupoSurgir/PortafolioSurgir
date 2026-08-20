// AUTH DE SURGIRSTUDIO — inicio de sesión con Google o Discord.
//
// DOS MODOS:
//  - demo (por defecto): botones simulan la sesión en localStorage.
//    Para desarrollo local sin backend.
//  - real: la app redirige a una Netlify Function que hace el intercambio
//    OAuth2 (authorization code) y devuelve una sesión en cookie HttpOnly.
//    Se activa con VITE_AUTH_DEMO=false al compilar/desplegar.
//
// SEGURIDAD: este archivo solo contiene datos PÚBLICOS (Client ID, URI).
// Los Secret Key se guardan EXCLUSIVAMENTE como variables de entorno del
// backend/Netlify (GOOGLE_CLIENT_SECRET, DISCORD_CLIENT_SECRET, SESSION_SECRET).
// El frontend nunca los ve ni los guarda.

export const auth = {
  // demo: true  -> simula la sesión (sin backend).
  // demo: false -> redirige a la Netlify Function de OAuth.
  demo: import.meta.env.VITE_AUTH_DEMO !== "false",
  providers: {
    google: {
      label: "Google",
      // Client ID público de la app OAuth (solo si el backend lo usa para
      // validar; el intercambio de código vive en la Netlify Function).
      clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID || "",
      authUrl: "https://accounts.google.com/o/oauth2/v2/auth",
      redirectUri: import.meta.env.VITE_GOOGLE_REDIRECT_URI || "",
      scope: "openid email profile",
    },
    discord: {
      label: "Discord",
      clientId: import.meta.env.VITE_DISCORD_CLIENT_ID || "",
      authUrl: "https://discord.com/oauth2/authorize",
      redirectUri: import.meta.env.VITE_DISCORD_REDIRECT_URI || "",
      scope: "identify email",
    },
  },
};

// Base de la Netlify Function de autenticación (ruta por defecto).
export const AUTH_BASE =
  import.meta.env.VITE_AUTH_BASE || "/.netlify/functions/auth";

export function isOAuthConfigured(providerId) {
  const p = auth.providers?.[providerId];
  return !!(p && p.clientId && p.redirectUri);
}

// Estado inicial de la sesión (usado por AuthContext).
export function initialState() {
  return { loading: true, user: null };
}
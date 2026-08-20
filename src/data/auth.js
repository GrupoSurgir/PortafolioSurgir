// AUTH DE SURGIR — inicio de sesión con Google o Discord.
//
// CÓMO ACTIVAR EL LOGIN REAL (Google / Discord OAuth2):
// 1. Crea una aplicación OAuth en la consola del proveedor:
//    - Google: https://console.cloud.google.com/apis/credentials
//    - Discord: https://discord.com/developers/applications
// 2. Registra como URI de redirección la URL de tu sitio
//    (ej: https://tu-sitio.netlify.app/api/auth/callback).
// 3. Pega el Client ID (público) en `clientId` y la URI en `redirectUri`.
// 4. Pon `demo: false`.
//
// SEGURIDAD: este archivo solo contiene datos PÚBLICOS (Client ID, URI).
// El intercambio de tokens (código -> sesión) DEBE ocurrir en un backend
// seguro; el frontend nunca guarda secretos ni tokens de acceso.

export const auth = {
  // demo: true  -> los botones simulan la sesión (sin backend).
  // demo: false -> se redirige al proveedor OAuth real.
  demo: true,
  providers: {
    google: {
      label: "Google",
      clientId: "",
      authUrl: "https://accounts.google.com/o/oauth2/v2/auth",
      redirectUri: "",
      scope: "openid email profile",
    },
    discord: {
      label: "Discord",
      clientId: "",
      authUrl: "https://discord.com/oauth2/authorize",
      redirectUri: "",
      scope: "identify email",
    },
  },
};

export function isOAuthConfigured(providerId) {
  const p = auth.providers?.[providerId];
  return !!(p && p.clientId && p.redirectUri);
}
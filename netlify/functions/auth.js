// Netlify Function de autenticación de SurgirStudio.
//
// Acciones (vía query string):
//   ?action=login&provider=google|discord   -> 302 al proveedor OAuth2
//   ?action=callback&provider=...&code=...  -> intercambio de código + cookie
//   ?action=me                               -> sesión actual (JSON)
//   ?action=logout (POST)                    -> borra la cookie
//
// SEGURIDAD:
//   - Los secretos viven SOLO como variables de entorno de Netlify.
//   - La sesión es una cookie HttpOnly firmada con HMAC (SESSION_SECRET).
//   - El frontend nunca ve tokens del proveedor ni secretos.

const crypto = require("crypto");

const PROVIDERS = {
  google: {
    label: "Google",
    authUrl: "https://accounts.google.com/o/oauth2/v2/auth",
    tokenUrl: "https://oauth2.googleapis.com/token",
    userUrl: "https://www.googleapis.com/oauth2/v2/userinfo",
    clientId: process.env.GOOGLE_CLIENT_ID || "",
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    scope: "openid email profile",
    avatarField: "picture",
    nameField: "name",
  },
  discord: {
    label: "Discord",
    authUrl: "https://discord.com/oauth2/authorize",
    tokenUrl: "https://discord.com/api/oauth2/token",
    userUrl: "https://discord.com/api/users/@me",
    clientId: process.env.DISCORD_CLIENT_ID || "",
    clientSecret: process.env.DISCORD_CLIENT_SECRET || "",
    scope: "identify email",
    avatarField: "avatar",
    nameField: "username",
  },
};

const SESSION_SECRET = process.env.SESSION_SECRET || "dev-only-session-secret";
const SESSION_TTL = 60 * 60 * 24 * 30; // 30 días
const COOKIE_NAME = "surgir_session";

function baseUrl(event) {
  const proto = event.headers["x-forwarded-proto"] || "http";
  const host = event.headers["x-forwarded-host"] || event.headers.host;
  return `${proto}://${host}`;
}

function json(statusCode, body, headers = {}) {
  return {
    statusCode,
    headers: { "Content-Type": "application/json", ...headers },
    body: JSON.stringify(body),
  };
}

function redirect(url, headers = {}) {
  return {
    statusCode: 302,
    headers: { Location: url, ...headers },
    body: "",
  };
}

function sign(data) {
  return crypto.createHmac("sha256", SESSION_SECRET).update(data).digest("base64url");
}

function makeToken(profile) {
  const payload = Buffer.from(
    JSON.stringify({ ...profile, exp: Date.now() + SESSION_TTL * 1000 })
  ).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

function verifyToken(token) {
  if (!token) return null;
  const [payload, sig] = String(token).split(".");
  if (!payload || !sig || sign(payload) !== sig) return null;
  try {
    const p = JSON.parse(Buffer.from(payload, "base64url").toString());
    if (typeof p.exp !== "number" || p.exp < Date.now()) return null;
    return p;
  } catch {
    return null;
  }
}

function cookieHeader(token, secure) {
  return `${COOKIE_NAME}=${token}; HttpOnly; Path=/; Max-Age=${SESSION_TTL}; SameSite=Lax${secure ? "; Secure" : ""}`;
}

function redirectUri(event, providerId) {
  const envKey = providerId === "google" ? "GOOGLE_REDIRECT_URI" : "DISCORD_REDIRECT_URI";
  return (
    process.env[envKey] ||
    `${baseUrl(event)}/.netlify/functions/auth?action=callback&provider=${providerId}`
  );
}

async function exchangeCode(provider, code, event) {
  const body = new URLSearchParams({
    grant_type: "authorization_code",
    code,
    client_id: provider.clientId,
    client_secret: provider.clientSecret,
    redirect_uri: redirectUri(event, provider.id),
  });

  const headers = { "Content-Type": "application/x-www-form-urlencoded" };
  if (provider.id === "discord") {
    headers.Authorization =
      "Basic " +
      Buffer.from(`${provider.clientId}:${provider.clientSecret}`).toString("base64");
  }

  const res = await fetch(provider.tokenUrl, { method: "POST", headers, body });
  if (!res.ok) throw new Error(`Token exchange failed: ${res.status}`);
  return res.json();
}

async function fetchProfile(provider, token) {
  const headers = { Authorization: `Bearer ${token}` };
  if (provider.id === "discord") headers["User-Agent"] = "SurgirStudio";
  const res = await fetch(provider.userUrl, { headers });
  if (!res.ok) throw new Error(`Profile fetch failed: ${res.status}`);
  return res.json();
}

function buildProfile(provider, raw) {
  if (provider.id === "google") {
    return {
      provider: "google",
      providerLabel: provider.label,
      name: raw.name || "Usuario",
      email: raw.email || "",
      avatar: raw.picture || "",
      registeredAt: new Date().toISOString(),
    };
  }
  // Discord
  const avatar = raw.avatar
    ? `https://cdn.discordapp.com/avatars/${raw.id}/${raw.avatar}.png`
    : "";
  return {
    provider: "discord",
    providerLabel: provider.label,
    name: raw.username || "Usuario",
    email: raw.email || "",
    avatar,
    registeredAt: new Date().toISOString(),
  };
}

exports.handler = async (event) => {
  const action = event.queryStringParameters?.action || "";

  // LOGIN: redirigir al proveedor OAuth.
  if (action === "login") {
    const providerId = event.queryStringParameters?.provider;
    const provider = PROVIDERS[providerId];
    if (!provider || !provider.clientId || !provider.clientSecret) {
      return json(400, { error: "Proveedor no configurado en el servidor." });
    }
    const u = new URL(provider.authUrl);
    u.searchParams.set("client_id", provider.clientId);
    u.searchParams.set("redirect_uri", redirectUri(event, providerId));
    u.searchParams.set("response_type", "code");
    u.searchParams.set("scope", provider.scope);
    u.searchParams.set("prompt", "consent");
    return redirect(u.toString());
  }

  // CALLBACK: intercambio de código y creación de sesión.
  if (action === "callback") {
    const providerId = event.queryStringParameters?.provider;
    const code = event.queryStringParameters?.code;
    const provider = PROVIDERS[providerId];
    if (!provider || !code) {
      return json(400, { error: "Callback inválido." });
    }
    try {
      const token = await exchangeCode({ ...provider, id: providerId }, code, event);
      const raw = await fetchProfile(provider, token.access_token);
      const profile = buildProfile(provider, raw);
      const sessionToken = makeToken(profile);
      const secure = (event.headers["x-forwarded-proto"] || "") === "https";
      const success =
        process.env.AUTH_SUCCESS_URL || `${baseUrl(event)}/#/account`;
      return redirect(success, { "Set-Cookie": cookieHeader(sessionToken, secure) });
    } catch (e) {
      return redirect(
        `${baseUrl(event)}/#/account?oauth=error&reason=${encodeURIComponent(
          e.message || "unknown"
        )}`
      );
    }
  }

  // ME: restaurar la sesión desde la cookie.
  if (action === "me") {
    const cookies = event.headers.cookie || "";
    const match = cookies
      .split(";")
      .map((c) => c.trim())
      .find((c) => c.startsWith(`${COOKIE_NAME}=`));
    const token = match ? match.slice(COOKIE_NAME.length + 1) : "";
    const profile = verifyToken(token);
    if (!profile) return json(401, { error: "Sin sesión." });
    return json(200, profile);
  }

  // LOGOUT: borrar la cookie.
  if (action === "logout") {
    const secure = (event.headers["x-forwarded-proto"] || "") === "https";
    return json(200, { ok: true }, {
      "Set-Cookie": `${COOKIE_NAME}=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax${secure ? "; Secure" : ""}`,
    });
  }

  return json(400, { error: "Acción no soportada." });
};
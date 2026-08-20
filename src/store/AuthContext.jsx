import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { auth, isOAuthConfigured } from "../data/auth.js";

// Sesión de usuario de SURGIR (Google / Discord).
// En modo demo se simula el inicio de sesión; con OAuth configurado se
// redirige al proveedor y el backend crea la sesión real.
// Persistencia en localStorage (clave "surgir-session").

const SESSION_KEY = "surgir-session";
const AuthContext = createContext(null);

function loadSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (raw) {
      const s = JSON.parse(raw);
      if (s && s.provider && s.email) return s;
    }
  } catch {}
  return null;
}

function buildOAuthUrl(providerId) {
  const p = auth.providers?.[providerId];
  if (!p || !p.clientId || !p.redirectUri) return null;
  const u = new URL(p.authUrl);
  u.searchParams.set("client_id", p.clientId);
  u.searchParams.set("redirect_uri", p.redirectUri);
  u.searchParams.set("response_type", "code");
  u.searchParams.set("scope", p.scope);
  return u.toString();
}

// Perfiles de demostración (sin backend). La interfaz nunca simula un pago,
// pero sí permite probar el flujo de "registrarse con Google/Discord".
const DEMO_PROFILES = {
  google: {
    provider: "google",
    providerLabel: "Google",
    name: "Jugador SURGIR",
    email: "jugador.demo@gmail.com",
    avatar: "G",
  },
  discord: {
    provider: "discord",
    providerLabel: "Discord",
    name: "Jugador SURGIR",
    email: "jugador.demo@discord",
    avatar: "D",
  },
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(loadSession);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    try {
      if (user) localStorage.setItem(SESSION_KEY, JSON.stringify(user));
      else localStorage.removeItem(SESSION_KEY);
    } catch {}
  }, [user]);

  const value = useMemo(() => {
    const signIn = (providerId) => {
      const url = buildOAuthUrl(providerId);
      if (url) {
        // OAuth real configurado: el navegador va al proveedor.
        window.location.assign(url);
        return;
      }
      // Modo demo: simula el registro con el proveedor.
      setBusy(true);
      setTimeout(() => {
        const profile =
          DEMO_PROFILES[providerId] || {
            provider: providerId,
            providerLabel: providerId,
            name: "Jugador SURGIR",
            email: `${providerId}@surgir.demo`,
            avatar: "?",
          };
        setUser(profile);
        setBusy(false);
      }, 600);
    };

    const signOut = () => setUser(null);

    return {
      user,
      busy,
      signIn,
      signOut,
      providers: auth.providers,
      demo: auth.demo,
      isOAuthConfigured,
    };
  }, [user, busy]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de <AuthProvider>");
  return ctx;
}
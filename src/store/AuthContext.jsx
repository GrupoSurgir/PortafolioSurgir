import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { auth, isOAuthConfigured, AUTH_BASE } from "../data/auth.js";

// Sesión de usuario de SurgirStudio (Google / Discord).
//
// MODO DEMO (VITE_AUTH_DEMO=true, por defecto):
//   - La sesión se simula y se guarda en localStorage ("surgir-session").
// MODO REAL (VITE_AUTH_DEMO=false):
//   - signIn redirige a la Netlify Function (OAuth2 con Google/Discord).
//   - Al montar, se restaura la sesión consultando `?action=me`.
//   - La sesión real es una cookie HttpOnly validada por el backend; el
//     frontend NO confía en localStorage para autenticación real.

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

// Perfiles de demostración (sin backend). La interfaz nunca simula un pago,
// pero sí permite probar el flujo de "registrarse con Google/Discord".
const DEMO_PROFILES = {
  google: {
    provider: "google",
    providerLabel: "Google",
    name: "Jugador SurgirStudio",
    email: "jugador.demo@gmail.com",
    avatar: "G",
  },
  discord: {
    provider: "discord",
    providerLabel: "Discord",
    name: "Jugador SurgirStudio",
    email: "jugador.demo@discord",
    avatar: "D",
  },
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(auth.demo ? false : true);

  // En modo real: restaura la sesión desde el backend (cookie HttpOnly).
  useEffect(() => {
    if (auth.demo) return;
    let active = true;
    fetch(`${AUTH_BASE}?action=me`, { credentials: "include" })
      .then((r) => (r.ok ? r.json() : Promise.resolve(null)))
      .then((profile) => {
        if (!active) return;
        setUser(profile);
        setLoading(false);
      })
      .catch(() => {
        if (!active) return;
        setUser(null);
        setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  // Modo demo: persiste la sesión simulada.
  useEffect(() => {
    if (!auth.demo) return;
    try {
      if (user) localStorage.setItem(SESSION_KEY, JSON.stringify(user));
      else localStorage.removeItem(SESSION_KEY);
    } catch {}
  }, [user]);

  const value = useMemo(() => {
    const signIn = (providerId) => {
      if (!auth.demo) {
        // OAuth real: el navegador va a la Netlify Function.
        window.location.assign(`${AUTH_BASE}?action=login&provider=${providerId}`);
        return;
      }
      setUser(
        DEMO_PROFILES[providerId] || {
          provider: providerId,
          providerLabel: providerId,
          name: "Jugador SurgirStudio",
          email: `${providerId}@surgir.demo`,
          avatar: "?",
        }
      );
    };

    const signOut = () => {
      if (!auth.demo) {
        fetch(`${AUTH_BASE}?action=logout`, {
          method: "POST",
          credentials: "include",
        }).catch(() => {});
        setUser(null);
        return;
      }
      setUser(null);
    };

    return {
      user,
      loading,
      signIn,
      signOut,
      providers: auth.providers,
      demo: auth.demo,
      isOAuthConfigured,
    };
  }, [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de <AuthProvider>");
  return ctx;
}
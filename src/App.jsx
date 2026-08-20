import { lazy, Suspense, useEffect, useMemo, useRef, useState } from "react";
import ExperienceGuide from "./components/ExperienceGuide.jsx";
import DragGestureIndicator from "./components/DragGestureIndicator.jsx";
import AdminPanel from "./components/AdminPanel.jsx";
import StoreApp from "./store/StoreApp.jsx";
import { PaymentsProvider } from "./store/PaymentsContext.jsx";
import { useAmbientAudio } from "./components/AudioEngine.js";
import { computeWake } from "./wake.js";
import { getEnvironment, DEFAULT_ENVIRONMENT, ENVIRONMENTS } from "./environments.js";

// La escena 3D (Three.js, Monitor, Workstation, entorno) se carga de forma
// diferida: la aplicación inicia directamente en el espacio y solo descarga el
// chunk 3D al montarse. No existe landing previa ni página clásica.

const Scene = lazy(() => import("./scene/Scene.jsx"));

const SETTINGS_KEY = "surgir-settings";

function loadSettings() {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (raw) {
      const s = JSON.parse(raw);
      const environment = ENVIRONMENTS.some((e) => e.id === s.environment)
        ? s.environment
        : DEFAULT_ENVIRONMENT;
      return {
        volume: typeof s.volume === "number" ? Math.min(1, Math.max(0, s.volume)) : 0.8,
        environment,
      };
    }
  } catch {}
  return { volume: 0.8, environment: DEFAULT_ENVIRONMENT };
}

export default function App() {
  // phase: "space" -> la escena 3D es la experiencia principal.
  //        "page"  -> la aplicación SURGIR a pantalla completa (dentro del PC).
  const [phase, setPhase] = useState("space");
  const [panelOpen, setPanelOpen] = useState(false);
  const [settings, setSettings] = useState(loadSettings);

  const wakeRef = useRef(computeWake(0));
  const startedRef = useRef(true);
  const glRef = useRef(null);
  const audioStartedRef = useRef(false);
  // Estado compartido del PC (Monitor <-> Scene): idle | focusing | booting | active
  const pcRef = useRef({ state: "idle", panelOpen: false });

  const audio = useAmbientAudio();

  // Persistir configuración.
  useEffect(() => {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch {}
  }, [settings]);

  // Cambiar ambiente/volumen de audio.
  useEffect(() => {
    if (audioStartedRef.current) {
      audio.setEnvironment(getEnvironment(settings.environment));
      audio.setVolume(settings.volume);
    }
  }, [settings.environment, settings.volume, audio]);

  // El navegador requiere un gesto del usuario para reproducir audio. La escena
  // inicia despierta; el audio arranca con la primera interacción (click/tecla).
  useEffect(() => {
    const onFirstGesture = () => {
      if (audioStartedRef.current) return;
      audioStartedRef.current = true;
      audio.start();
      audio.setEnvironment(getEnvironment(settings.environment));
      audio.setVolume(settings.volume);
      window.removeEventListener("pointerdown", onFirstGesture);
      window.removeEventListener("keydown", onFirstGesture);
    };
    window.addEventListener("pointerdown", onFirstGesture);
    window.addEventListener("keydown", onFirstGesture);
    return () => {
      window.removeEventListener("pointerdown", onFirstGesture);
      window.removeEventListener("keydown", onFirstGesture);
    };
  }, [audio, settings.environment, settings.volume]);

  // Al terminar la secuencia de arranque del monitor la cámara entra en la
  // pantalla y se muestra la aplicación SURGIR a pantalla completa.
  const goToPage = useMemo(
    () => () => {
      setPhase((p) => (p === "page" ? p : "page"));
    },
    []
  );

  // Volver a la experiencia 3D desde la aplicación. El PC PERMANECE encendido:
  // solo la cámara regresa a la pose de observación (sin rearmar el boot).
  const returnToSpace = () => {
    if (pcRef.current.resetView) pcRef.current.resetView();
    setPhase("space");
  };

  useEffect(() => {
    pcRef.current.onEnterPage = goToPage;
  }, [goToPage]);

  // ESC: desde la aplicación (página) vuelve a observar el PC en el espacio,
  // manteniendo el PC encendido (un nuevo click entra directo a la web).
  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== "Escape") return;
      const el = document.activeElement;
      const inField =
        el &&
        (el.tagName === "INPUT" ||
          el.tagName === "TEXTAREA" ||
          el.isContentEditable);
      if (inField) return;
      if (phase === "page") {
        returnToSpace();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase]);

  const onGl = (gl) => {
    glRef.current = gl;
  };

  const in3D = phase === "space" || phase === "page";

  return (
    <PaymentsProvider>
      <div className="relative w-screen bg-black root-app">
        {/* Espacio 3D: montado desde el inicio. El PC es el centro; al hacer
            click en la pantalla se enciende y la cámara entra en él. */}
        {in3D && (
          <div className="scene-wrap">
            <Suspense fallback={null}>
              <Scene
                wakeRef={wakeRef}
                startedRef={startedRef}
                pcRef={pcRef}
                environmentId={settings.environment}
                onGl={onGl}
              />
            </Suspense>
          </div>
        )}

        {/* Engranaje: abre configuración durante la observación del PC. */}
        {phase === "space" && (
          <button
            className="gear-btn"
            title="Configuración"
            onClick={() => {
              pcRef.current.panelOpen = true;
              setPanelOpen(true);
            }}
          >
            ⚙
          </button>
        )}

        {/* Marca SURGIR durante la experiencia 3D. */}
        {phase === "space" && (
          <img src="/logo.png" alt="Surgir" className="space-logo" />
        )}

        {/* Guía de bienvenida de la experiencia SURGIR. */}
        {phase === "space" && <ExperienceGuide />}

        {/* Indicador de gesto de arrastre en el espacio 3D. */}
        {phase === "space" && <DragGestureIndicator />}

        {/* Aplicación SURGIR a pantalla completa (al entrar en el monitor). */}
        {phase === "page" && (
          <div className="page-wrap">
            <StoreApp onExit={returnToSpace} />
          </div>
        )}

        {/* Configuración (engranaje). */}
        {panelOpen && (
          <AdminPanel
            settings={settings}
            setSettings={setSettings}
            onClose={() => {
              pcRef.current.panelOpen = false;
              setPanelOpen(false);
            }}
          />
        )}
      </div>
    </PaymentsProvider>
  );
}
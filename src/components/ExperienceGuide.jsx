import { useEffect, useRef, useState } from "react";

// Guía de bienvenida de la Experiencia SURGIR.
// - Aparece solo la PRIMERA vez que se entra a la experiencia en la sesión
//   (sessionStorage, así no molesta en entradas posteriores del mismo tab).
// - Describe ÚNICAMENTE controles reales: orbitar (arrastrar), zoom (rueda),
//   encender el monitor (clic en la pantalla) y la tienda que este revela.
// - PERMANECE ABIERTA: no se cierra sola. Solo "Continuar" o ✕ la cierran.
// - No bloquea la interacción: el contenedor es pointer-events:none salvo los
//   botones. Así se puede orbitar y hacer clic en el monitor durante la guía.

const SEEN_KEY = "surgir-guide-seen";
const FADE_MS = 400;

export default function ExperienceGuide() {
  const [show, setShow] = useState(false);
  const [closing, setClosing] = useState(false);
  const closedRef = useRef(false);

  const dismiss = () => {
    if (closedRef.current) return;
    closedRef.current = true;
    setClosing(true);
    setTimeout(() => setShow(false), FADE_MS);
  };

  // Decide "mostrar" UNA sola vez (persistente al doble-invoke de StrictMode en
  // dev): el primer run marca sessionStorage y el segundo run no vuelve a
  // mostrar la guía. Sin temporizador: permanece visible hasta cerrarla.
  const shouldShowRef = useRef(null);
  useEffect(() => {
    if (shouldShowRef.current === null) {
      const seen = sessionStorage.getItem(SEEN_KEY);
      shouldShowRef.current = !seen;
      if (!seen) {
        try {
          sessionStorage.setItem(SEEN_KEY, "1");
        } catch {}
      }
    }
    if (!shouldShowRef.current) return;
    setShow(true);
  }, []);

  if (!show) return null;

  return (
    <div className={`exp-guide ${closing ? "closing" : ""}`}>
      <button className="eg-x" aria-label="Cerrar guía" onClick={dismiss}>
        ×
      </button>
      <p className="eg-title">Bienvenido a la Experiencia SURGIR</p>
      <p className="eg-sub">Explora el espacio y descubre SURGIR.</p>
      <ul>
        <li>
          <span className="eg-ico">🖱️</span>
          <span>Arrastra para orbitar y observar el entorno.</span>
        </li>
        <li>
          <span className="eg-ico">🔍</span>
          <span>Usa la rueda del ratón para acercar o alejar.</span>
        </li>
        <li>
          <span className="eg-ico">🖥️</span>
          <span>Haz clic en la pantalla del monitor para encender el sistema.</span>
        </li>
        <li>
          <span className="eg-ico">🛒</span>
          <span>El sistema revela el acceso a la aplicación SURGIR.</span>
        </li>
        <li>
          <span className="eg-ico">⚙️</span>
          <span>Ajustes de sonido y ambiente con el engranaje.</span>
        </li>
      </ul>
      <p className="eg-foot">Esta guía permanece abierta hasta que decidas continuar.</p>
      <div className="eg-actions">
        <button className="eg-close" onClick={dismiss}>
          Continuar
        </button>
      </div>
    </div>
  );
}
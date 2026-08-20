import { useEffect, useState } from "react";

const STYLE = `
.drag-gesture-indicator {
  position: fixed;
  bottom: 84px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 45;
  pointer-events: none;
  background: rgba(16, 16, 20, 0.82);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 30px;
  padding: 10px 22px;
  color: #f1f1f5;
  font-family: system-ui, -apple-system, sans-serif;
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 0.5px;
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5), 0 0 15px rgba(100, 150, 255, 0.15);
  opacity: 0;
  animation: dgiFadeIn 0.5s ease forwards;
  transition: opacity 0.4s ease, transform 0.4s ease;
}
.drag-gesture-indicator.hiding {
  opacity: 0;
  transform: translateX(-50%) translateY(10px);
}
@keyframes dgiFadeIn {
  to { opacity: 1; transform: translateX(-50%) translateY(0); }
}
.dgi-hand {
  font-size: 18px;
  display: inline-block;
  animation: dgiGrab 2s ease-in-out infinite;
}
@keyframes dgiGrab {
  0%, 100% { transform: scale(1) rotate(0deg); }
  30% { transform: scale(0.85) rotate(-10deg); }
  50% { transform: scale(0.9) rotate(5deg); }
  70% { transform: scale(0.85) rotate(-5deg); }
}
.dgi-text {
  color: #d0d0d8;
  text-transform: uppercase;
  font-size: 11px;
  letter-spacing: 1.5px;
  font-weight: 600;
}
`;

export default function DragGestureIndicator() {
  const [visible, setVisible] = useState(true);
  const [hiding, setHiding] = useState(false);

  useEffect(() => {
    const dismiss = () => {
      setHiding(true);
      setTimeout(() => setVisible(false), 400);
    };

    // Detectar interacción real: mousedown, touchstart, wheel, keydown
    const onInteraction = (e) => {
      if (e.key === "Escape") {
        dismiss();
        return;
      }
      dismiss();
    };

    window.addEventListener("mousedown", onInteraction, { once: true });
    window.addEventListener("touchstart", onInteraction, { once: true });
    window.addEventListener("wheel", onInteraction, { once: true });
    window.addEventListener("keydown", onInteraction, { once: true });

    // Autocierre después de 6 segundos si no hay interacción
    const timer = setTimeout(() => {
      dismiss();
    }, 6000);

    return () => {
      window.removeEventListener("mousedown", onInteraction);
      window.removeEventListener("touchstart", onInteraction);
      window.removeEventListener("wheel", onInteraction);
      window.removeEventListener("keydown", onInteraction);
      clearTimeout(timer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div className={`drag-gesture-indicator ${hiding ? "hiding" : ""}`}>
      <style>{STYLE}</style>
      <span className="dgi-hand">🖱️</span>
      <span className="dgi-text">Arrastra para explorar</span>
    </div>
  );
}

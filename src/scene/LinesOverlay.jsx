import { useEffect, useRef } from "react";

// Overlay de líneas verticales extremadamente finas que ascienden durante
// el arranque. NO es Matrix, NO es lluvia digital: son sistemas físicos
// inicializándose. La intensidad la controla wakeRef.current.lines (0..1).
// Es un canvas 2D DOM, independiente de la escena 3D.

const LINE_COUNT = 170;

export default function LinesOverlay({ wakeRef }) {
  const canvasRef = useRef();

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let raf;
    let w = 0;
    let h = 0;

    const lines = Array.from({ length: LINE_COUNT }, (_, i) => ({
      x: (i + 0.5) / LINE_COUNT + (Math.random() - 0.5) * (1 / LINE_COUNT) * 0.8,
      speed: 0.06 + Math.random() * 0.12,
      phase: Math.random(),
      width: Math.random() < 0.2 ? 1.4 : 0.8,
      alpha: 0.4 + Math.random() * 0.6,
    }));

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    let t = 0;
    const draw = () => {
      t += 1 / 60;
      const intensity = wakeRef.current ? wakeRef.current.lines : 0;
      ctx.clearRect(0, 0, w, h);

      if (intensity > 0.001) {
        for (const l of lines) {
          const x = l.x * w;
          const baseAlpha = intensity * 0.05 * l.alpha;
          // Línea fina completa (casi invisible)
          ctx.strokeStyle = `rgba(150,170,185,${baseAlpha})`;
          ctx.lineWidth = l.width;
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, h);
          ctx.stroke();

          // Segmento brillante que asciende
          const segPos = ((l.phase + t * l.speed) % 1) * (h + 120) - 60;
          const segH = h * 0.08;
          const grad = ctx.createLinearGradient(x, segPos - segH, x, segPos + segH);
          const sa = intensity * 0.5 * l.alpha;
          grad.addColorStop(0, "rgba(180,200,215,0)");
          grad.addColorStop(0.5, `rgba(190,210,225,${sa})`);
          grad.addColorStop(1, "rgba(180,200,215,0)");
          ctx.strokeStyle = grad;
          ctx.lineWidth = l.width + 0.4;
          ctx.beginPath();
          ctx.moveTo(x, segPos - segH);
          ctx.lineTo(x, segPos + segH);
          ctx.stroke();
        }
      }
      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [wakeRef]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 z-20"
    />
  );
}

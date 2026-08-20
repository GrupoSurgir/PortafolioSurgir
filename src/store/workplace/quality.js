import { useEffect, useState } from "react";

// Calidad visual del Builder por niveles. Detección sencilla de dispositivo
// (sin benchmark complejo) + ajuste manual del usuario.

export const QUALITY_LEVELS = [
  {
    id: "low",
    label: "Ligera",
    dpr: [1, 1.25],
    shadows: false,
    ringLight: false,
  },
  {
    id: "medium",
    label: "Estándar",
    dpr: [1, 1.75],
    shadows: false,
    ringLight: true,
  },
  {
    id: "high",
    label: "Completa",
    dpr: [1, 2],
    shadows: true,
    ringLight: true,
  },
];

function detect() {
  let score = 0;
  const nav = typeof navigator !== "undefined" ? navigator : null;
  if (nav && typeof nav.hardwareConcurrency === "number") {
    score += nav.hardwareConcurrency >= 8 ? 2 : nav.hardwareConcurrency >= 4 ? 1 : 0;
  }
  if (nav && nav.deviceMemory) {
    score += nav.deviceMemory >= 8 ? 2 : nav.deviceMemory >= 4 ? 1 : 0;
  }
  if (typeof window !== "undefined" && window.devicePixelRatio <= 1) score += 1;
  const mobile = /Mobi|Android|iPhone|iPad/i.test((nav && nav.userAgent) || "");
  if (mobile) score = Math.min(score, 1);
  return score >= 3 ? "high" : score === 2 ? "medium" : "low";
}

const KEY = "surgir-builder-quality";

export function useQuality() {
  const [tier, setTier] = useState(() => {
    try {
      const s = localStorage.getItem(KEY);
      if (s && QUALITY_LEVELS.some((q) => q.id === s)) return s;
    } catch {}
    return detect();
  });

  useEffect(() => {
    try {
      localStorage.setItem(KEY, tier);
    } catch {}
  }, [tier]);

  const level = QUALITY_LEVELS.find((q) => q.id === tier) || QUALITY_LEVELS[1];
  return { tier, setTier, level };
}
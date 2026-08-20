import { useCallback, useEffect, useRef, useState } from "react";
import { builderProductBySlug, builderProducts } from "../../data/customization/products.js";

// Persistencia local TEMPORAL del puesto. Cuando exista cuenta/cloud, esto se
// conectará al usuario real. No se finge una cuenta aquí.
const STORAGE_KEY = "surgir-workplace-builder";
const SAVED_EVENT = "surgir-workplace-saved";

export const DEFAULT_WORKPLACE = {
  monitor: "monitor-basic",
  pc: "pc-basic",
  keyboard: "keyboard-basic",
  mouse: "mouse-basic",
  ringLight: { productId: "ring-light-basic", color: "#22d3ee" },
};

function validId(slot, id) {
  return !!id && builderProducts.some((p) => p.slot === slot && p.id === id);
}

function sanitize(raw) {
  const out = { ...DEFAULT_WORKPLACE };
  if (raw) {
    if (validId("monitor", raw.monitor)) out.monitor = raw.monitor;
    if (validId("pc", raw.pc)) out.pc = raw.pc;
    if (validId("keyboard", raw.keyboard)) out.keyboard = raw.keyboard;
    if (validId("mouse", raw.mouse)) out.mouse = raw.mouse;
    if (raw.ringLight && validId("ringLight", raw.ringLight.productId)) {
      out.ringLight = {
        productId: raw.ringLight.productId,
        color:
          typeof raw.ringLight.color === "string"
            ? raw.ringLight.color
            : out.ringLight.color,
      };
    } else if (raw.ringLight === null) {
      out.ringLight = null;
    }
  }
  return out;
}

function load() {
  try {
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return sanitize(raw);
  } catch {
    return DEFAULT_WORKPLACE;
  }
}

export function useWorkplace() {
  const [state, setState] = useState(load);
  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);
  const stateRef = useRef(state);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  // Persistir y avisar a la otra instancia (la del monitor del PC 3D) para que
  // sincronice su vista estática del puesto.
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      window.dispatchEvent(new Event(SAVED_EVENT));
    } catch {}
  }, [state]);

  // Escuchar cambios guardados (desde la instancia de pantalla completa).
  useEffect(() => {
    const onSaved = () => {
      try {
        const next = sanitize(JSON.parse(localStorage.getItem(STORAGE_KEY)));
        setState((cur) =>
          JSON.stringify(cur) === JSON.stringify(next) ? cur : next
        );
      } catch {}
    };
    window.addEventListener(SAVED_EVENT, onSaved);
    return () => window.removeEventListener(SAVED_EVENT, onSaved);
  }, []);

  const notify = useCallback((msg) => {
    setToast(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2200);
  }, []);

  const setSlot = useCallback(
    (slot, productId) => {
      const p = builderProductBySlug(productId);
      const prev = stateRef.current[slot];
      const msg =
        prev == null || prev === DEFAULT_WORKPLACE[slot]
          ? `✓ ${p ? p.name : productId} añadido`
          : `${p ? p.name : productId} actualizado`;
      setState((s) => ({ ...s, [slot]: productId }));
      notify(msg);
    },
    [notify]
  );

  const removeSlot = useCallback(
    (slot) => {
      setState((s) =>
        slot === "ringLight"
          ? { ...s, ringLight: null }
          : { ...s, [slot]: DEFAULT_WORKPLACE[slot] }
      );
      notify(
        slot === "ringLight"
          ? "Aro de luz eliminado"
          : "Elemento restablecido al predeterminado"
      );
    },
    [notify]
  );

  const setRingColor = useCallback(
    (color) => {
      setState((s) =>
        s.ringLight ? { ...s, ringLight: { ...s.ringLight, color } } : s
      );
    },
    []
  );

  const enableRingLight = useCallback((productId, color) => {
    setState((s) => ({
      ...s,
      ringLight: {
        productId: productId || s.ringLight?.productId || "ring-light-basic",
        color: color || s.ringLight?.color || "#22d3ee",
      },
    }));
  }, []);

  const reset = useCallback(() => {
    setState(DEFAULT_WORKPLACE);
    notify("Configuración restablecida");
  }, [notify]);

  const save = useCallback(() => {
    notify("✓ Configuración guardada localmente");
  }, [notify]);

  return {
    state,
    setSlot,
    removeSlot,
    setRingColor,
    enableRingLight,
    reset,
    save,
    toast,
  };
}
import { useMemo, useRef, useState } from "react";
import { useWorkplace } from "./useWorkplace.js";
import { useQuality } from "./quality.js";
import WorkplaceScene from "./WorkplaceScene.jsx";
import {
  builderCategories,
  builderProductsBySlot,
  builderProductById,
} from "../../data/customization/products.js";
import { SLOT_ORDER, SLOTS } from "../../data/customization/slots.js";
import { RING_COLORS } from "../../data/customization/colors.js";
import "./builder.css";

const HOME_CAMERA = [1.9, 1.5, 2.6];

// Vista estática ligera (la usa la instancia del monitor del PC 3D para no
// montar un segundo Canvas WebGL pesado dentro de la escena principal).
function StaticPreview({ state, ringColor }) {
  return (
    <div className="wb-static">
      <div className="wb-static-title">TU PUESTO DE TRABAJO</div>
      <div className="wb-static-grid">
        {SLOT_ORDER.map((slot) => {
          const p = builderProductById(state[slot] || (slot === "ringLight" ? state.ringLight?.productId : ""));
          if (!p) {
            return (
              <div key={slot} className="wb-static-item empty">
                <span className="wb-static-icon">{SLOTS[slot].icon}</span>
                <span className="wb-static-name">—</span>
              </div>
            );
          }
          return (
            <div key={slot} className="wb-static-item">
              <span className="wb-static-icon">{p.icon}</span>
              <span className="wb-static-name">{p.name}</span>
              {slot === "ringLight" && (
                <span
                  className="wb-static-swatch"
                  style={{ background: ringColor }}
                />
              )}
            </div>
          );
        })}
      </div>
      <div className="wb-static-note">Personaliza en pantalla completa →</div>
    </div>
  );
}

export default function WorkplaceBuilder({ navigate, fullscreen }) {
  const {
    state,
    setSlot,
    removeSlot,
    setRingColor,
    enableRingLight,
    reset,
    save,
    toast,
  } = useWorkplace();
  const quality = useQuality();
  const controlsRef = useRef();
  const [cat, setCat] = useState("monitor");
  const [selection, setSelection] = useState(null);
  const [ringColor, setRingColorLocal] = useState(
    state.ringLight?.color || "#22d3ee"
  );

  const products = builderProductsBySlot(cat);

  const effectiveState = useMemo(() => {
    if (!selection || selection.slot === "ringLight") return state;
    return { ...state, [selection.slot]: selection.product.id };
  }, [state, selection]);

  const ringProductId =
    selection && selection.slot === "ringLight"
      ? selection.product.id
      : state.ringLight?.productId || null;
  const ringProduct = ringProductId ? builderProductById(ringProductId) : null;

  if (!fullscreen) {
    return (
      <div className="wb wb-static-page">
        <div className="wb-top">
          <span className="sa-back" onClick={() => navigate("shop", { category: "personalizacion" })}>
            ← Volver a la tienda
          </span>
          <span className="wb-title">PERSONALIZA TU PUESTO</span>
          <span />
        </div>
        <StaticPreview state={state} ringColor={ringColor} />
      </div>
    );
  }

  const resetCamera = () => {
    if (controlsRef.current) {
      controlsRef.current.target.set(0, 0.9, -0.1);
      controlsRef.current.object.position.set(...HOME_CAMERA);
      controlsRef.current.update();
    }
  };

  const choose = (p) => {
    setSelection({ product: p, slot: p.slot });
  };

  const addToDesk = () => {
    if (!selection) return;
    const { product, slot } = selection;
    if (slot === "ringLight") {
      enableRingLight(product.id, ringColor);
    } else {
      setSlot(slot, product.id);
    }
    setSelection(null);
  };

  const handleRemove = () => {
    if (!selection) return;
    removeSlot(selection.slot);
    setSelection(null);
  };

  const pickColor = (c) => {
    setRingColorLocal(c.value);
    setRingColor(c.value);
  };

  const currentSlot = selection ? selection.slot : null;
  const currentProduct = selection ? selection.product : null;

  return (
    <div className="wb">
      <div className="wb-top">
        <span
          className="sa-back"
          onClick={() => navigate("shop", { category: "personalizacion" })}
        >
          ← Volver a la tienda
        </span>
        <span className="wb-title">PERSONALIZA TU PUESTO</span>
        <div className="wb-top-actions">
          <button className="wb-btn-sm" onClick={resetCamera}>
            Reset view
          </button>
          <select
            className="sa-input wb-quality"
            value={quality.tier}
            onChange={(e) => quality.setTier(e.target.value)}
            title="Calidad visual"
          >
            <option value="low">Calidad: Ligera</option>
            <option value="medium">Calidad: Estándar</option>
            <option value="high">Calidad: Completa</option>
          </select>
        </div>
      </div>

      <div className="wb-stage">
        <WorkplaceScene
          state={effectiveState}
          ringProduct={ringProduct}
          ringColor={ringColor}
          quality={quality}
          controlsRef={controlsRef}
        />
        <div className="wb-hud">
          <span className="wb-hud-dot" />
          Gira · acerca · aleja · Reset view para recuperar la vista
        </div>
      </div>

      <div className="wb-cats">
        {builderCategories.map((c) => (
          <button
            key={c.id}
            className={`wb-cat ${cat === c.id ? "active" : ""}`}
            onClick={() => setCat(c.id)}
          >
            {c.icon} {c.label}
          </button>
        ))}
      </div>

      <div className="wb-catalog">
        {products.map((p) => {
          const active = selection && selection.product.id === p.id;
          const installed =
            (p.slot === "ringLight"
              ? state.ringLight?.productId
              : state[p.slot]) === p.id;
          return (
            <button
              key={p.id}
              className={`wb-item ${active ? "active" : ""} ${
                installed ? "installed" : ""
              }`}
              onClick={() => choose(p)}
            >
              <span className="wb-item-icon">{p.icon}</span>
              <span className="wb-item-name">{p.name}</span>
              <span className="wb-item-price">${p.price}</span>
              {installed && <span className="wb-item-badge">EN USO</span>}
            </button>
          );
        })}
      </div>

      {currentProduct && (
        <div className="wb-preview">
          <div className="wb-preview-head">
            <span>VISTA PREVIA</span>
            <button
              className="wb-btn-x"
              onClick={() => setSelection(null)}
              aria-label="Cerrar vista previa"
            >
              ×
            </button>
          </div>
          <div className="wb-preview-main">
            <div className="wb-preview-icon">{currentProduct.icon}</div>
            <div>
              <div className="wb-preview-name">{currentProduct.name}</div>
              <div className="wb-preview-desc">
                {currentProduct.shortDescription || currentProduct.description}
              </div>
              <div className="wb-preview-price">${currentProduct.price}</div>
            </div>
          </div>
          {currentSlot === "ringLight" && (
            <div className="wb-colors">
              {RING_COLORS.map((c) => (
                <button
                  key={c.id}
                  className={`wb-color ${ringColor === c.value ? "active" : ""}`}
                  style={{ background: c.value }}
                  title={c.label}
                  onClick={() => pickColor(c)}
                />
              ))}
            </div>
          )}
          <div className="wb-preview-actions">
            <button className="wb-btn-sm" onClick={handleRemove}>
              Quitar
            </button>
            <button className="wb-btn-sm primary" onClick={addToDesk}>
              Añadir al puesto
            </button>
          </div>
        </div>
      )}

      <div className="wb-actions">
        <button className="wb-btn-sm" onClick={reset}>
          Restablecer
        </button>
        <button className="wb-btn-sm primary" onClick={save}>
          Guardar mi puesto
        </button>
      </div>

      {toast && <div className="wb-toast">{toast}</div>}
    </div>
  );
}
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { SLOTS } from "../../data/customization/slots.js";
import {
  MonitorBasic,
  MonitorPro,
  MonitorUltrawide,
} from "./objects/Monitors.jsx";
import {
  PCBasic,
  PCPro,
  PCRGB,
  PCPremium,
} from "./objects/PCs.jsx";
import {
  KeyboardBasic,
  KeyboardMechanical,
  KeyboardRGB,
} from "./objects/Keyboards.jsx";
import {
  MouseBasic,
  MousePro,
  MouseRGB,
} from "./objects/Mice.jsx";
import {
  RingLightBasic,
  RingLightPro,
} from "./objects/RingLight.jsx";

// Animación de aparición: cada objeto entra con un pequeño escalado suave.
// El componente se remonta (key = product.id) al cambiar de producto, por lo
// que la animación se reproduce en cada sustitución en tiempo real.
function Spawn({ children }) {
  const ref = useRef();
  const t = useRef(0);
  useFrame((_, delta) => {
    t.current = Math.min(1, t.current + delta / 0.4);
    const e = 1 - Math.pow(1 - t.current, 3);
    if (ref.current) ref.current.scale.setScalar(0.6 + 0.4 * e);
  });
  return <group ref={ref}>{children}</group>;
}

const BY_TYPE = {
  "monitor-basic": MonitorBasic,
  "monitor-pro": MonitorPro,
  "monitor-ultrawide": MonitorUltrawide,
  "pc-basic": PCBasic,
  "pc-pro": PCPro,
  "pc-rgb": PCRGB,
  "pc-premium": PCPremium,
  "keyboard-basic": KeyboardBasic,
  "keyboard-mechanical": KeyboardMechanical,
  "keyboard-rgb": KeyboardRGB,
  "mouse-basic": MouseBasic,
  "mouse-pro": MousePro,
  "mouse-rgb": MouseRGB,
};

export function WorkplaceRingLight({ product, color, quality }) {
  if (!product) return null;
  const anchor = SLOTS.ringLight;
  const Ring = product.type === "ring-light-pro" ? RingLightPro : RingLightBasic;
  return (
    <group position={anchor.position}>
      <Spawn key={product.id}>
        <Ring color={color} quality={quality} />
      </Spawn>
    </group>
  );
}

export default function WorkplaceObject({ slot, product, quality }) {
  const anchor = SLOTS[slot];
  if (!anchor || !product) return null;
  const Cmp = BY_TYPE[product.type];
  if (!Cmp) return null;
  return (
    <group position={anchor.position}>
      <Spawn key={product.id}>
        <Cmp />
      </Spawn>
    </group>
  );
}
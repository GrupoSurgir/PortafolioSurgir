import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import Monitor from "./Monitor.jsx";

// Estación de trabajo: escritorio + PC + teclado + mouse + monitor.
// Materiales grises medios (no negros) para que la lámpara cenital los
// revele de inmediato. El PC recibe luz desde arriba; no es fuente de luz.
//
// `position`/`rotationY`/`storeId` permiten montar VARIAS mesas-tienda:
// cada escritorio trae su propio monitor con su propia tienda (storeId).

const DESK_TOP_Y = 0.74;

export default function Workstation({
  wakeRef,
  pcRef,
  position = [0, 0, 0],
  rotationY = 0,
  storeId = "surgir",
}) {
  const statusMat = useRef();
  const caseLight = useRef();

  useFrame(() => {
    const w = wakeRef.current;
    if (statusMat.current) statusMat.current.emissiveIntensity = w.status * 1.1;
    // Luz tenue del gabinete del PC (relleno local, no la pantalla).
    if (caseLight.current) caseLight.current.intensity = w.near * 2.5;
  });

  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* ---------- ESCRITORIO ---------- */}
      <mesh position={[0, DESK_TOP_Y, -0.1]} castShadow receiveShadow>
        <boxGeometry args={[2.4, 0.06, 1.0]} />
        <meshStandardMaterial color="#2c2f38" roughness={0.6} metalness={0.12} />
      </mesh>
      {[-1.12, 1.12].map((x) => (
        <mesh key={x} position={[x, DESK_TOP_Y / 2, -0.1]} castShadow>
          <boxGeometry args={[0.08, DESK_TOP_Y, 0.9]} />
          <meshStandardMaterial color="#1d1f26" roughness={0.65} metalness={0.12} />
        </mesh>
      ))}

      {/* ---------- PC (torre) ---------- */}
      <group position={[-0.85, 0, -0.25]}>
        <mesh position={[0, DESK_TOP_Y + 0.225, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.22, 0.45, 0.46]} />
          <meshStandardMaterial color="#2a2c34" roughness={0.7} metalness={0.12} />
        </mesh>
        {[-0.12, -0.06, 0, 0.06, 0.12].map((y) => (
          <mesh key={y} position={[0.111, DESK_TOP_Y + 0.225 + y, 0]}>
            <boxGeometry args={[0.005, 0.02, 0.34]} />
            <meshStandardMaterial color="#34343c" roughness={0.9} metalness={0.1} />
          </mesh>
        ))}
        {/* LED de estado mínimo (no RGB, tenue) */}
        <mesh position={[0.112, DESK_TOP_Y + 0.4, 0.12]}>
          <boxGeometry args={[0.006, 0.012, 0.012]} />
          <meshStandardMaterial
            ref={statusMat}
            color="#0a0a0b"
            emissive="#2a5f63"
            emissiveIntensity={0}
            toneMapped={false}
          />
        </mesh>
      </group>

      {/* ---------- MONITOR (interactivo) ---------- */}
      <Monitor pcRef={pcRef} storeId={storeId} />

      {/* ---------- TECLADO ---------- */}
      <mesh position={[0, DESK_TOP_Y + 0.018, 0.18]} castShadow receiveShadow>
        <boxGeometry args={[0.46, 0.03, 0.15]} />
        <meshStandardMaterial color="#272932" roughness={0.65} metalness={0.12} />
      </mesh>
      <mesh position={[0, DESK_TOP_Y + 0.035, 0.18]}>
        <boxGeometry args={[0.42, 0.004, 0.12]} />
        <meshStandardMaterial color="#34363f" roughness={0.8} metalness={0.1} />
      </mesh>

      {/* ---------- MOUSE ---------- */}
      <mesh position={[0.42, DESK_TOP_Y + 0.02, 0.2]} castShadow>
        <boxGeometry args={[0.06, 0.025, 0.1]} />
        <meshStandardMaterial color="#272932" roughness={0.6} metalness={0.12} />
      </mesh>

      {/* Luz tenue del gabinete (relleno local, independiente de la pantalla). */}
      <pointLight
        ref={caseLight}
        position={[-0.85, 1.2, 0.05]}
        intensity={0}
        color="#cdd6dd"
        distance={3.5}
        decay={2}
      />
    </group>
  );
}

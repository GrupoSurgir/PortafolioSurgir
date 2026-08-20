import * as THREE from "three";

// Modelos procedimentales de monitores para el Workplace Builder.
// Cada componente se construye con el ORIGEN apoyado sobre el escritorio
// (el ancla del slot) y crece hacia arriba. La pantalla mira hacia +Z
// (hacia el usuario / cámara).

const BODY = "#2a2d35";
const BODY2 = "#1d2026";
const ACCENT = "#7fe9ff";

const mat = (color, o = {}) => ({
  color,
  roughness: o.roughness ?? 0.55,
  metalness: o.metalness ?? 0.15,
});

function Screen({ w, h, brightness = 0.8 }) {
  return (
    <mesh position={[0, 0, 0.02]}>
      <planeGeometry args={[w, h]} />
      <meshStandardMaterial
        color="#0a0f18"
        emissive="#123a4f"
        emissiveIntensity={brightness}
        toneMapped={false}
      />
    </mesh>
  );
}

export function MonitorBasic() {
  return (
    <group>
      <mesh position={[0, 0.015, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.34, 0.03, 0.22]} />
        <meshStandardMaterial {...mat(BODY)} />
      </mesh>
      <mesh position={[0, 0.075, 0]} castShadow>
        <boxGeometry args={[0.05, 0.1, 0.05]} />
        <meshStandardMaterial {...mat(BODY2)} />
      </mesh>
      <mesh position={[0, 0.37, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.92, 0.52, 0.04]} />
        <meshStandardMaterial {...mat(BODY)} />
      </mesh>
      <Screen w={0.86} h={0.48} />
      <mesh position={[0, 0.09, 0.022]}>
        <boxGeometry args={[0.02, 0.008, 0.004]} />
        <meshStandardMaterial
          color="#0a0a0b"
          emissive="#1d5f63"
          emissiveIntensity={0.6}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

export function MonitorPro() {
  return (
    <group>
      <mesh position={[0, 0.015, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.48, 0.02, 0.24]} />
        <meshStandardMaterial {...mat(BODY2, { metalness: 0.25 })} />
      </mesh>
      <mesh position={[0, 0.1, 0]} rotation={[0, 0, 0.02]} castShadow>
        <boxGeometry args={[0.06, 0.17, 0.06]} />
        <meshStandardMaterial {...mat(BODY)} />
      </mesh>
      <mesh position={[0, 0.4, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.98, 0.56, 0.035]} />
        <meshStandardMaterial {...mat(BODY, { metalness: 0.2 })} />
      </mesh>
      <Screen w={0.94} h={0.53} brightness={0.9} />
      <mesh position={[0, 0.1, 0.02]}>
        <boxGeometry args={[0.05, 0.006, 0.004]} />
        <meshStandardMaterial
          color="#04242b"
          emissive={ACCENT}
          emissiveIntensity={1.2}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

export function MonitorUltrawide() {
  return (
    <group>
      <mesh position={[0, 0.015, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.55, 0.02, 0.3]} />
        <meshStandardMaterial {...mat(BODY2, { metalness: 0.25 })} />
      </mesh>
      {[-0.18, 0.18].map((x) => (
        <mesh key={x} position={[x, 0.13, 0]} castShadow>
          <boxGeometry args={[0.04, 0.22, 0.04]} />
          <meshStandardMaterial {...mat(BODY)} />
        </mesh>
      ))}
      <mesh position={[0, 0.42, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.35, 0.5, 0.035]} />
        <meshStandardMaterial {...mat(BODY, { metalness: 0.2 })} />
      </mesh>
      <Screen w={1.31} h={0.46} brightness={0.9} />
      <mesh position={[0, 0.15, 0.02]}>
        <boxGeometry args={[0.6, 0.008, 0.005]} />
        <meshStandardMaterial
          color="#04242b"
          emissive={ACCENT}
          emissiveIntensity={1.1}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

export const monitorThreeColor = new THREE.Color("#0a0f18");
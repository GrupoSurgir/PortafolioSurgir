import * as THREE from "three";

// Teclados para el Workplace Builder. Origen apoyado sobre el escritorio.

const hueOf = (c, cols) => new THREE.Color().setHSL(c / cols, 0.85, 0.55);

const mat = (color, o = {}) => ({
  color,
  roughness: o.roughness ?? 0.55,
  metalness: o.metalness ?? 0.12,
});

// Cuadrícula de teclas genérica.
function KeyGrid({
  rows = 4,
  cols = 12,
  keyW = 0.03,
  keyH = 0.026,
  gap = 0.005,
  lift = 0.035,
  color = "#34363f",
  colorFn = null,
}) {
  const keys = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = (c - (cols - 1) / 2) * (keyW + gap);
      const z = lift + r * (keyH + gap);
      keys.push(
        <mesh key={`${r}-${c}`} position={[x, 0.016, z]} castShadow>
          <boxGeometry args={[keyW, 0.012, keyH]} />
          <meshStandardMaterial
            color={colorFn ? "#0a0d14" : color}
            roughness={0.6}
            metalness={0.1}
            emissive={colorFn ? colorFn(c, r, cols, rows) : "#000000"}
            emissiveIntensity={colorFn ? 1.1 : 0}
            toneMapped={colorFn ? false : undefined}
          />
        </mesh>
      );
    }
  }
  return <group>{keys}</group>;
}

export function KeyboardBasic() {
  return (
    <group>
      <mesh position={[0, 0.015, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.46, 0.03, 0.15]} />
        <meshStandardMaterial {...mat("#272932")} />
      </mesh>
      <KeyGrid rows={4} cols={12} lift={0.05} />
      <mesh position={[0, 0.052, 0.11]} castShadow>
        <boxGeometry args={[0.18, 0.012, 0.026]} />
        <meshStandardMaterial color="#34363f" roughness={0.6} metalness={0.1} />
      </mesh>
    </group>
  );
}

export function KeyboardMechanical() {
  return (
    <group>
      <mesh position={[0, 0.02, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.48, 0.04, 0.16]} />
        <meshStandardMaterial {...mat("#24262d")} />
      </mesh>
      <mesh position={[0, 0.012, 0]} castShadow>
        <boxGeometry args={[0.46, 0.02, 0.15]} />
        <meshStandardMaterial {...mat("#1d1f26")} />
      </mesh>
      <KeyGrid rows={5} cols={13} keyW={0.028} keyH={0.024} gap={0.004} lift={0.055} color="#3a3d46" />
      <mesh position={[0, 0.062, 0.115]} castShadow>
        <boxGeometry args={[0.2, 0.014, 0.024]} />
        <meshStandardMaterial color="#3a3d46" roughness={0.6} metalness={0.1} />
      </mesh>
    </group>
  );
}

export function KeyboardRGB() {
  return (
    <group>
      <mesh position={[0, 0.02, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.48, 0.04, 0.16]} />
        <meshStandardMaterial {...mat("#14161c")} />
      </mesh>
      <KeyGrid
        rows={5}
        cols={13}
        keyW={0.028}
        keyH={0.024}
        gap={0.004}
        lift={0.055}
        colorFn={(c) => hueOf(c, 13)}
      />
      <mesh position={[0, 0.012, -0.02]} castShadow>
        <boxGeometry args={[0.4, 0.006, 0.06]} />
        <meshStandardMaterial
          color="#0a0d14"
          emissive="#7fe9ff"
          emissiveIntensity={1.2}
          toneMapped={false}
        />
      </mesh>
      <mesh position={[0, 0.062, 0.115]} castShadow>
        <boxGeometry args={[0.2, 0.014, 0.024]} />
        <meshStandardMaterial color="#2a2d35" roughness={0.6} metalness={0.1} />
      </mesh>
    </group>
  );
}
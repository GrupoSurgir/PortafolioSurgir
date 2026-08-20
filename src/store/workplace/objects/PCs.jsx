import { useRef } from "react";
import { useFrame } from "@react-three/fiber";

// Torres de PC para el Workplace Builder. Origen apoyado sobre el escritorio.
// Evolución visual clara: Basic -> Pro -> RGB -> Premium.

const BODY = "#2a2d35";
const BODY2 = "#1d2026";

const mat = (color, o = {}) => ({
  color,
  roughness: o.roughness ?? 0.55,
  metalness: o.metalness ?? 0.15,
});

function RGBMaterial() {
  const ref = useRef();
  useFrame(({ clock }) => {
    if (ref.current) ref.current.emissive.setHSL((clock.elapsedTime * 0.15) % 1, 0.9, 0.55);
  });
  return (
    <meshStandardMaterial
      ref={ref}
      color="#0a0d14"
      emissive="#ff00ff"
      emissiveIntensity={1.6}
      toneMapped={false}
    />
  );
}

function HorizontalRGBStrip({ y = 0.28, z = 0 }) {
  const ref = useRef();
  useFrame(({ clock }) => {
    if (ref.current) ref.current.emissive.setHSL((clock.elapsedTime * 0.1) % 1, 0.8, 0.5);
  });
  return (
    <mesh position={[0, y, z]}>
      <boxGeometry args={[0.2, 0.02, 0.01]} />
      <meshStandardMaterial
        ref={ref}
        color="#0a0d14"
        emissive="#22d3ee"
        emissiveIntensity={1.8}
        toneMapped={false}
      />
    </mesh>
  );
}

export function PCBasic() {
  return (
    <group>
      <mesh position={[0, 0.225, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.22, 0.45, 0.46]} />
        <meshStandardMaterial {...mat(BODY)} />
      </mesh>
      {[-0.12, -0.06, 0, 0.06, 0.12].map((y) => (
        <mesh key={y} position={[0.111, 0.225 + y, 0]}>
          <boxGeometry args={[0.005, 0.02, 0.34]} />
          <meshStandardMaterial {...mat(BODY2)} />
        </mesh>
      ))}
      <mesh position={[0.112, 0.4, 0.12]}>
        <boxGeometry args={[0.006, 0.012, 0.012]} />
        <meshStandardMaterial
          color="#0a0a0b"
          emissive="#2a5f63"
          emissiveIntensity={0.8}
          toneMapped={false}
        />
      </mesh>
      <mesh position={[0, 0.015, 0]} castShadow>
        <boxGeometry args={[0.18, 0.03, 0.4]} />
        <meshStandardMaterial {...mat(BODY2)} />
      </mesh>
    </group>
  );
}

export function PCPro() {
  return (
    <group>
      <mesh position={[0, 0.245, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.24, 0.49, 0.48]} />
        <meshStandardMaterial {...mat(BODY)} />
      </mesh>
      <mesh position={[0.121, 0.245, 0]}>
        <boxGeometry args={[0.008, 0.36, 0.34]} />
        <meshStandardMaterial {...mat(BODY2, { metalness: 0.3 })} />
      </mesh>
      {[-0.1, -0.04, 0.02, 0.08].map((y) => (
        <mesh key={y} position={[0.126, 0.245 + y, 0]}>
          <boxGeometry args={[0.004, 0.03, 0.3]} />
          <meshStandardMaterial color="#0a0d14" />
        </mesh>
      ))}
      <mesh position={[0.132, 0.245, 0]}>
        <boxGeometry args={[0.006, 0.3, 0.01]} />
        <meshStandardMaterial
          color="#0a2a31"
          emissive="#22d3ee"
          emissiveIntensity={1.4}
          toneMapped={false}
        />
      </mesh>
      <mesh position={[0, 0.015, 0]} castShadow>
        <boxGeometry args={[0.18, 0.03, 0.42]} />
        <meshStandardMaterial {...mat(BODY2)} />
      </mesh>
    </group>
  );
}

export function PCRGB() {
  return (
    <group>
      <mesh position={[0, 0.255, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.26, 0.51, 0.5]} />
        <meshStandardMaterial {...mat(BODY)} />
      </mesh>
      <mesh position={[0, 0.255, 0.252]} castShadow>
        <boxGeometry args={[0.24, 0.4, 0.01]} />
        <meshStandardMaterial
          color="#0d1b26"
          roughness={0.2}
          metalness={0.6}
          transparent
          opacity={0.85}
        />
      </mesh>
      <mesh position={[0.132, 0.255, 0]}>
        <boxGeometry args={[0.01, 0.42, 0.01]} />
        <RGBMaterial />
      </mesh>
      {[0.2, 0.05].map((y) => (
        <mesh
          key={y}
          position={[0.134, 0.255 + y, -0.16]}
          rotation={[0, Math.PI / 2, 0]}
          castShadow
        >
          <cylinderGeometry args={[0.07, 0.07, 0.008, 20]} />
          <meshStandardMaterial
            color="#0a0d14"
            emissive="#ff00ff"
            emissiveIntensity={1.1}
            toneMapped={false}
          />
        </mesh>
      ))}
      <mesh position={[0, 0.015, 0]} castShadow>
        <boxGeometry args={[0.2, 0.03, 0.44]} />
        <meshStandardMaterial {...mat(BODY2)} />
      </mesh>
    </group>
  );
}

export function PCPremium() {
  return (
    <group>
      <mesh position={[0, 0.28, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.28, 0.56, 0.54]} />
        <meshStandardMaterial color="#1c1f26" roughness={0.35} metalness={0.7} />
      </mesh>
      <mesh position={[0.141, 0.28, 0]} castShadow>
        <boxGeometry args={[0.008, 0.44, 0.5]} />
        <meshStandardMaterial color="#10131a" roughness={0.25} metalness={0.8} />
      </mesh>
      <HorizontalRGBStrip y={0.28} />
      <mesh position={[0, 0.585, 0]} castShadow>
        <boxGeometry args={[0.2, 0.02, 0.4]} />
        <meshStandardMaterial {...mat(BODY2, { metalness: 0.6 })} />
      </mesh>
      <mesh position={[0, 0.02, 0]} castShadow>
        <boxGeometry args={[0.22, 0.04, 0.46]} />
        <meshStandardMaterial {...mat(BODY2, { metalness: 0.4 })} />
      </mesh>
    </group>
  );
}
// Ratones para el Workplace Builder. Origen apoyado sobre el escritorio.

const mat = (color, o = {}) => ({
  color,
  roughness: o.roughness ?? 0.55,
  metalness: o.metalness ?? 0.15,
});

export function MouseBasic() {
  return (
    <group>
      <mesh position={[0, 0.015, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.06, 0.03, 0.1]} />
        <meshStandardMaterial {...mat("#272932")} />
      </mesh>
      <mesh position={[0, 0.035, -0.02]} castShadow>
        <boxGeometry args={[0.02, 0.01, 0.02]} />
        <meshStandardMaterial {...mat("#1d2026")} />
      </mesh>
    </group>
  );
}

export function MousePro() {
  return (
    <group>
      <mesh position={[0, 0.012, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.065, 0.024, 0.11]} />
        <meshStandardMaterial {...mat("#2a2d35", { metalness: 0.2 })} />
      </mesh>
      <mesh position={[0, 0.032, 0.005]} castShadow>
        <boxGeometry args={[0.05, 0.022, 0.08]} />
        <meshStandardMaterial {...mat("#33363f", { metalness: 0.2 })} />
      </mesh>
      <mesh position={[0, 0.05, -0.02]} castShadow>
        <boxGeometry args={[0.016, 0.012, 0.02]} />
        <meshStandardMaterial {...mat("#1d2026")} />
      </mesh>
      <mesh position={[0, 0.02, 0.045]}>
        <boxGeometry args={[0.03, 0.004, 0.006]} />
        <meshStandardMaterial
          color="#0a2a31"
          emissive="#22d3ee"
          emissiveIntensity={1}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

export function MouseRGB() {
  return (
    <group>
      <mesh position={[0, 0.012, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.065, 0.024, 0.11]} />
        <meshStandardMaterial {...mat("#2a2d35", { metalness: 0.2 })} />
      </mesh>
      <mesh position={[0, 0.032, 0.005]} castShadow>
        <boxGeometry args={[0.05, 0.022, 0.08]} />
        <meshStandardMaterial {...mat("#33363f", { metalness: 0.2 })} />
      </mesh>
      <mesh position={[0, 0.05, -0.02]} castShadow>
        <boxGeometry args={[0.016, 0.012, 0.02]} />
        <meshStandardMaterial {...mat("#1d2026")} />
      </mesh>
      <mesh position={[0, 0.02, 0.045]}>
        <boxGeometry args={[0.03, 0.004, 0.006]} />
        <meshStandardMaterial
          color="#0a0d14"
          emissive="#a855f7"
          emissiveIntensity={1.2}
          toneMapped={false}
        />
      </mesh>
      <mesh position={[0, 0.02, 0.005]}>
        <boxGeometry args={[0.058, 0.004, 0.005]} />
        <meshStandardMaterial
          color="#0a0d14"
          emissive="#22d3ee"
          emissiveIntensity={1.4}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}
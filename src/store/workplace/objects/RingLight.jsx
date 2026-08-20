import { useMemo } from "react";
import * as THREE from "three";

// Aro de luz (Ring Light) para el Workplace Builder.
//
// Cambia de color EN TIEMPO REAL: el material emisivo del aro, el halo suave y
// (en calidad media/alta) una luz local puntual usan el mismo `color`.
// La base es fija; solo el aro/halo/luz dependen del color elegido.

const mat = (color, o = {}) => ({
  color,
  roughness: o.roughness ?? 0.5,
  metalness: o.metalness ?? 0.2,
});

function GlowTexture() {
  return useMemo(() => {
    const size = 256;
    const c = document.createElement("canvas");
    c.width = c.height = size;
    const ctx = c.getContext("2d");
    const g = ctx.createRadialGradient(
      size / 2,
      size / 2,
      8,
      size / 2,
      size / 2,
      size / 2
    );
    g.addColorStop(0, "rgba(255,255,255,0.38)");
    g.addColorStop(0.5, "rgba(255,255,255,0.12)");
    g.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, size, size);
    const tex = new THREE.CanvasTexture(c);
    tex.needsUpdate = true;
    return tex;
  }, []);
}

function Base({ height = 0.38 }) {
  return (
    <group>
      <mesh position={[0, 0.03, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.09, 0.1, 0.06, 20]} />
        <meshStandardMaterial {...mat("#1d2026", { metalness: 0.3 })} />
      </mesh>
      <mesh position={[0, 0.06 + height / 2, 0]} castShadow>
        <cylinderGeometry args={[0.03, 0.045, height, 12]} />
        <meshStandardMaterial {...mat("#272a31")} />
      </mesh>
    </group>
  );
}

export function RingLightBasic({ color = "#ffffff", quality = "medium" }) {
  const glowTex = GlowTexture();
  const ringY = 0.48;
  const on = quality !== "low";
  return (
    <group>
      <Base height={0.4} />
      <mesh position={[0, ringY, 0]} castShadow>
        <torusGeometry args={[0.16, 0.025, 16, 40]} />
        <meshStandardMaterial
          color="#1a1d24"
          emissive={color}
          emissiveIntensity={quality === "high" ? 1.8 : 1.3}
          toneMapped={false}
        />
      </mesh>
      <mesh position={[0, ringY, 0.02]}>
        <planeGeometry args={[0.55, 0.55]} />
        <meshBasicMaterial
          map={glowTex}
          color={color}
          transparent
          depthWrite={false}
          opacity={0.55}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      {on && (
        <pointLight
          position={[0, ringY, 0.25]}
          color={color}
          intensity={quality === "high" ? 6 : 3}
          distance={4}
          decay={2}
        />
      )}
    </group>
  );
}

export function RingLightPro({ color = "#ffffff", quality = "medium" }) {
  const glowTex = GlowTexture();
  const ringY = 0.62;
  const on = quality !== "low";
  return (
    <group>
      <Base height={0.52} />
      <mesh position={[0, ringY, 0]} castShadow>
        <torusGeometry args={[0.22, 0.028, 16, 48]} />
        <meshStandardMaterial
          color="#14171d"
          emissive={color}
          emissiveIntensity={quality === "high" ? 2 : 1.5}
          toneMapped={false}
        />
      </mesh>
      <mesh position={[0, ringY, 0]} castShadow>
        <torusGeometry args={[0.15, 0.014, 16, 40]} />
        <meshStandardMaterial
          color="#14171d"
          emissive={color}
          emissiveIntensity={quality === "high" ? 1.6 : 1.2}
          toneMapped={false}
        />
      </mesh>
      <mesh position={[0, ringY, 0.005]}>
        <circleGeometry args={[0.13, 24]} />
        <meshStandardMaterial
          color="#101319"
          roughness={0.4}
          metalness={0.3}
        />
      </mesh>
      <mesh position={[0, ringY, 0.02]}>
        <planeGeometry args={[0.7, 0.7]} />
        <meshBasicMaterial
          map={glowTex}
          color={color}
          transparent
          depthWrite={false}
          opacity={0.65}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      {on && (
        <pointLight
          position={[0, ringY, 0.3]}
          color={color}
          intensity={quality === "high" ? 9 : 4.5}
          distance={5}
          decay={2}
        />
      )}
    </group>
  );
}
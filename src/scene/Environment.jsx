// Entorno de SURGIR: un espacio cósmico infinito. NO hay habitación: no hay
// suelo, paredes ni techo. El PC/setup es el único elemento físico y flota
// suspendido en el vacío. El sentido de profundidad e infinito se construye
// con capas de estrellas, nebulosas, polvo y galaxias lejanas a distintas
// profundidades (parallax natural al orbitar). Una pequeña plataforma
// tecnológica minimalista ancla el setup sin cerrar el espacio.

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/* ---------- Texturas procedurales (sin assets externos) ---------- */

function makeStarTexture() {
  const c = document.createElement("canvas");
  c.width = c.height = 32;
  const ctx = c.getContext("2d");
  const g = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.35, "rgba(255,255,255,0.7)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 32, 32);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function makeNebulaTexture() {
  const c = document.createElement("canvas");
  c.width = c.height = 256;
  const ctx = c.getContext("2d");
  const g = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
  g.addColorStop(0, "rgba(255,255,255,0.9)");
  g.addColorStop(0.25, "rgba(255,255,255,0.35)");
  g.addColorStop(0.6, "rgba(255,255,255,0.08)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 256, 256);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

/* ---------- Geometrías de puntos ---------- */

function randShell(rMin, rMax) {
  const u = Math.random();
  const v = Math.random();
  const theta = 2 * Math.PI * u;
  const phi = Math.acos(2 * v - 1);
  const r = rMin + Math.random() * (rMax - rMin);
  return [
    r * Math.sin(phi) * Math.cos(theta),
    r * Math.cos(phi),
    r * Math.sin(phi) * Math.sin(theta),
  ];
}

function buildPoints(count, rMin, rMax, tint) {
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const c = new THREE.Color();
  for (let i = 0; i < count; i++) {
    const p = randShell(rMin, rMax);
    positions[i * 3] = p[0];
    positions[i * 3 + 1] = p[1];
    positions[i * 3 + 2] = p[2];
    const t = Math.random();
    if (t < 0.7) c.setHSL(0.6, 0.12, tint); // blanco azulado
    else if (t < 0.9) c.setHSL(0.55, 0.22, tint - 0.05); // cian pálido
    else c.setHSL(0.08, 0.25, tint - 0.05); // cálido tenue
    colors[i * 3] = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  g.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  return g;
}

/* ---------- Capas del cosmos ---------- */

function Starfield({ starTex }) {
  // Tres capas a distintas profundidades -> parallax al orbitar/zoom.
  const near = useMemo(() => buildPoints(1600, 22, 70, 0.9), []);
  const mid = useMemo(() => buildPoints(2000, 70, 220, 0.85), []);
  const far = useMemo(() => buildPoints(2800, 220, 620, 0.8), []);
  return (
    <group>
      <points geometry={near}>
        <pointsMaterial
          size={0.32}
          sizeAttenuation
          map={starTex}
          vertexColors
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
      <points geometry={mid}>
        <pointsMaterial
          size={0.22}
          sizeAttenuation
          map={starTex}
          vertexColors
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
      <points geometry={far}>
        <pointsMaterial
          size={0.5}
          sizeAttenuation
          map={starTex}
          vertexColors
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}

function Nebulae({ tex }) {
  // Nubes galácticas extremadamente sutiles, muy lejanas.
  const items = [
    { pos: [-45, 22, -130], scale: [170, 170, 1], color: "#3a4d8f", opacity: 0.16 },
    { pos: [65, -12, -170], scale: [240, 240, 1], color: "#5a3a7a", opacity: 0.13 },
    { pos: [12, 46, -240], scale: [320, 320, 1], color: "#2a6a7a", opacity: 0.11 },
    { pos: [-90, -34, -210], scale: [210, 210, 1], color: "#6a3a55", opacity: 0.09 },
  ];
  return (
    <group>
      {items.map((n, i) => (
        <sprite key={i} position={n.pos} scale={n.scale}>
          <spriteMaterial
            map={tex}
            color={n.color}
            transparent
            opacity={n.opacity}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </sprite>
      ))}
    </group>
  );
}

function Galaxies({ tex }) {
  // Dos galaxias lejanas para dar escala y profundidad extrema.
  const items = [
    { pos: [120, 60, -360], scale: [90, 90, 1], color: "#9fb6e0", opacity: 0.22 },
    { pos: [-140, -50, -420], scale: [120, 120, 1], color: "#caa6e0", opacity: 0.18 },
  ];
  return (
    <group>
      {items.map((n, i) => (
        <sprite key={i} position={n.pos} scale={n.scale}>
          <spriteMaterial
            map={tex}
            color={n.color}
            transparent
            opacity={n.opacity}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </sprite>
      ))}
    </group>
  );
}

function CosmicDust() {
  // Polvo flotante cercano: refuerza el parallax y la sensación de volumen.
  const ref = useRef();
  const geo = useMemo(() => buildPoints(700, 3, 42, 0.8), []);
  useFrame((_, d) => {
    if (ref.current) {
      ref.current.rotation.y += d * 0.012;
      ref.current.rotation.x += d * 0.004;
    }
  });
  return (
    <points ref={ref} geometry={geo}>
      <pointsMaterial
        size={0.07}
        sizeAttenuation
        color="#9fb4d0"
        transparent
        opacity={0.35}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function Platform() {
  // Pequeña plataforma tecnológica minimalista que ancla el setup sin cerrar
  // el espacio: un disco fino con un anillo emisivo tenue.
  return (
    <group position={[0, 0, -0.1]}>
      <mesh>
        <cylinderGeometry args={[2.4, 2.6, 0.08, 56]} />
        <meshStandardMaterial color="#0c0e13" roughness={0.5} metalness={0.7} />
      </mesh>
      <mesh position={[0, 0.045, 0]}>
        <torusGeometry args={[2.42, 0.012, 10, 80]} />
        <meshStandardMaterial
          color="#0a0a0b"
          emissive="#2bd6e0"
          emissiveIntensity={1.1}
          toneMapped={false}
        />
      </mesh>
      <mesh position={[0, 0.045, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.5, 0.006, 8, 64]} />
        <meshStandardMaterial
          color="#0a0a0b"
          emissive="#3a6ad0"
          emissiveIntensity={0.7}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

export default function Environment({ environmentId }) {
  const starTex = useMemo(makeStarTexture, []);
  const nebTex = useMemo(makeNebulaTexture, []);

  return (
    <group>
      {/* Vacío cósmico infinito (sin suelo, paredes ni techo). */}
      <Starfield starTex={starTex} />
      <Nebulae tex={nebTex} />
      <Galaxies tex={nebTex} />
      <CosmicDust />

      {/* El setup flota sobre una plataforma tecnológica minimalista. */}
      <Platform />
    </group>
  );
}

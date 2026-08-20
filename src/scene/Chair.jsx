import { useMemo } from "react";
import * as THREE from "three";

// Silla plástica tipo Rimax Dinastía (blanca, respaldo alto, apoyabrazos),
// construida con geometría primitiva para mantener rendimiento y estilo limpio.
//
// Preparada para personalización futura: acepta `position`, `rotationY`,
// `color` y un callback de selección. En esta fase se integra como mobiliario
// del setup 3D actual (frente al escritorio, alineada con monitor y PC).

const CHAIR_WHITE = "#e9ebee";
const CHAIR_SHADOW = "#aeb2ba";

// Decal de sombra suave bajo la silla (sin shadow maps: coherente con la
// escena, que no renderiza sombras). Mantiene la silla "pegada" al suelo.
function useSoftShadowTexture() {
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
    g.addColorStop(0, "rgba(0,0,0,0.45)");
    g.addColorStop(0.55, "rgba(0,0,0,0.22)");
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, size, size);
    const tex = new THREE.CanvasTexture(c);
    tex.needsUpdate = true;
    return tex;
  }, []);
}

// Patas ligeramente abiertas (splay) para estabilidad visual.
const LEGS = [
  { pos: [-0.19, 0.23, -0.17], rot: [0.06, 0, -0.05] },
  { pos: [0.19, 0.23, -0.17], rot: [0.06, 0, 0.05] },
  { pos: [-0.19, 0.23, 0.17], rot: [-0.06, 0, -0.05] },
  { pos: [0.19, 0.23, 0.17], rot: [-0.06, 0, 0.05] },
];

export default function Chair({
  position = [0, 0, 0.92],
  rotationY = 0,
  color = CHAIR_WHITE,
  shadow = true,
  selectable = false,
  onSelect = null,
}) {
  const shadowTex = useSoftShadowTexture();
  const plastico = { color, roughness: 0.55, metalness: 0.05 };

  return (
    <group
      position={position}
      rotation={[0, rotationY, 0]}
      onClick={
        selectable && onSelect
          ? (e) => {
              e.stopPropagation();
              onSelect();
            }
          : undefined
      }
    >
      {/* Sombra suave de contacto (decal) */}
      {shadow && (
        <mesh
          rotation-x={-Math.PI / 2}
          position={[0, 0.005, 0]}
          receiveShadow
        >
          <planeGeometry args={[1.0, 1.0]} />
          <meshBasicMaterial
            map={shadowTex}
            transparent
            depthWrite={false}
          />
        </mesh>
      )}

      {/* Patas (4) */}
      {LEGS.map((l, i) => (
        <mesh
          key={i}
          position={l.pos}
          rotation={l.rot}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[0.034, 0.46, 0.034]} />
          <meshStandardMaterial {...plastico} />
        </mesh>
      ))}

      {/* Asiento */}
      <mesh position={[0, 0.485, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.45, 0.05, 0.42]} />
        <meshStandardMaterial {...plastico} />
      </mesh>

      {/* Respaldo alto con perforaciones (detalle Dinastía) */}
      <group position={[0, 0.79, 0.21]} rotation={[0.04, 0, 0]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.44, 0.58, 0.05]} />
          <meshStandardMaterial {...plastico} />
        </mesh>
        {/* Ranuras verticales que atraviesan el respaldo (simulan perforación) */}
        {[-0.12, 0, 0.12].map((x) => (
          <mesh key={x} position={[x, 0, 0]}>
            <boxGeometry args={[0.018, 0.38, 0.055]} />
            <meshStandardMaterial color={CHAIR_SHADOW} roughness={1} metalness={0} />
          </mesh>
        ))}
      </group>

      {/* Apoyabrazos (2) */}
      {[-1, 1].map((s) => (
        <group key={s} position={[0.235 * s, 0, 0]}>
          <mesh position={[0, 0.63, 0.02]} castShadow>
            <boxGeometry args={[0.05, 0.03, 0.2]} />
            <meshStandardMaterial {...plastico} />
          </mesh>
          <mesh position={[0, 0.56, -0.06]} castShadow>
            <boxGeometry args={[0.035, 0.17, 0.035]} />
            <meshStandardMaterial {...plastico} />
          </mesh>
          <mesh position={[0, 0.72, 0.14]} castShadow>
            <boxGeometry args={[0.04, 0.17, 0.04]} />
            <meshStandardMaterial {...plastico} />
          </mesh>
        </group>
      ))}
    </group>
  );
}
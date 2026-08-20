import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import WorkplaceObject, { WorkplaceRingLight } from "./WorkplaceObject.jsx";
import { builderProductById } from "../../data/customization/products.js";

// Escritorio base del Builder (misma geometría/colores que Workstation.jsx).
const DESK_TOP_Y = 0.74;

function Desk() {
  return (
    <group>
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
      {/* Suelo oscuro que recibe sombras en calidad alta */}
      <mesh rotation-x={-Math.PI / 2} position={[0, 0.002, 0]} receiveShadow>
        <planeGeometry args={[3.6, 2.8]} />
        <meshStandardMaterial color="#0b0f1a" roughness={1} />
      </mesh>
    </group>
  );
}

function Contents({ state, ringProduct, ringColor, quality, controlsRef }) {
  const shadows = quality.level.shadows;
  return (
    <>
      <ambientLight intensity={0.9} color="#aab6cc" />
      <hemisphereLight color="#7d92c0" groundColor="#0a0e1a" intensity={0.8} />
      <directionalLight
        position={[4, 6, 5]}
        intensity={1.4}
        color="#bcd0ea"
        castShadow={shadows}
      />
      <directionalLight position={[-4, 3, -4]} intensity={0.5} color="#5b6a9a" />
      <pointLight
        position={[-2, 2.2, -1.5]}
        intensity={6}
        distance={14}
        decay={2}
        color="#3fa9d6"
      />
      <pointLight
        position={[2.4, 1.2, 1.8]}
        intensity={5}
        distance={14}
        decay={2}
        color="#9a7be0"
      />

      <Desk />

      {["monitor", "pc", "keyboard", "mouse"].map((slot) => (
        <WorkplaceObject
          key={slot}
          slot={slot}
          product={builderProductById(state[slot])}
          quality={quality.tier}
        />
      ))}
      <WorkplaceRingLight
        product={ringProduct}
        color={ringColor}
        quality={quality.tier}
      />

      <OrbitControls
        ref={controlsRef}
        makeDefault
        enableDamping
        dampingFactor={0.08}
        rotateSpeed={0.6}
        zoomSpeed={0.8}
        enablePan={false}
        minDistance={1.3}
        maxDistance={6}
        minPolarAngle={0.2}
        maxPolarAngle={1.45}
        target={[0, 0.9, -0.1]}
      />
    </>
  );
}

export default function WorkplaceScene({
  state,
  ringProduct,
  ringColor,
  quality,
  controlsRef,
}) {
  return (
    <Canvas
      camera={{ fov: 45, near: 0.05, far: 100, position: [1.9, 1.5, 2.6] }}
      dpr={quality.level.dpr}
      shadows={quality.level.shadows}
      gl={{ antialias: true }}
      onCreated={({ gl }) => {
        gl.setClearColor("#0a0e1c", 1);
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.3;
      }}
    >
      <Contents
        state={state}
        ringProduct={ringProduct}
        ringColor={ringColor}
        quality={quality}
        controlsRef={controlsRef}
      />
    </Canvas>
  );
}
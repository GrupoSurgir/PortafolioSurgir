import { useEffect, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import Environment from "./Environment.jsx";
import Workstation from "./Workstation.jsx";
import { WORKSTATIONS } from "../data/workspaces.js";
import { computeWake } from "../wake.js";
import { getEnvironment } from "../environments.js";

// Controles de órbita: el PC/setup es el CENTRO. El usuario orbita y explora
// alrededor de él (no camina por una habitación). Damping para inercia suave.
// Al hacer click en el PC, la cámara viaja sola para "observarlo" (startFocus).
function CameraControls({ pcRef }) {
  const ref = useRef();
  const { camera } = useThree();

  // El click en el PC dispara esto: la cámara se alinea frente a la pantalla
  // para leer la web, luego queda orbitando alrededor del setup.
  pcRef.current.startFocus = (monitorPos, monitorQuat) => {
    const pc = pcRef.current;
    const forward = new THREE.Vector3(0, 0, 1)
      .applyQuaternion(monitorQuat)
      .normalize();
    const up = new THREE.Vector3(0, 1, 0);
    const right = new THREE.Vector3()
      .crossVectors(forward, up)
      .normalize();

    // Distancia para que la pantalla ocupe ~55% del alto del viewport.
    const screenH = 0.52;
    const frac = 0.55;
    const vFov = THREE.MathUtils.degToRad(camera.fov);
    const D = screenH / 2 / (frac * Math.tan(vFov / 2));
    const h = 0.1;
    const r = 0.12;

    pc.toTarget = monitorPos.clone();
    pc.toPos = monitorPos
      .clone()
      .add(forward.clone().multiplyScalar(D))
      .add(up.clone().multiplyScalar(h))
      .add(right.clone().multiplyScalar(r));
    pc.fromPos = camera.position.clone();
    pc.fromTarget = ref.current ? ref.current.target.clone() : new THREE.Vector3();
    pc.focusElapsed = 0;
    pc.duration = 1.0;
    pc.settled = false;
    pc.state = "focusing";
  };

  // INTRODUCCIÓN EN EL MONITOR: la cámara primero se alinea JUSTO AL FRENTE de
  // la pantalla (el lado donde se proyectó la animación de arranque) y luego
  // se sumerge recto A TRAVÉS del vidrio. Así entra por el lado de la animación
  // y no "da la vuelta" rodeando el PC.
  pcRef.current.startEnter = (monitorPos, monitorQuat) => {
    const pc = pcRef.current;
    const forward = new THREE.Vector3(0, 0, 1)
      .applyQuaternion(monitorQuat)
      .normalize();
    const center = monitorPos.clone();
    const dist = Math.max(1.2, camera.position.distanceTo(center));
    const frontPos = center
      .clone()
      .add(forward.clone().multiplyScalar(dist)); // directamente al frente
    const behindPos = center
      .clone()
      .add(forward.clone().multiplyScalar(-0.12)); // atraviesa el vidrio
    pc.fromPos = camera.position.clone();
    pc.midPos = frontPos;
    pc.toEnterPos = behindPos;
    pc.fromTarget = ref.current
      ? ref.current.target.clone()
      : center.clone();
    pc.enterTarget = center.clone();
    pc.enterElapsed = 0;
    pc.enterSeg1 = 0.35; // encuadre al frente
    pc.enterSeg2 = 0.8; // inmersión recta
    pc.enterDuration = pc.enterSeg1 + pc.enterSeg2;
    pc.enterCalled = false;
    pc.state = "enter";
  };

  // Vuelve a la pose de observación (usado al salir de la web fullscreen).
  pcRef.current.resetView = () => {
    const pc = pcRef.current;
    camera.position.set(3.0, 1.7, 3.8);
    if (ref.current) {
      ref.current.target.set(0, 0.95, -0.35);
      ref.current.update();
    }
    pc.state = "idle";
    pc.booting = false;
    pc.settled = true;
    pc.toTarget = new THREE.Vector3(0, 0.95, -0.35);
    pc.toPos = new THREE.Vector3(3.0, 1.7, 3.8);
  };

  // Valores iniciales seguros: hasta que el usuario haga click en el PC para
  // enfocarlo, toTarget/toPos NO existen; el OrbitControls libre debe poder
  // orbitar sin que el copiado de un vector indefinido rompa el render loop.
  useEffect(() => {
    const pc = pcRef.current;
    if (pc) {
      pc.state = pc.state || "idle";
      pc.settled = true;
      pc.toTarget = pc.toTarget || new THREE.Vector3(0, 0.95, -0.35);
      pc.toPos = pc.toPos || new THREE.Vector3(3.0, 1.7, 3.8);
      pc.panelOpen = false;
      pc.booting = false;
    }
  }, [pcRef]);

  useFrame((_, delta) => {
    const pc = pcRef.current;
    const controls = ref.current;
    if (!controls || !pc) return;

    if (pc.state === "focusing") {
      controls.enabled = false;
      pc.focusElapsed += delta;
      const u = Math.min(pc.focusElapsed / pc.duration, 1);
      const e = 1 - Math.pow(1 - u, 3);
      camera.position.lerpVectors(pc.fromPos, pc.toPos, e);
      controls.target.lerpVectors(pc.fromTarget, pc.toTarget, e);
      controls.update();
      if (u >= 1) {
        pc.state = "active";
        pc.settled = false;
      }
    } else if (pc.state === "enter") {
      controls.enabled = false;
      pc.enterElapsed += delta;
      const c = pc.enterElapsed;
      let pos;
      if (c < pc.enterSeg1) {
        // Fase 1: encuadrar justo al frente de la pantalla (sin rodear el PC).
        const u = c / pc.enterSeg1;
        const e = 1 - Math.pow(1 - u, 3);
        pos = pc.fromPos.clone().lerp(pc.midPos, e);
        controls.target.copy(pc.fromTarget.clone().lerp(pc.enterTarget, e));
      } else {
        // Fase 2: inmersión recta a través de la pantalla.
        const u = (c - pc.enterSeg1) / pc.enterSeg2;
        const e = 1 - Math.pow(1 - u, 3);
        pos = pc.midPos.clone().lerp(pc.toEnterPos, e);
        controls.target.copy(pc.enterTarget);
        if (u >= 0.5 && !pc.enterCalled) {
          pc.enterCalled = true;
          if (pc.onEnterPage) pc.onEnterPage();
        }
      }
      camera.position.copy(pos);
      controls.update();
      if (c >= pc.enterDuration) pc.state = "entered";
    } else {
      if (pc.toTarget && pc.toPos && !pc.settled) {
        controls.target.copy(pc.toTarget);
        camera.position.copy(pc.toPos);
        controls.update();
        controls.update();
        pc.settled = true;
      }
    }

    // Durante el boot/entrada la cámara queda bloqueada: el usuario observa el
    // arranque del PC en lugar de orbitar.
    const lock = pc.state === "focusing" || pc.state === "enter" || pc.booting;
    controls.enabled = !lock && !pc.panelOpen;
  });

  return (
    <OrbitControls
      ref={ref}
      makeDefault
      enableDamping
      dampingFactor={0.07}
      rotateSpeed={0.6}
      zoomSpeed={0.9}
      enablePan={false}
      minDistance={0.9}
      maxDistance={14}
      minPolarAngle={0.1}
      maxPolarAngle={Math.PI * 0.9}
      target={[0, 0.95, -0.35]}
    />
  );
}

function SceneContents({ wakeRef, startedRef, pcRef, environmentId, onGl }) {
  const { scene } = useThree();
  const tRef = useRef(0);
  const ambientRef = useRef();
  const envAmbRef = useRef();
  const envTarget = useRef(getEnvironment(environmentId));
  const cur = useRef({
    bg: new THREE.Color(),
    amb: new THREE.Color(),
    ambI: 0,
    init: false,
  });
  const tmpColor = useRef(new THREE.Color());

  useEffect(() => {
    envTarget.current = getEnvironment(environmentId);
  }, [environmentId]);

  useFrame((_, delta) => {
    if (startedRef.current) tRef.current += Math.min(delta, 0.05);
    const w = computeWake(tRef.current);
    wakeRef.current = w;

    // Fondo cósmico: crossfade de color (el "vacío" infinito). Sin niebla:
    // queremos que las estrellas/nebulosas lejanas sigan visibles.
    const tgt = envTarget.current;
    const c = cur.current;
    const tmp = tmpColor.current;
    if (!c.init) {
      c.bg.set(tgt.background);
      c.amb.set(tgt.ambient.color);
      c.ambI = tgt.ambient.intensity;
      c.init = true;
    }
    const k = 1 - Math.pow(0.0015, delta);
    c.bg.lerp(tmp.set(tgt.background), k);
    c.amb.lerp(tmp.set(tgt.ambient.color), k);
    c.ambI = THREE.MathUtils.lerp(c.ambI, tgt.ambient.intensity, k);

    scene.background = c.bg;
    if (envAmbRef.current) {
      envAmbRef.current.color.copy(c.amb);
      envAmbRef.current.intensity = c.ambI;
    }
  });

  return (
    <>
      {/* Iluminación cósmica estable (fija, sin parpadeos). El ESPACIO es la
          fuente dominante: ambient + cielo hemisférico espacial bañan todo el
          setup. Los rim lights solo dan acento de color en los bordes. Sin
          lámpara de habitación ni luz metida dentro del PC. */}
      <ambientLight ref={ambientRef} intensity={1.25} color="#aab6cc" />
      <ambientLight ref={envAmbRef} intensity={0.55} color="#8ea0c4" />
      <hemisphereLight
        color="#7d92c0"
        groundColor="#0a0e1a"
        intensity={1.0}
      />

      {/* Rim/accent lights tenues para recortar bordes contra el vacío. */}
      <pointLight
        position={[-2.4, 2.2, -1.6]}
        intensity={9}
        distance={16}
        decay={2}
        color="#3fa9d6"
      />
      <pointLight
        position={[2.6, 1.3, 1.8]}
        intensity={7}
        distance={16}
        decay={2}
        color="#9a7be0"
      />
      <pointLight
        position={[0.5, 3.2, 2.4]}
        intensity={5}
        distance={18}
        decay={2}
        color="#dfe7f2"
      />

      {/* Relleno suave desde el entorno/galaxia (sin objeto lámpara visible). */}
      <directionalLight position={[5, 7, 4]} intensity={1.0} color="#aebede" />
      <directionalLight position={[-4, 3, -5]} intensity={0.5} color="#5b6a9a" />

      <Environment environmentId={environmentId} />
      {WORKSTATIONS.map((w) => (
        <Workstation
          key={w.id}
          wakeRef={wakeRef}
          pcRef={pcRef}
          position={w.position}
          rotationY={w.rotationY}
          storeId={w.storeId}
        />
      ))}

      <CameraControls pcRef={pcRef} />
    </>
  );
}

export default function Scene({ wakeRef, startedRef, pcRef, environmentId, onGl }) {
  return (
    <Canvas
      camera={{ fov: 50, near: 0.05, far: 2000, position: [3.0, 1.7, 3.8] }}
      gl={{ antialias: true }}
      onCreated={({ gl }) => {
        gl.setClearColor("#0a0e1c", 1);
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.3;
        if (onGl) onGl(gl);
      }}
    >
      <SceneContents
        wakeRef={wakeRef}
        startedRef={startedRef}
        pcRef={pcRef}
        environmentId={environmentId}
        onGl={onGl}
      />
    </Canvas>
  );
}

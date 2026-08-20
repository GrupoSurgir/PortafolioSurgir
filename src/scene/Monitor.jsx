import { useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import StoreApp from "../store/StoreApp.jsx";

// Monitor de SURGIR — PC futurista en el espacio profundo.
//
// ESTADO INICIAL: el monitor está APAGADO y dormido. La pantalla es negra (sin
// emisión, sin luz artificial). El marco, el escritorio y el PC se reconocen por
// la iluminación del espacio; la pantalla es solo un rectángulo oscuro.
//
// PRIMER CLICK EXACTO -> BOOT SEQUENCE:
//   power line -> neon scan -> system UI -> revelado de la web -> cámara entra
//   en la pantalla -> web fullscreen.
//
// El PC PERMANECE ENCENDIDO durante toda la sesión. Al volver al espacio (ESC o
// el botón "Regresar" de la web) la cámara regresa a observar el monitor, que
// sigue mostrando una vista ligera de la ÚLTIMA página web visitada (sincronizada
// por hash). Un NUEVO click en la pantalla entra DIRECTAMENTE a la app, en la
// misma ruta, sin repetir el boot.
//
// La pantalla se ilumina SOLO mediante su propio contenido (emissiveMap). No hay
// PointLight/SpotLight fuerte delante del monitor: el "brillo" nace del arranque
// del sistema, no de una luz artificial permanente.

const W = 1024;
const H = 590;

function clamp01(x) {
  return Math.max(0, Math.min(1, x));
}
function smooth(a, b, x) {
  const t = clamp01((x - a) / (b - a));
  return t * t * (3 - 2 * t);
}

export default function Monitor({ pcRef, poweredOn, isPoweringOn, isPoweringOff, storeId = "surgir" }) {
  // Estados de transición de poder (refs para ser mutables desde useFrame)
  const isPoweringOnRef = useRef(isPoweringOn);
  const isPoweringOffRef = useRef(isPoweringOff);
  isPoweringOnRef.current = isPoweringOn;
  isPoweringOffRef.current = isPoweringOff;

  // Forzar boot de encendido (llamado desde App.jsx)
  const forceBoot = () => {
    isPoweringOnRef.current = true;
    // Reiniciar la máquina de estados del monitor para el boot
    st.current.clicked = false;
    st.current.t = 0;
    st.current.phase = "powering";
    enterStarted.current = false;
    revealStarted.current = false;
    setRevealed(false);
    // Reset hint
    setHint(true);
  };

  // Forzar apagado (llamado desde App.jsx)
  const forcePowerOff = () => {
    isPoweringOffRef.current = true;
    // Iniciar timeline de apagado inverso
    // Reiniciar t y phase para iniciar la animación inversa
    st.current.clicked = true;
    st.current.t = 0;
    s = st.current;
    s.phase = "powering";
  };
  const canvas = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = W;
    c.height = H;
    return c;
  }, []);

  const texture = useMemo(() => {
    const t = new THREE.CanvasTexture(canvas);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 4;
    t.needsUpdate = true;
    return t;
  }, [canvas]);

  // Logo de marca precargado para proyectarlo en la pantalla durante el boot.
  const logoImg = useMemo(() => {
    const img = new Image();
    img.src = "/logo.png";
    return img;
  }, []);

  const screenMat = useRef();
  const screenMeshRef = useRef();
  const panelRef = useRef();
  const grpRef = useRef();
  const down = useRef(null);

  // Máquina de estados del monitor:
  //   off -> powering(negro) -> power(linea) -> scan(neon) -> boot(ui) ->
  //   reveal(web) -> enter(camara) -> done
  const st = useRef({
    phase: "off",
    clicked: false,
    t: 0,
  });
  const revealStarted = useRef(false);
  const enterStarted = useRef(false);
  const [revealed, setRevealed] = useState(false);
  const [hint, setHint] = useState(true); // etiqueta sutil "[ EXPLORAR TIENDA ]"

  // La cámara entra en la pantalla y dispara la apertura de la web. Se usa tanto
  // al final del PRIMER boot como en los clicks posteriores (PC ya encendido).
  const enterNow = () => {
    if (enterStarted.current) return;
    enterStarted.current = true;
    const pos = new THREE.Vector3();
    const quat = new THREE.Quaternion();
    if (screenMeshRef.current) screenMeshRef.current.getWorldPosition(pos);
    if (grpRef.current) grpRef.current.getWorldQuaternion(quat);
    if (pcRef.current.startEnter) pcRef.current.startEnter(pos, quat);
  };

  // Dibuja la secuencia de arranque en el canvas de la pantalla.
  const draw = (bt, clicked) => {
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, W, H);

    // Fondo de pantalla (casi negro, con un leve realce para leerse como vidrio).
    ctx.fillStyle = "#05070b";
    ctx.fillRect(0, 0, W, H);

    if (!clicked) {
      // APAGADO: sin glow, solo un borde tenue para reconocer la pantalla.
      ctx.strokeStyle = "rgba(120,140,160,0.05)";
      ctx.lineWidth = 2;
      ctx.strokeRect(8, 8, W - 16, H - 16);
      texture.needsUpdate = true;
      return;
    }

    const cx = W / 2;
    const cy = H / 2;
    const NEON = "#7fe9ff";

    if (bt < 0.2) {
      // breve instante negro tras el click
      texture.needsUpdate = true;
      return;
    }

    // ---- FASE 1: POWER ON (0.2 - 0.6) ----
    if (bt < 0.6) {
      const p = clamp01((bt - 0.2) / 0.4);
      ctx.strokeStyle = NEON;
      ctx.lineWidth = 3;
      ctx.shadowColor = NEON;
      ctx.shadowBlur = 14;
      const halfW = (W * 0.5 - 50) * p;
      ctx.beginPath();
      ctx.moveTo(cx - halfW, cy);
      ctx.lineTo(cx + halfW, cy);
      ctx.stroke();
      if (p > 0.55) {
        const vp = clamp01((p - 0.55) / 0.45);
        const halfH = (H * 0.5 - 30) * vp;
        ctx.beginPath();
        ctx.moveTo(cx, cy - halfH);
        ctx.lineTo(cx, cy + halfH);
        ctx.stroke();
      }
      ctx.shadowBlur = 0;
      texture.needsUpdate = true;
      return;
    }

    // ---- FASE 2: NEON SCAN (0.6 - 1.2) ----
    if (bt < 1.2) {
      const s = (bt - 0.6) / 0.6;
      ctx.shadowColor = NEON;
      ctx.shadowBlur = 10;
      ctx.strokeStyle = "rgba(120,220,240,0.55)";
      ctx.lineWidth = 2;
      ctx.strokeRect(34, 34, W - 68, H - 68);

      const sy = 34 + (H - 68) * s;
      ctx.strokeStyle = "rgba(190,245,255,0.9)";
      ctx.beginPath();
      ctx.moveTo(34, sy);
      ctx.lineTo(W - 34, sy);
      ctx.stroke();

      [0.2, 0.4, 0.6, 0.8].forEach((fx, i) => {
        const x = 34 + (W - 68) * fx;
        const a = Math.max(0, Math.sin(s * Math.PI + i * 0.6));
        ctx.strokeStyle = `rgba(140,230,255,${0.12 + 0.5 * a})`;
        ctx.beginPath();
        ctx.moveTo(x, 34);
        ctx.lineTo(x, H - 34);
        ctx.stroke();
      });

      // cruz central que se ilumina
      const ca = smooth(0.3, 0.8, s);
      ctx.strokeStyle = `rgba(200,245,255,${0.25 + 0.6 * ca})`;
      ctx.lineWidth = 2;
      ctx.strokeRect(cx - 90, cy - 60, 180, 120);
      ctx.shadowBlur = 0;
      texture.needsUpdate = true;
      return;
    }

    // ---- FASE 3: SYSTEM UI (1.2 - 1.8) ----
    if (bt < 1.8) {
      const b = (bt - 1.2) / 0.6;
      ctx.shadowColor = NEON;
      ctx.shadowBlur = 8;
      ctx.strokeStyle = "rgba(120,220,240,0.6)";
      ctx.lineWidth = 2;
      ctx.strokeRect(44, 44, W - 88, H - 88);
      ctx.shadowBlur = 0;

      const lines = [
        "SYSTEM INITIALIZING",
        "CORE ONLINE",
        "DISPLAY LINK",
        "SURGIR",
      ];
      // Logo de marca sobre la pantalla (si la imagen cargó).
      if (logoImg.complete && logoImg.naturalWidth) {
        const lw = 220;
        const lh = lw * (logoImg.naturalHeight / logoImg.naturalWidth);
        const ly = cy - 120 - lh / 2;
        ctx.drawImage(logoImg, cx - lw / 2, ly, lw, lh);
      }
      ctx.textAlign = "center";
      ctx.font = '600 26px "Segoe UI", system-ui, sans-serif';
      lines.forEach((t, i) => {
        const lt = b - i * 0.18;
        if (lt > 0) {
          const a = Math.min(1, lt * 3);
          ctx.fillStyle = `rgba(205,242,255,${a})`;
          ctx.fillText(t, cx, cy - 40 + i * 40);
        }
      });
      const bw = W * 0.4;
      ctx.strokeStyle = "rgba(150,220,255,0.5)";
      ctx.lineWidth = 1.5;
      ctx.strokeRect(cx - bw / 2, cy + 92, bw, 6);
      ctx.fillStyle = "rgba(150,230,255,0.9)";
      ctx.fillRect(cx - bw / 2, cy + 92, bw * b, 6);
      texture.needsUpdate = true;
      return;
    }

    // ---- FASE 4: REVEAL (1.8 - 2.5) -> la web moderna aparece sobre la pantalla ----
    const r = clamp01((bt - 1.8) / 0.7);
    const a = Math.max(0, 1 - r);
    ctx.strokeStyle = `rgba(120,220,240,${0.5 * a})`;
    ctx.lineWidth = 2;
    ctx.strokeRect(44, 44, W - 88, H - 88);
    // esquinas tipo HUD elegante que se desvanecen
    const cs = 26;
    ctx.strokeStyle = `rgba(180,240,255,${0.7 * a})`;
    ctx.lineWidth = 2;
    [
      [44, 44, 1, 1],
      [W - 44, 44, -1, 1],
      [44, H - 44, 1, -1],
      [W - 44, H - 44, -1, -1],
    ].forEach(([x, y, sx, sy]) => {
      ctx.beginPath();
      ctx.moveTo(x, y + sy * cs);
      ctx.lineTo(x, y);
      ctx.lineTo(x + sx * cs, y);
      ctx.stroke();
    });
    texture.needsUpdate = true;
  };

  useFrame((_, delta) => {
    const pc = pcRef.current;
    const s = st.current;

    // Manejar transición de POWER ON
    if (isPoweringOnRef.current && !isPoweringOffRef.current) {
      // Animación de encendido existente
      const runningBoot = s.clicked && !poweredOn;
      if (runningBoot) {
        s.t += Math.min(delta, 0.05);
        if (s.t < 0.2) s.phase = "powering";
        else if (s.t < 0.6) s.phase = "power";
        else if (s.t < 1.2) s.phase = "scan";
        else if (s.t < 1.8) s.phase = "boot";
        else if (s.t < 2.5) s.phase = "reveal";
        else {
          // Boot completado: PC ahora encendido
          s.phase = "enter";
          isPoweringOnRef.current = false;
          setPoweredOn(true);
          setRevealed(true);
          revealStarted.current = false;
          enterStarted.current = false;
          s.clicked = false;
          s.t = 0;
          // Marcar que el usuario hizo click para mantener el estado
          // (el siguiente click entrará directo a StoreApp)
          setHint(false);
        }

        // Revelado de la web moderna sobre la pantalla.
        if (s.t >= 1.8 && !revealStarted.current) {
          revealStarted.current = true;
          setRevealed(true);
        }
        // Cámara entra en el monitor (al final del boot).
        if (s.t >= 2.5 && !enterStarted.current && pc.startEnter) {
          enterNow();
        }
      }

      // Redibujar la secuencia mientras corre el boot.
      if (!s.clicked || runningBoot || s.t < 2.5) draw(s.t, s.clicked);
      return;
    }

    // Manejar transición de POWER OFF (inverso al boot)
    if (isPoweringOffRef.current && !isPoweringOnRef.current) {
      // Animación de apagado: inverse al boot
      // Fases: powering → power → scan → boot → reveal → off
      // Empezamos desde donde esté, pero vamos hacia "off"
      
      // Si todavía estamos en estado encendido, empezar la inversa
      if (s.clicked && poweredOn) {
        s.t += Math.min(delta, 0.05);
        
        // Inverso al boot: desde el estado actual hacia off
        // powering: 0-0.2 (ir hacia off)
        // power: 0.2-0.6 (desvanecer neon)
        // scan: 0.6-1.2 (limpiar screen)
        // boot: 1.2-1.8 (desvanecer UI)
        // reveal: 1.8-2.5 (oscurecer pantalla)
        // off: 2.5+ (pantalla negra)
        
        if (s.t < 0.2) {
          s.phase = "powering";
        } else if (s.t < 0.6) {
          s.phase = "power";
        } else if (s.t < 1.2) {
          s.phase = "scan";
        } else if (s.t < 1.8) {
          s.phase = "boot";
        } else if (s.t < 2.5) {
          s.phase = "reveal";
        } else {
          // Apagado completado
          s.phase = "off";
          isPoweringOffRef.current = false;
          setPoweredOn(false);
          setRevealed(false);
          revealStarted.current = false;
          enterStarted.current = false;
          s.clicked = false;
          s.t = 0;
        }
      }

      // Redibujar secuencia de apagado
      // Durante apagado: mostrar según fase actual
      // powering: parches neon suaves que se apagan
      // power: neon disappears
      // screen: gradualmente más oscuro
      if (!s.clicked || s.t < 2.5) draw(s.t, s.clicked);
      return;
    }

    // Comportamiento normal cuando no hay transición de poder
    // Solo animar el boot si el PC aún no está encendido.
    // Si poweredOn es true, el boot ya se ejecutó y los clicks
    // entran directo a la web.
    const runningBoot = s.clicked && !poweredOn;

    if (runningBoot) {
      s.t += Math.min(delta, 0.05);
      if (s.t < 0.2) s.phase = "powering";
      else if (s.t < 0.6) s.phase = "power";
      else if (s.t < 1.2) s.phase = "scan";
      else if (s.t < 1.8) s.phase = "boot";
      else if (s.t < 2.5) s.phase = "reveal";
      else s.phase = "enter";

      // Revelado de la web moderna sobre la pantalla.
      if (s.t >= 1.8 && !revealStarted.current) {
        revealStarted.current = true;
        setRevealed(true);
      }
      // Cámara entra en el monitor (al final del boot).
      if (s.t >= 2.5 && !enterStarted.current && pc.startEnter) {
        enterNow();
      }
    }

    // Emisión de la pantalla: 0 apagada -> 1 al arrancar. La "luz" nace del
    // contenido (emissiveMap), no de una luz externa.
    let inten = 0;
    if (s.clicked) inten = s.t < 0.2 ? 0 : Math.min(1, (s.t - 0.2) / 0.1);
    if (screenMat.current) screenMat.current.emissiveIntensity = inten;

    // Redibujar la secuencia mientras corre el boot o si el PC está apagado.
    if (!s.clicked || runningBoot || s.t < 2.5) draw(s.t, s.clicked);
  });

  const onPointerDown = (e) => {
    down.current = { x: e.clientX, y: e.clientY };
  };
  const onPointerUp = (e) => {
    if (!down.current) return;
    const dx = e.clientX - down.current.x;
    const dy = e.clientY - down.current.y;
    down.current = null;
    if (dx * dx + dy * dy > 36) return; // fue arrastre, no click
    const s = st.current;
    const pc = pcRef.current;
    // Durante el boot el click queda bloqueado.
    if (pc.booting) return;
    // El PC ya está ENCENDIDO: entra directamente a la web, sin repetir el boot.
    if (poweredOn) {
      // PC already powered on: directly enter, no boot sequence
      if (screenMeshRef.current && grpRef.current && pcRef.current.startEnter) {
        const pos = new THREE.Vector3();
        const quat = new THREE.Quaternion();
        if (screenMeshRef.current) screenMeshRef.current.getWorldPosition(pos);
        if (grpRef.current) grpRef.current.getWorldQuaternion(quat);
        pcRef.current.startEnter(pos, quat);
      }
      return;
    }
    // PRIMER ENCENDIDO: se ejecuta la secuencia de arranque.
    if (enterStarted.current) {
      enterNow();
      return;
    }
    s.clicked = true;
    s.t = 0;
    s.phase = "powering";
    pc.booting = true;
    setHint(false);
  };
  const onPointerOver = () => {
    // El monitor siempre es clickeable en el espacio: encender (off) o
    // re-entrar a la última vista (ya encendido).
    document.body.style.cursor = "pointer";
  };
  const onPointerOut = () => {
    document.body.style.cursor = "default";
  };

  return (
    <group position={[0, 0, -0.5]} ref={grpRef}>
      {/* Base */}
      <mesh position={[0, 0.75, 0.02]} castShadow>
        <boxGeometry args={[0.26, 0.02, 0.18]} />
        <meshStandardMaterial color="#16171c" roughness={0.5} metalness={0.12} />
      </mesh>
      {/* Cuello */}
      <mesh position={[0, 0.84, 0.02]} castShadow>
        <boxGeometry args={[0.05, 0.2, 0.05]} />
        <meshStandardMaterial color="#16171c" roughness={0.5} metalness={0.12} />
      </mesh>
      {/* Panel (marco fino) — objetivo de interacción, sólido y seleccionable
          desde cualquier ángulo. */}
      <mesh
        ref={panelRef}
        position={[0, 1.14, 0]}
        castShadow
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerOver={onPointerOver}
        onPointerOut={onPointerOut}
      >
        <boxGeometry args={[0.96, 0.58, 0.04]} />
        <meshStandardMaterial color="#16171c" roughness={0.45} metalness={0.12} />
      </mesh>
      {/* Pantalla (emissiveMap = canvas de arranque). Negra y apagada hasta el click. */}
      <mesh position={[0, 1.14, 0.021]} ref={screenMeshRef}>
        <planeGeometry args={[0.9, 0.52]} />
        <meshStandardMaterial
          ref={screenMat}
          color="#000000"
          emissiveMap={texture}
          emissive="#ffffff"
          emissiveIntensity={0}
          roughness={0.85}
          metalness={0}
        />
      </mesh>

      {/* La MISMA StoreApp de la aplicación, proyectada en la pantalla tras el boot
          (el mecanismo que ya mostraba Inicio). Comparte el hash (ruta real) y
          webView.scrollY, así que representa la ÚLTIMA vista del usuario. NO es
          interactiva (pointerEvents:none): el click llega al panel y reabre la
          app a pantalla completa en esa misma vista. */}
      {revealed && (
        <Html
          transform
          position={[0, 1.14, 0.024]}
          scale={0.00075}
          style={{
            width: 1200,
            height: 693,
            overflow: "hidden",
            pointerEvents: "none",
            borderRadius: 6,
          }}
        >
          <div className="monitor-web">
            <StoreApp storeId={storeId} />
          </div>
        </Html>
      )}

      {/* La pantalla se ilumina únicamente con su propio contenido (emissiveMap).
          Sin luz externa frontal: el brillo nace del arranque del sistema, no de
          un punto de luz artificial que provoque reflejos accidentales. */}

      {/* Indicador interactivo sutil: señala dónde acceder a la tienda. Solo
          mientras el monitor está apagado; desaparece al encender el sistema. */}
      {hint && (
        <Html position={[0, 1.5, 0.04]} center zIndexRange={[20, 0]}>
          <div className="monitor-hint">[ EXPLORAR TIENDA ]</div>
        </Html>
      )}
    </group>
  );
}

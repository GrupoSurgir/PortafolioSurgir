import { useCallback, useMemo, useRef } from "react";

// Motor de audio de SURGIR. Capas (sin música):
//   - BASE: hum eléctrico extremadamente bajo (síntesis) + cama CC0 de OpenGameArt
//   - VENTILACIÓN: ruido mecánico sutil (síntesis)
//   - ESTRUCTURA: ping metálico ocasional (síntesis)
//   - ARRANQUE: relay + energía + sistema activándose (síntesis)
//
// NOTA SOBRE ASSETS REALES:
//   * Poly Haven (modelos/texturas) -> INACCESIBLE (HTTP 521). Se usan
//     materiales PBR procedurales en su lugar.
//   * Kenney Sci-Fi Sounds (relay/energía/activación) -> NO presentes en el
//     repo de referencia (solo contiene "laserLarge", que está PROHIBIDO).
//     Esos uno-shots específicos NO se sustituyen por otro asset: se sintetizan
//     proceduralmente con WebAudio.
//   * OpenGameArt CC0 ambient -> DESCARGADOS e integrados (oga-caverns.ogg)
//     como cama de ambiente base.

function makeNoiseBuffer(ctx, seconds = 2) {
  const len = ctx.sampleRate * seconds;
  const buffer = ctx.createBuffer(1, len, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
  return buffer;
}

async function loadLoopBed(ctx, url, master, { gain = 0.05, lowpass = 600 }) {
  try {
    const res = await fetch(url);
    if (!res.ok) return;
    const arr = await res.arrayBuffer();
    const buf = await ctx.decodeAudioData(arr);
    const src = ctx.createBufferSource();
    src.buffer = buf;
    src.loop = true;
    const g = ctx.createGain();
    g.gain.value = gain;
    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = lowpass;
    src.connect(lp);
    lp.connect(g);
    g.connect(master);
    src.start();
  } catch (e) {
    // Si el bed falla, el hum procedural sigue cubriendo la capa base.
    console.warn("SURGIR audio bed no disponible:", e);
  }
}

function playArranque(ctx, master) {
  const t0 = ctx.currentTime + 0.05;

  // Relay (click seco)
  const noise = makeNoiseBuffer(ctx, 0.2);
  const ns = ctx.createBufferSource();
  ns.buffer = noise;
  const hp = ctx.createBiquadFilter();
  hp.type = "highpass";
  hp.frequency.value = 2500;
  const ng = ctx.createGain();
  ng.gain.setValueAtTime(0.0001, t0);
  ng.gain.exponentialRampToValueAtTime(0.25, t0 + 0.005);
  ng.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.08);
  ns.connect(hp);
  hp.connect(ng);
  ng.connect(master);
  ns.start(t0);
  ns.stop(t0 + 0.2);

  // Barrido de energía (sine ascendente)
  const o = ctx.createOscillator();
  o.type = "sine";
  o.frequency.setValueAtTime(80, t0 + 0.1);
  o.frequency.exponentialRampToValueAtTime(520, t0 + 1.6);
  const og = ctx.createGain();
  og.gain.setValueAtTime(0.0001, t0 + 0.1);
  og.gain.exponentialRampToValueAtTime(0.12, t0 + 0.5);
  og.gain.exponentialRampToValueAtTime(0.0001, t0 + 2.0);
  o.connect(og);
  og.connect(master);
  o.start(t0 + 0.1);
  o.stop(t0 + 2.1);

  // Thump de sistema encendido
  const th = ctx.createOscillator();
  th.type = "sine";
  th.frequency.setValueAtTime(70, t0 + 1.7);
  th.frequency.exponentialRampToValueAtTime(45, t0 + 2.3);
  const thg = ctx.createGain();
  thg.gain.setValueAtTime(0.0001, t0 + 1.7);
  thg.gain.exponentialRampToValueAtTime(0.18, t0 + 1.85);
  thg.gain.exponentialRampToValueAtTime(0.0001, t0 + 2.6);
  th.connect(thg);
  thg.connect(master);
  th.start(t0 + 1.7);
  th.stop(t0 + 2.7);
}

function scheduleStructure(ctx, master) {
  const tick = () => {
    const t = ctx.currentTime + 0.02;
    // Dos parciales inarmónicas -> sensación metálica
    const freqs = [1180, 1870];
    freqs.forEach((f) => {
      const o = ctx.createOscillator();
      o.type = "triangle";
      o.frequency.value = f * (0.98 + Math.random() * 0.04);
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.022, t + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.5);
      const hp = ctx.createBiquadFilter();
      hp.type = "highpass";
      hp.frequency.value = 900;
      o.connect(hp);
      hp.connect(g);
      g.connect(master);
      o.start(t);
      o.stop(t + 0.55);
    });
    const next = 9000 + Math.random() * 14000;
    setTimeout(tick, next);
  };
  setTimeout(tick, 6000 + Math.random() * 6000);
}

// Capa sintética de ambiente por entorno (sin assets externos).
// Devuelve { src, bp, g } para poder reajustarla con crossfade.
function startEnvLayer(ctx, master, { type, freq, gain }) {
  const src = ctx.createBufferSource();
  src.buffer = makeNoiseBuffer(ctx, 2);
  src.loop = true;
  const bp = ctx.createBiquadFilter();
  bp.type = type === "machinery" || type === "shimmer" ? "bandpass" : "lowpass";
  bp.frequency.value = freq;
  bp.Q.value = type === "machinery" ? 1.2 : 0.7;
  const g = ctx.createGain();
  g.gain.value = gain;
  src.connect(bp);
  bp.connect(g);
  g.connect(master);
  src.start();
  return { src, bp, g };
}

export function useAmbientAudio() {
  const ctxRef = useRef(null);
  const nodesRef = useRef(null);
  const startedRef = useRef(false);
  const volRef = useRef(0.8);
  const envRef = useRef(null);

  const applyEnv = useCallback(() => {
    const n = nodesRef.current;
    if (!n) return;
    const ctx = ctxRef.current;
    const env = envRef.current;
    const base = env ? env.audio.base : 1;
    const now = ctx.currentTime;
    // Volumen del usuario (independiente del ambiente).
    n.userGain.gain.cancelScheduledValues(now);
    n.userGain.gain.setValueAtTime(n.userGain.gain.value, now);
    n.userGain.gain.linearRampToValueAtTime(volRef.current, now + 1);
    // Carácter del ambiente (crossfade suave).
    n.envGain.gain.cancelScheduledValues(now);
    n.envGain.gain.setValueAtTime(n.envGain.gain.value, now);
    n.envGain.gain.linearRampToValueAtTime(base, now + 1);
    if (env) {
      n.envFilter.frequency.cancelScheduledValues(now);
      n.envFilter.frequency.setValueAtTime(n.envFilter.frequency.value, now);
      n.envFilter.frequency.linearRampToValueAtTime(env.audio.filter, now + 1);
      n.envLayer.bp.frequency.cancelScheduledValues(now);
      n.envLayer.bp.frequency.setValueAtTime(n.envLayer.bp.frequency.value, now);
      n.envLayer.bp.frequency.linearRampToValueAtTime(env.audio.layerFreq, now + 1);
      n.envLayer.g.gain.cancelScheduledValues(now);
      n.envLayer.g.gain.setValueAtTime(n.envLayer.g.gain.value, now);
      n.envLayer.g.gain.linearRampToValueAtTime(env.audio.layerGain, now + 1);
    }
  }, []);

  const setVolume = useCallback((v) => {
    volRef.current = v;
    if (nodesRef.current) applyEnv();
  }, [applyEnv]);

  const setEnvironment = useCallback((env) => {
    envRef.current = env;
    if (nodesRef.current) applyEnv();
  }, [applyEnv]);

  const start = useCallback(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) {
      console.warn("[SURGIR audio] WebAudio no disponible en este navegador");
      return;
    }
    const ctx = new Ctx();
    ctxRef.current = ctx;

    // Los navegadores crean el contexto SUSPENDIDO hasta una interacción del
    // usuario. Como start() se llama dentro del click "EXPERIENCIA SURGIR"
    // (gesto válido), reanudamos explícitamente para que suene de verdad.
    if (ctx.state === "suspended") {
      ctx.resume().catch((e) =>
        console.warn("[SURGIR audio] no se pudo reanudar:", e)
      );
    }

    const master = ctx.createGain();
    master.gain.setValueAtTime(0.0001, ctx.currentTime);
    master.gain.linearRampToValueAtTime(0.9, ctx.currentTime + 4);

    // Cadena de control:
    //   master -> userGain (VOLUMEN del usuario) -> envGain (carácter del
    //   ambiente) -> envFilter -> destino.
    // Separar volumen de ambiente evita que cambiar de ambiente produzca un
    // salto de volumen percibido; el crossfade afecta solo al carácter.
    const userGain = ctx.createGain();
    userGain.gain.value = volRef.current;
    const envGain = ctx.createGain();
    envGain.gain.value = envRef.current ? envRef.current.audio.base : 1;
    const envFilter = ctx.createBiquadFilter();
    envFilter.type = "lowpass";
    envFilter.frequency.value = envRef.current ? envRef.current.audio.filter : 520;
    master.connect(userGain);
    userGain.connect(envGain);
    envGain.connect(envFilter);
    envFilter.connect(ctx.destination);

    // ---- BASE: hum eléctrico extremadamente bajo ----
    const humGain = ctx.createGain();
    humGain.gain.value = 0.11;
    const humLP = ctx.createBiquadFilter();
    humLP.type = "lowpass";
    humLP.frequency.value = 130;
    humGain.connect(humLP);
    humLP.connect(master);
    [36, 48, 55.5].forEach((f) => {
      const o = ctx.createOscillator();
      o.type = "sine";
      o.frequency.value = f;
      o.connect(humGain);
      o.start();
    });
    // Deriva lenta del hum
    const drift = ctx.createOscillator();
    drift.frequency.value = 0.05;
    const driftGain = ctx.createGain();
    driftGain.gain.value = 0.02;
    drift.connect(driftGain);
    driftGain.connect(humGain.gain);
    drift.start();

    // ---- BASE: cama CC0 de OpenGameArt ----
    loadLoopBed(ctx, "/audio/oga-caverns.ogg", master, {
      gain: 0.05,
      lowpass: 500,
    });

    // ---- VENTILACIÓN: ruido mecánico sutil ----
    const noise = makeNoiseBuffer(ctx, 2);
    const ns = ctx.createBufferSource();
    ns.buffer = noise;
    ns.loop = true;
    const bp = ctx.createBiquadFilter();
    bp.type = "bandpass";
    bp.frequency.value = 350;
    bp.Q.value = 0.7;
    const ventGain = ctx.createGain();
    ventGain.gain.value = 0.014;
    ns.connect(bp);
    bp.connect(ventGain);
    ventGain.connect(master);
    ns.start();
    // LFO de la ventilación
    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.08;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 0.008;
    lfo.connect(lfoGain);
    lfoGain.connect(ventGain.gain);
    lfo.start();

    // ---- CAPA DE AMBIENTE (por entorno, crossfade vía applyEnv) ----
    const envDef = envRef.current;
    const envLayer = startEnvLayer(ctx, userGain, {
      type: envDef ? envDef.audio.layer : "wind",
      freq: envDef ? envDef.audio.layerFreq : 420,
      gain: envDef ? envDef.audio.layerGain : 0.05,
    });

    nodesRef.current = { master, userGain, envGain, envFilter, envLayer };

    // ---- ESTRUCTURA + ARRANQUE ----
    scheduleStructure(ctx, master);
    playArranque(ctx, master);
  }, []);

  return useMemo(() => ({ start, setVolume, setEnvironment }), [
    start,
    setVolume,
    setEnvironment,
  ]);
}

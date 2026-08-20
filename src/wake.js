// Timeline del "despertar" de SURGIR.
// Valores puros en función del tiempo transcurrido (segundos) desde que
// el usuario inicia la experiencia. Tanto la escena 3D (luces) como el
// overlay de líneas (DOM) consumen la misma función para mantenerse sincronizados.

// Fases (segundos): el espacio debe ILUMINARSE PRONTO. En cuanto el usuario
// entra, el PC y el setup cercano se encienden; luego la luz se expande hacia
// el entorno y la profundidad, dando sensación de espacio infinito (la luz
// cerca revela el PC, y más allá el vacío se pierde en la niebla).
//  0.3 - 2.5   luz cercana (revela PC + escritorio + cubo de inmediato)
//  0.8 - 3.0   luz de escritorio (monitor / teclado)
//  1.5 - 3.5   luz de entorno (relleno tenue)
//  2.5 - 5.5   luz de profundidad (vacío lejano -> infinito)
//  1.2 - 2.2   LED de estado del PC
//  2.0 - 3.0   señal mínima en el monitor

function clamp01(x) {
  return x < 0 ? 0 : x > 1 ? 1 : x;
}

function smoothstep(edge0, edge1, x) {
  const t = clamp01((x - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
}

// Rampa con easing entre [a, b].
function ramp(x, a, b) {
  return smoothstep(a, b, x);
}

export function computeWake(t) {
  return {
    // Luces progresivas (intensidad normalizada 0..1). Con base inmediata:
    // desde que el usuario entra, el PC y el setup ya son visibles; luego la
    // luz se expande al entorno y la profundidad (vacío infinito).
    near: 0.4 + 0.6 * ramp(t, 0.0, 1.2),
    desk: 0.35 + 0.65 * ramp(t, 0.0, 1.6),
    env: 0.35 + 0.65 * ramp(t, 0.0, 2.2),
    depth: 0.3 + 0.7 * ramp(t, 0.0, 2.8),
    // Detalles de la instalación.
    status: ramp(t, 1.2, 2.2), // LED de estado del PC
    monitor: ramp(t, 2.0, 3.0), // señal mínima en pantalla
  };
}

// Tiempo total hasta que la escena se considera "estable".
export const WAKE_STEADY = 6;

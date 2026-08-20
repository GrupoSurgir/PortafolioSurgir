// Definición de ambientes de SURGIR.
// Cada ambiente modifica ÚNICAMENTE la atmósfera (fondo, niebla, luz ambiental
// base y carácter de audio). NO cambia la geometría principal (PC, monitor,
// escritorio, cubo, suelo): el "mismo lugar" existe dentro de distintas
// atmósferas.
//
// audio.layer = tipo de capa sintética de ambiente (sin assets externos):
//   wind       -> aire/ventila espacial muy sutil
//   space      -> ambiente profundo
//   machinery  -> maquinaria / electricidad distante
//   shimmer    -> experimental
//   none       -> casi silencio (solo room tone base)

export const ENVIRONMENTS = [
  {
    id: "void",
    name: "Void",
    background: "#0a0e1c",
    fog: { color: "#0a0e1c", near: 6, far: 22 },
    ambient: { color: "#7d8794", intensity: 0.1 },
    audio: { filter: 340, layer: "wind", layerFreq: 420, layerGain: 0.05, base: 0.55 },
  },
  {
    id: "deep",
    name: "Deep Space",
    background: "#0a1024",
    fog: { color: "#0a1024", near: 8, far: 30 },
    ambient: { color: "#8693a6", intensity: 0.12 },
    audio: { filter: 520, layer: "space", layerFreq: 300, layerGain: 0.05, base: 0.7 },
  },
  {
    id: "station",
    name: "Dark Station",
    background: "#0a0f1a",
    fog: { color: "#0a0f1a", near: 7, far: 24 },
    ambient: { color: "#7c8696", intensity: 0.09 },
    audio: { filter: 780, layer: "machinery", layerFreq: 220, layerGain: 0.06, base: 0.65 },
  },
  {
    id: "chamber",
    name: "Silent Chamber",
    background: "#0c0c18",
    fog: { color: "#0c0c18", near: 5, far: 18 },
    ambient: { color: "#8a8f98", intensity: 0.13 },
    audio: { filter: 240, layer: "none", layerFreq: 300, layerGain: 0.0, base: 0.45 },
  },
  {
    id: "unknown",
    name: "Unknown",
    background: "#120a22",
    fog: { color: "#120a22", near: 6, far: 22 },
    ambient: { color: "#9a8fb0", intensity: 0.11 },
    audio: { filter: 1100, layer: "shimmer", layerFreq: 900, layerGain: 0.05, base: 0.6 },
  },
];

export const DEFAULT_ENVIRONMENT = "void";

export function getEnvironment(id) {
  return ENVIRONMENTS.find((e) => e.id === id) || ENVIRONMENTS[0];
}

// Slots del Workplace Builder: dónde aparece cada objeto dentro de la escena.
// El origen de cada ancla está apoyado sobre la superficie del escritorio
// (y = 0.77) o sobre el suelo (y = 0) según corresponda, igual que el setup
// original de Workstation.jsx. Los modelos se construyen "hacia arriba".

export const SLOT_ORDER = ["monitor", "pc", "keyboard", "mouse", "ringLight"];

export const SLOTS = {
  monitor: { id: "monitor", label: "Monitor", icon: "🖥️", position: [0, 0.77, -0.5] },
  pc: { id: "pc", label: "PC", icon: "🖥️", position: [-0.85, 0.77, -0.25] },
  keyboard: { id: "keyboard", label: "Teclado", icon: "⌨️", position: [0, 0.77, 0.18] },
  mouse: { id: "mouse", label: "Mouse", icon: "🖱️", position: [0.42, 0.77, 0.2] },
  ringLight: { id: "ringLight", label: "Aro de luz", icon: "💡", position: [0.78, 0.77, -0.28] },
};
// Colores disponibles para el aro de luz (Ring Light) del Builder.
// Se aplican en tiempo real al material emisivo y a la luz local.

export const RING_COLORS = [
  { id: "white", label: "Blanco", value: "#ffffff" },
  { id: "cyan", label: "Cian", value: "#22d3ee" },
  { id: "blue", label: "Azul", value: "#3b82f6" },
  { id: "purple", label: "Morado", value: "#a855f7" },
  { id: "red", label: "Rojo", value: "#ef4444" },
  { id: "green", label: "Verde", value: "#22c55e" },
  { id: "pink", label: "Rosa", value: "#ec4899" },
];

export const ringColorValue = (id) =>
  RING_COLORS.find((c) => c.id === id)?.value ?? "#ffffff";
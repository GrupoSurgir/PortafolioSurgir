// ESTACIONES DE TRABAJO (mesas/tiendas) del espacio 3D.
//
// SURGIRSTUDIO soporta VARIAS tiendas en VARIAS mesas: cada entrada genera un
// escritorio con su monitor/PC y su propia tienda (storeId). Hoy la demo usa
// UNA mesa; para añadir otra, basta agregar una entrada más aquí.
//
// Nota: la cámara de entrada ("enter") hoy es compartida (pcRef) y está pensada
// para la mesa principal. Al escalar a varias mesas, cada monitor deberá llevar
// su propio estado de cámara.

export const WORKSTATIONS = [
  {
    id: "main",
    label: "SurgirStudio",
    storeId: "surgir",
    position: [0, 0, 0],
    rotationY: 0,
  },
];

export const getWorkstation = (id) =>
  WORKSTATIONS.find((w) => w.id === id) || WORKSTATIONS[0];
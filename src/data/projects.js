// PORTAFOLIO / PROYECTOS DE SURGIR — capa de datos administrable.
// Solo proyectos reales de SURGIR. Los enlaces vacíos indican que aún no
// existen canales públicos: no se inventan URLs.
//
// route -> página interna real (ruta hash de la aplicación).
//         Si no existe página pública, el botón muestra su estado sin enlazar.

export const projects = [
  {
    id: "surgir-entregas",
    name: "SurgirEntregas",
    type: "Plugin Minecraft",
    status: "ACTIVO",
    year: "2026",
    description:
      "Sistema de venta de ítems y entregas para servidores Minecraft: comandos configurables, permisos por rol y configuración por archivo.",
    route: { page: "product", params: { slug: "surgir-entregas" } },
    routeLabel: "Ver proyecto",
  },
  {
    id: "surgir-menu",
    name: "SurgirMenu",
    type: "Plugin Minecraft",
    status: "ACTIVO",
    year: "2026",
    description:
      "Sistema de interfaces y menús personalizados para servidores de Minecraft, integrado con el ecosistema SURGIR.",
    routeLabel: "En desarrollo",
  },
  {
    id: "surgir-agente",
    name: "SurgirAgente",
    type: "Inteligencia artificial",
    status: "EN DESARROLLO",
    year: "2026",
    experimental: true,
    tagline: "Tu futuro ayudante de IA.",
    description:
      "Proyecto de inteligencia artificial de SURGIR. Su objetivo es desarrollar un agente capaz de comprender su entorno, interactuar con el ecosistema y convertirse en un verdadero ayudante de IA. Actualmente en investigación y desarrollo, explorando diferentes arquitecturas para integrar IA con Minecraft.",
    routeLabel: "Investigación",
  },
];
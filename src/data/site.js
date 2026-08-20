// Información general del sitio SURGIR.
// Editar aquí los datos de marca, contacto y enlaces. Cuando exista un backend
// / CMS, esta información puede venir de una API sin tocar la interfaz.

export const site = {
  name: "SURGIR",
  tagline: "Tecnología, Plugins y Desarrollo",
  description:
    "SURGIR es un estudio de desarrollo de plugins, sistemas e integraciones para servidores Minecraft, aplicaciones web y proyectos de automatización. Productos sobrios, técnicos y listos para producción.",
  // Canales de contacto configurables. Los valores vacíos o con "(próximamente)"
  // se muestran como preparados pero no son canales reales todavía.
  contactChannels: [
    { id: "email", label: "Correo", value: "contacto@surgir.store", href: "mailto:contacto@surgir.store" },
    { id: "discord", label: "Discord", value: "Comunidad (próximamente)", href: "" },
    { id: "github", label: "GitHub", value: "Repositorio (próximamente)", href: "" },
  ],
  // Endpoint real de contacto. Vacío => el envío se simula en el frontend
  // (preparado para conectar un backend posteriormente).
  contactEndpoint: "",
  // Datos de marca para SEO / Open Graph.
  url: "",
  social: {
    github: "",
    discord: "",
  },
};
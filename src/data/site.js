// Información general del sitio SurgirStudio.
// Editar aquí los datos de marca, contacto y enlaces. Cuando exista un backend
// / CMS, esta información puede venir de una API sin tocar la interfaz.

export const site = {
  name: "SurgirStudio",
  shortName: "SURGIR",
  tagline: "Plugins, Sistemas y Aplicaciones Web",
  description:
    "SurgirStudio es el estudio digital de Samuel Buritica: desarrollo de plugins, sistemas e integraciones para servidores Minecraft, aplicaciones web y proyectos de automatización. Productos sobrios, técnicos y listos para producción.",
  author: "Samuel Buritica",
  // Canales de contacto configurables. Los valores vacíos o con "(próximamente)"
  // se muestran como preparados pero no son canales reales todavía.
  contactChannels: [
    { id: "email", label: "Correo", value: "contacto@surgir.studio", href: "mailto:contacto@surgir.studio" },
    { id: "discord", label: "Discord", value: "Comunidad (próximamente)", href: "" },
    { id: "github", label: "GitHub", value: "Repositorio (próximamente)", href: "" },
  ],
  // Endpoint real de contacto. Vacío => el envío se simula en el frontend
  // (preparado para conectar un backend posteriormente).
  contactEndpoint: "",
  // Datos de marca para SEO / Open Graph. Completar con el dominio real cuando
  // exista (Netlify asigna un dominio provisional al desplegar).
  url: "",
  social: {
    github: "",
    discord: "",
  },
};
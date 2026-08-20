// PRODUCTOS DE SURGIR — capa de datos administrable.
//
// Para agregar un producto nuevo basta con añadir un objeto a `products`.
// La interfaz (tienda, tarjetas, detalle) se adapta automáticamente.
// Posteriormente estos datos pueden venir de una API / CMS / base de datos
// sin cambiar la UI.
//
// Campos útiles:
//   price: 0        -> producto GRATIS (se descarga directamente, sin carrito)
//   price: > 0      -> producto de pago (carrito -> checkout)
//   downloadUrl     -> archivo descargable (ej: /downloads/mi-archivo.zip)
//   status          -> "Disponible" | "Próximamente" | "En preparación"
//
// La tienda queda limpia de publicaciones de prueba: por ahora solo contiene
// el plugin de prueba "Surgir Entregas" (gratis y configurable).

export const categories = [
  { slug: "plugins", name: "Plugins" },
  { slug: "recursos", name: "Recursos" },
  { slug: "modelos", name: "Modelos" },
  { slug: "packs", name: "Packs" },
  { slug: "digitales", name: "Digitales" },
];

export const categoryName = (slug) =>
  categories.find((c) => c.slug === slug)?.name ?? slug;

export const products = [
  {
    id: "surgir-entregas",
    slug: "surgir-entregas",
    name: "Surgir Entregas",
    category: "plugins",
    price: 0,
    status: "Disponible",
    featured: true,
    version: "1.0.0",
    compatibility: "Paper / Spigot / Folia",
    icon: "📦",
    tagline: "Plugin para vender y entregar ítems entre jugadores. Gratis.",
    shortDescription:
      "Plugin de prueba de SURGIR: permite al servidor configurar ventas de ítems y entregas entre jugadores. Gratis y descargable.",
    description:
      "Surgir Entregas es un plugin de prueba de SURGIR para vender ítems y gestionar entregas dentro de tu servidor Minecraft. Incluye configuración completa por archivo (config.yml): precio por ítem, comando de compra, mensajes, permisos y recompensas. Es gratis (0 pesos): descárgalo, edita su configuración y pruébalo en tu servidor.",
    features: [
      "Venta de ítems con comandos configurables",
      "Entrega de paquetes entre jugadores",
      "Configuración completa por archivo (config.yml)",
      "Permisos por rol y por ítem",
      "Mensajes y precios editables sin tocar código",
      "Plugin de prueba de SURGIR (0 pesos)",
    ],
    tags: ["minecraft", "ventas", "entregas", "items", "plugin"],
    image: "",
    downloadUrl: "/downloads/surgir-entregas.zip",
    documentationUrl: "",
    repositoryUrl: "",
    purchaseUrl: "",
  },
];

export const productBySlug = (slug) => products.find((p) => p.slug === slug);
export const productById = (id) => products.find((p) => p.id === id);

export const featuredProducts = products.filter((p) => p.featured);
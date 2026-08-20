// PRODUCTOS DE SURGIRSTUDIO — capa de datos administrable.
//
// Para agregar un producto nuevo basta con añadir un objeto a `products`.
// La interfaz (tienda, tarjetas, detalle, wiki) se adapta automáticamente.
// Posteriormente estos datos pueden venir de una API / CMS / base de datos
// sin cambiar la UI.
//
// Campos:
//   price: 0        -> producto GRATIS (flujo: carrito -> checkout $0 -> pedido)
//   price: > 0      -> producto de pago (carrito -> checkout; pago próximamente)
//   downloadUrl     -> archivo descargable tras crear el pedido
//   status          -> "Disponible" | "Próximamente" | "En preparación"
//   author, version, compatibility, requirements, installation, commands,
//   permissions, changelog, wiki -> página completa del producto.

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
    name: "SurgirEntregas",
    category: "plugins",
    price: 0,
    status: "Disponible",
    featured: true,
    version: "1.0.0",
    compatibility: "Paper / Spigot / Folia · API 1.20",
    author: "Samuel Buritica",
    studio: "SurgirStudio",
    icon: "📦",
    tagline: "Plugin para vender ítems y gestionar entregas entre jugadores.",
    shortDescription:
      "Sistema de venta de ítems y entregas para servidores Minecraft: comandos configurables, permisos por rol y configuración por archivo.",
    description:
      "SurgirEntregas es un plugin de SurgirStudio para vender ítems y gestionar entregas dentro de tu servidor Minecraft. Cada ítem de la tienda ejecuta cualquier comando al comprarse, de modo que puedes vender items, kits, monedas y más sin escribir código. Incluye configuración completa por archivo (config.yml), permisos por rol y un sistema de entregas entre jugadores.",
    features: [
      "Venta de ítems con comandos configurables",
      "Cada ítem ejecuta cualquier comando al comprarse",
      "Entrega de paquetes entre jugadores",
      "Configuración completa por archivo (config.yml)",
      "Permisos por rol y por ítem",
      "Mensajes y precios editables sin tocar código",
      "Licencia gratuita (0 pesos)",
    ],
    requirements: ["Java 17+", "Paper o Spigot 1.18–1.20+", "Folia (experimental)"],
    installation: [
      "Descarga el archivo SurgirEntregas.zip desde tu cuenta.",
      "Descomprime y copia el contenido en la carpeta plugins/ del servidor.",
      "Reinicia el servidor.",
      "Se genera plugins/SurgirEntregas/config.yml: edítalo con tus ítems y precios.",
      "Recarga la configuración con /entrega reload.",
    ],
    commands: [
      { cmd: "/entrega help", desc: "Muestra la ayuda del plugin." },
      { cmd: "/entrega shop", desc: "Abre la lista de ítems a la venta." },
      { cmd: "/entrega buy <id>", desc: "Compra un ítem por su ID." },
      { cmd: "/entrega reload", desc: "Recarga la configuración (admin)." },
    ],
    permissions: [
      { node: "surgir.entregas.use", desc: "Usa los comandos básicos.", def: "todos" },
      { node: "surgir.entregas.buy", desc: "Compra ítems.", def: "todos" },
      { node: "surgir.entregas.admin", desc: "Reload y administración.", def: "op" },
      { node: "surgir.entregas.roles.vip", desc: "Acceso a ítems VIP (ejemplo).", def: "opcional" },
    ],
    changelog: [
      {
        version: "1.0.0",
        date: "Primera versión",
        notes: [
          "Venta de ítems con comandos configurables.",
          "Sistema de entregas entre jugadores.",
          "Configuración completa por archivo.",
          "Permisos por rol y por ítem.",
        ],
      },
    ],
    wiki: {
      what: "SurgirEntregas permite a tu servidor vender ítems y gestionar entregas entre jugadores usando únicamente archivos de configuración: no necesitas tocar código para añadir productos a la tienda.",
      config: [
        "Cada ítem se define en config.yml con material, nombre, precio, permiso opcional y el comando que se ejecuta al comprar.",
        "%player% se reemplaza por el jugador que compró.",
        "Los mensajes usan códigos de color (&) y se editan en la sección messages.",
        "El sistema de entregas permite enviar paquetes entre jugadores con expiración configurable.",
      ],
      economy:
        "El plugin usa la moneda definida en config.yml (currency-name). En la versión actual la compra se simula ejecutando el comando del ítem; la integración con economías externas (Vault) se preparará en próximas versiones.",
      ads:
        "SurgirEntregas no muestra anuncios. Es software gratuito de SurgirStudio.",
      architecture:
        "SurgirEntregas está estructurado como un plugin Bukkit estándar: una clase principal (SurgirEntregas) carga la configuración, registra el comando /entrega (EntregaCommand) y expone el sistema de entregas. Desarrollado con Java y la API de Bukkit/Paper, compilado con Maven.",
      tech: ["Java 17", "Bukkit/Spigot API", "Paper API 1.20", "Maven", "Git"],
    },
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
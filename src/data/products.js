// PRODUCTOS DE SURGIR — capa de datos administrable.
//
// Para agregar un producto nuevo basta con añadir un objeto a `products`.
// La interfaz (tienda, tarjetas, detalle) se adapta automáticamente.
// Posteriormente estos datos pueden venir de una API / CMS / base de datos
// sin cambiar la UI.

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
    price: 35,
    status: "Disponible",
    featured: true,
    version: "1.0.0",
    compatibility: "Paper / Spigot / Folia",
    icon: "📦",
    tagline: "Sistema de entregas y paquetes para servidores Minecraft.",
    shortDescription:
      "Sistema de entregas para servidores Minecraft: envía paquetes y entregas entre jugadores de forma segura y organizada.",
    description:
      "SurgirEntregas es un plugin de entregas para servidores Minecraft. Permite a los jugadores enviar y recibir paquetes, crear entregas con recompensas y administrar el sistema desde el servidor. Diseñado para integrarse con el ecosistema SURGIR y ser configurable sin tocar código.",
    features: [
      "Entrega de paquetes entre jugadores",
      "Historial y seguimiento de entregas",
      "Configuración completa por archivo",
      "Integración con el ecosistema SURGIR",
      "API para desarrolladores",
    ],
    tags: ["minecraft", "deliveries", "paquetes"],
    image: "",
    downloadUrl: "",
    documentationUrl: "",
    repositoryUrl: "",
    purchaseUrl: "",
  },
  {
    id: "surgir-matrix",
    slug: "surgir-matrix",
    name: "SurgirMatrix",
    category: "plugins",
    price: 49,
    status: "Disponible",
    featured: true,
    version: "1.0.0",
    compatibility: "Paper / Spigot",
    icon: "🧠",
    tagline: "Núcleo de integración y descubrimiento de capacidades de SURGIR.",
    shortDescription:
      "Núcleo de integración que conecta y coordina los sistemas del servidor.",
    description:
      "SurgirMatrix es el núcleo de integración de SURGIR. Conecta y coordina los sistemas del servidor para que SURGIR pueda descubrir plugins, servicios y capacidades disponibles y convertir esa información en un contexto que otros componentes de SURGIR pueden utilizar. Funciona como núcleo de integración, capa de comunicación, descubrimiento de capacidades, diagnóstico, conexión entre sistemas, base para SURGIR AI y base para SurgirBot.",
    features: [
      "Núcleo de integración y comunicación",
      "Descubrimiento de capacidades",
      "Diagnóstico y conexión entre sistemas",
      "Base para SURGIR AI y SurgirBot",
    ],
    tags: ["minecraft", "core", "integracion"],
    image: "",
    downloadUrl: "",
    documentationUrl: "",
    repositoryUrl: "",
    purchaseUrl: "",
  },
  {
    id: "surgir-menu",
    slug: "surgir-menu",
    name: "Surgir Menu",
    category: "plugins",
    price: 29,
    status: "Disponible",
    featured: true,
    version: "1.0.0",
    compatibility: "Paper / Spigot",
    icon: "🗂️",
    tagline: "Capa de interfaz para construir y administrar herramientas.",
    shortDescription:
      "Capa de interfaz para construir y administrar herramientas del servidor.",
    description:
      "SurgirMenu es la capa de interfaz de SURGIR. Permite construir y administrar interfaces para el servidor y utilizar la información proporcionada por SurgirMatrix para presentar herramientas y funcionalidades de forma organizada. SurgirMatrix actúa como núcleo / integración y SurgirMenu como interfaz / presentación.",
    features: [
      "Construcción de menús e interfaces",
      "Uso de datos de SurgirMatrix",
      "Organización de herramientas",
    ],
    tags: ["minecraft", "menu", "ui"],
    image: "",
    downloadUrl: "",
    documentationUrl: "",
    repositoryUrl: "",
    purchaseUrl: "",
  },
  {
    id: "surgir-ui-pack",
    slug: "surgir-ui-pack",
    name: "Surgir UI Pack",
    category: "packs",
    price: 45,
    status: "Disponible",
    featured: false,
    version: "1.0.0",
    compatibility: "Web",
    icon: "🎨",
    tagline: "Pack de componentes de interfaz gris/blanco/negro.",
    shortDescription:
      "Colección de componentes UI sobrios, lista para usar en productos digitales.",
    description:
      "Colección de componentes UI sobrios, lista para usar en productos digitales. Espacio negativo y tipografía sencilla.",
    features: ["Componentes UI", "Tema sobrio", "Listo para usar"],
    tags: ["ui", "pack", "design"],
    image: "",
    downloadUrl: "",
    documentationUrl: "",
    repositoryUrl: "",
    purchaseUrl: "",
  },
  {
    id: "modelo-cubo",
    slug: "modelo-cubo",
    name: "Modelo Cubo",
    category: "modelos",
    price: 12,
    status: "Disponible",
    featured: false,
    version: "1.0.0",
    compatibility: "Blender / Three.js",
    icon: "🧊",
    tagline: "Modelo 3D de referencia para escala.",
    shortDescription:
      "Un cubo mate de baja policidad, útil como elemento de escala en escenas 3D.",
    description:
      "Un cubo mate de baja policidad, útil como elemento de escala dentro de escenas 3D minimalistas.",
    features: ["Baja policidad", "Elemento de escala", "Estilo mate"],
    tags: ["3d", "modelo", "escala"],
    image: "",
    downloadUrl: "",
    documentationUrl: "",
    repositoryUrl: "",
    purchaseUrl: "",
  },
  {
    id: "recurso-tipografia",
    slug: "recurso-tipografia",
    name: "Recurso Tipografía",
    category: "recursos",
    price: 18,
    status: "Disponible",
    featured: false,
    version: "1.0.0",
    compatibility: "Web",
    icon: "🔤",
    tagline: "Familia tipográfica de pesos ligeros/medios.",
    shortDescription:
      "Conjunto tipográfico sin serifas, moderno, con mucho espacio negativo.",
    description:
      "Conjunto tipográfico sin serifas, moderno, con mucho espacio negativo para jerarquías limpias.",
    features: ["Familia tipográfica", "Pesos ligeros y medios", "Moderno"],
    tags: ["tipografia", "recurso", "fuente"],
    image: "",
    downloadUrl: "",
    documentationUrl: "",
    repositoryUrl: "",
    purchaseUrl: "",
  },
  {
    id: "plugin-export",
    slug: "plugin-export",
    name: "Plugin Export",
    category: "plugins",
    price: 24,
    status: "Disponible",
    featured: false,
    version: "1.0.0",
    compatibility: "Spigot / Paper",
    icon: "⬆️",
    tagline: "Exporta tu trabajo con un clic.",
    shortDescription:
      "Plugin de exportación optimizada para entornos web.",
    description:
      "Plugin de exportación optimizada para entornos web. Configuración mínima y resultados limpios.",
    features: ["Exportación optimizada", "Configuración mínima", "Resultados limpios"],
    tags: ["minecraft", "export", "plugin"],
    image: "",
    downloadUrl: "",
    documentationUrl: "",
    repositoryUrl: "",
    purchaseUrl: "",
  },
];

export const productBySlug = (slug) => products.find((p) => p.slug === slug);
export const productById = (id) => products.find((p) => p.id === id);

export const featuredProducts = products.filter((p) => p.featured);
// PRODUCTOS DE SURGIRSTUDIO — capa de datos administrable.
//
// Para agregar un producto nuevo basta con añadir un objeto a `products`.
// La interfaz (tienda, tarjetas, detalle, wiki) se adapta automáticamente.
// Posteriormente estos datos pueden venir de una API / CMS / base de datos
// sin cambiar la UI.
//
// Campos:
//   price: 0        -> producto GRATIS (descarga gratis: correo -> activa)
//   price: > 0      -> producto de pago (pago próximamente; sin flujo aún)
//   downloadUrl     -> archivo descargable tras activar la descarga
//   status          -> "Disponible" | "Próximamente" | "En preparación"
//   author, version, compatibility, requirements, installation, commands,
//   permissions, changelog, wiki -> página completa del producto.

export const categories = [
  { slug: "plugins", name: "Plugins" },
  { slug: "recursos", name: "Recursos" },
  { slug: "modelos", name: "Modelos" },
  { slug: "packs", name: "Packs" },
  { slug: "digitales", name: "Digitales" },
  { slug: "personalizacion", name: "Personalización" },
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
    tagline: "Sistema de entregas diseñado para organizar y automatizar distribuciones en servidores Minecraft.",
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

// ===================================================================
// PERSONALIZACIÓN DEL PUESTO (Workplace Builder)
// -------------------------------------------------------------------
// Productos físicos/visuales para construir el puesto de trabajo en 3D.
// `slot` indica dónde aparecen en la escena y `type` qué modelo se
// renderiza (ve src/store/workplace/objects).
// `price` es referencia visual: en esta fase la personalización es gratis
// (sin cobro). No existen cuentas cloud, límites ni pagos reales todavía.
// ===================================================================

{
    id: "monitor-basic",
    slug: "monitor-basic",
    name: "Monitor Basic",
    category: "personalizacion",
    slot: "monitor",
    type: "monitor-basic",
    price: 0,
    status: "Disponible - fase desarrollo",
    featured: false,
    version: "1.0",
    compatibility: "Puesto SURGIR",
    author: "SurgirStudio",
    studio: "SurgirStudio",
    icon: "🖥️",
    tagline: "Monitor esencial de 24\" para empezar.",
    shortDescription:
      "Pantalla plana estándar con marco sencillo. El punto de partida perfecto para tu puesto.",
    description:
      "Monitor Basic: pantalla de 24 pulgadas con marco estándar, base simple y acabado oscuro. Es el monitor que equipa por defecto tu puesto SURGIR y sobre el que puedes evolucionar hacia opciones más avanzadas.",
    features: [
      "Pantalla plana estándar",
      "Marco sencillo y base estable",
      "Encendido suave integrado",
      "Listo para sustituirse en el Builder",
    ],
    tags: ["monitor", "pantalla", "basic", "puesto"],
    image: "",
  },
  {
    id: "monitor-pro",
    slug: "monitor-pro",
    name: "Monitor Pro",
    category: "personalizacion",
    slot: "monitor",
    type: "monitor-pro",
    price: 249,
    status: "Disponible",
    featured: false,
    version: "1.0",
    compatibility: "Puesto SURGIR",
    author: "SurgirStudio",
    studio: "SurgirStudio",
    icon: "🖥️",
    tagline: "Marco ultrafino y soporte moderno.",
    shortDescription:
      "Pantalla de marco ultrafino con soporte ergonómico y acento de luz. Evolución inmediata del Basic.",
    description:
      "Monitor Pro: pantalla de marco ultrafino, soporte ergonómico de una pieza y una delgada línea de luz de acento bajo la pantalla. Se percibe de inmediato más premium que el Basic.",
    features: [
      "Marco ultrafino",
      "Soporte ergonómico moderno",
      "Línea de luz de acento",
      "Mejor presencia visual en el puesto",
    ],
    tags: ["monitor", "pantalla", "pro", "puesto"],
    image: "",
  },
  {
    id: "monitor-ultrawide",
    slug: "monitor-ultrawide",
    name: "Monitor Ultrawide",
    category: "personalizacion",
    slot: "monitor",
    type: "monitor-ultrawide",
    price: 349,
    status: "Disponible",
    featured: false,
    version: "1.0",
    compatibility: "Puesto SURGIR",
    author: "SurgirStudio",
    studio: "SurgirStudio",
    icon: "🖥️",
    tagline: "Ultra ancho para máxima inmersión.",
    shortDescription:
      "Pantalla panorámica ultrawide con soporte en dos brazos y barra de luz inferior.",
    description:
      "Monitor Ultrawide: pantalla panorámica que domina el escritorio, soporte en dos brazos y una barra de luz inferior. La opción con más presencia visual del catálogo.",
    features: [
      "Pantalla panorámica ultrawide",
      "Soporte en dos brazos",
      "Barra de luz inferior",
      "Máxima presencia en el puesto",
    ],
    tags: ["monitor", "pantalla", "ultrawide", "puesto"],
    image: "",
  },
  {
    id: "pc-basic",
    slug: "pc-basic",
    name: "PC Basic",
    category: "personalizacion",
    slot: "pc",
    type: "pc-basic",
    price: 549,
    status: "Disponible",
    featured: false,
    version: "1.0",
    compatibility: "Puesto SURGIR",
    author: "SurgirStudio",
    studio: "SurgirStudio",
    icon: "🖥️",
    tagline: "Torre esencial sin luces.",
    shortDescription:
      "Torre de sobremesa sencilla con rejillas de ventilación y botón de encendido tenue.",
    description:
      "PC Basic: torre de sobremesa discreta con rejillas de ventilación frontales y un pequeño LED de estado. El equipo por defecto del puesto SURGIR.",
    features: [
      "Torre compacta de sobremesa",
      "Rejillas de ventilación frontales",
      "LED de estado tenue",
      "Sin iluminación extra",
    ],
    tags: ["pc", "cpu", "torre", "basic", "puesto"],
    image: "",
  },
  {
    id: "pc-pro",
    slug: "pc-pro",
    name: "PC Pro",
    category: "personalizacion",
    slot: "pc",
    type: "pc-pro",
    price: 749,
    status: "Disponible",
    featured: false,
    version: "1.0",
    compatibility: "Puesto SURGIR",
    author: "SurgirStudio",
    studio: "SurgirStudio",
    icon: "🖥️",
    tagline: "Panel frontal con tira de luz cian.",
    shortDescription:
      "Torre con panel frontal malla, rejillas de aire y una tira LED cian.",
    description:
      "PC Pro: torre con panel frontal tipo malla, rejillas de aire y una tira LED cian sutil. Se nota la evolución sobre el Basic sin caer en RGB excesivo.",
    features: [
      "Panel frontal tipo malla",
      "Tira LED cian",
      "Mayor presencia y acabado",
    ],
    tags: ["pc", "cpu", "torre", "pro", "puesto"],
    image: "",
  },
  {
    id: "pc-rgb",
    slug: "pc-rgb",
    name: "PC RGB",
    category: "personalizacion",
    slot: "pc",
    type: "pc-rgb",
    price: 899,
    status: "Disponible",
    featured: false,
    version: "1.0",
    compatibility: "Puesto SURGIR",
    author: "SurgirStudio",
    studio: "SurgirStudio",
    icon: "🖥️",
    tagline: "Vidrio lateral y tira RGB animada.",
    shortDescription:
      "Torre con panel lateral de vidrio, ventiladores RGB y tira de luz que cambia de color.",
    description:
      "PC RGB: torre gamer con panel lateral de vidrio, ventiladores RGB y una tira de luz frontal que cambia de color de forma suave y continua. Ideal para un setup con carácter.",
    features: [
      "Panel lateral de vidrio",
      "Tira RGB animada",
      "Ventiladores RGB",
      "Toque gamer sin exagerar",
    ],
    tags: ["pc", "cpu", "torre", "rgb", "gamer", "puesto"],
    image: "",
  },
  {
    id: "pc-premium",
    slug: "pc-premium",
    name: "PC Premium",
    category: "personalizacion",
    slot: "pc",
    type: "pc-premium",
    price: 1299,
    status: "Disponible",
    featured: false,
    version: "1.0",
    compatibility: "Puesto SURGIR",
    author: "SurgirStudio",
    studio: "SurgirStudio",
    icon: "🖥️",
    tagline: "Acabado metálico de gama alta.",
    shortDescription:
      "Torre de acabado metálico, línea de luz animada y ventilación superior. La máxima expresión del puesto.",
    description:
      "PC Premium: torre de acabado metálico, línea de luz animada, panel frontal de cristal y ventilación superior. Diseñado para representar la gama más alta del Builder.",
    features: [
      "Acabado metálico premium",
      "Línea de luz animada",
      "Panel frontal de cristal",
      "Ventilación superior",
    ],
    tags: ["pc", "cpu", "torre", "premium", "puesto"],
    image: "",
  },
  {
    id: "keyboard-basic",
    slug: "keyboard-basic",
    name: "Keyboard Basic",
    category: "personalizacion",
    slot: "keyboard",
    type: "keyboard-basic",
    price: 49,
    status: "Disponible",
    featured: false,
    version: "1.0",
    compatibility: "Puesto SURGIR",
    author: "SurgirStudio",
    studio: "SurgirStudio",
    icon: "⌨️",
    tagline: "Teclado plano y silencioso.",
    shortDescription:
      "Teclado estándar de teclas planas y cuerpo delgado. El teclado por defecto del puesto.",
    description:
      "Keyboard Basic: teclado estándar de perfil bajo con teclas planas y cuerpo delgado. Cumple sin llamar la atención.",
    features: [
      "Perfil bajo",
      "Teclas planas",
      "Barra espaciadora ancha",
    ],
    tags: ["teclado", "keyboard", "basic", "puesto"],
    image: "",
  },
  {
    id: "keyboard-mechanical",
    slug: "keyboard-mechanical",
    name: "Mechanical Keyboard",
    category: "personalizacion",
    slot: "keyboard",
    type: "keyboard-mechanical",
    price: 89,
    status: "Disponible",
    featured: false,
    version: "1.0",
    compatibility: "Puesto SURGIR",
    author: "SurgirStudio",
    studio: "SurgirStudio",
    icon: "⌨️",
    tagline: "Teclas altas y cuerpo reforzado.",
    shortDescription:
      "Teclado mecánico de teclas altas, cuerpo reforzado y mejor presencia sobre el escritorio.",
    description:
      "Mechanical Keyboard: teclado mecánico con teclas elevadas y cuerpo reforzado. Se diferencia del Basic por su altura, peso visual y acabado.",
    features: [
      "Teclas mecánicas elevadas",
      "Cuerpo reforzado",
      "Mayor presencia sobre el escritorio",
    ],
    tags: ["teclado", "keyboard", "mecanico", "puesto"],
    image: "",
  },
  {
    id: "keyboard-rgb",
    slug: "keyboard-rgb",
    name: "RGB Keyboard",
    category: "personalizacion",
    slot: "keyboard",
    type: "keyboard-rgb",
    price: 119,
    status: "Disponible",
    featured: false,
    version: "1.0",
    compatibility: "Puesto SURGIR",
    author: "SurgirStudio",
    studio: "SurgirStudio",
    icon: "⌨️",
    tagline: "Teclas retroiluminadas en color.",
    shortDescription:
      "Teclado mecánico con teclas retroiluminadas en degradado de color y luz inferior.",
    description:
      "RGB Keyboard: teclado mecánico con cada tecla retroiluminada en un degradado de color y una franja de luz inferior. Aporta el punto de color que un setup gamer espera.",
    features: [
      "Teclas retroiluminadas en degradado",
      "Franja de luz inferior",
      "Estilo gamer",
    ],
    tags: ["teclado", "keyboard", "rgb", "gamer", "puesto"],
    image: "",
  },
  {
    id: "mouse-basic",
    slug: "mouse-basic",
    name: "Mouse Basic",
    category: "personalizacion",
    slot: "mouse",
    type: "mouse-basic",
    price: 29,
    status: "Disponible",
    featured: false,
    version: "1.0",
    compatibility: "Puesto SURGIR",
    author: "SurgirStudio",
    studio: "SurgirStudio",
    icon: "🖱️",
    tagline: "Ratón sencillo y ergonómico.",
    shortDescription:
      "Ratón básico con rueda de scroll. El periférico por defecto del puesto.",
    description:
      "Mouse Basic: ratón sencillo con cuerpo liso y rueda de scroll. Lo que siempre necesitas, sin extra.",
    features: ["Cuerpo liso", "Rueda de scroll", "Ligero"],
    tags: ["mouse", "raton", "basic", "puesto"],
    image: "",
  },
  {
    id: "mouse-pro",
    slug: "mouse-pro",
    name: "Mouse Pro",
    category: "personalizacion",
    slot: "mouse",
    type: "mouse-pro",
    price: 59,
    status: "Disponible",
    featured: false,
    version: "1.0",
    compatibility: "Puesto SURGIR",
    author: "SurgirStudio",
    studio: "SurgirStudio",
    icon: "🖱️",
    tagline: "Forma ergonómica y acento de luz.",
    shortDescription:
      "Ratón con silueta ergonómica de dos niveles y una línea de luz cian.",
    description:
      "Mouse Pro: silueta ergonómica de dos niveles, rueda centrada y una delgada línea de luz cian. Se ve y se siente más avanzado que el Basic.",
    features: ["Forma ergonómica", "Línea de luz cian", "Acabado premium"],
    tags: ["mouse", "raton", "pro", "puesto"],
    image: "",
  },
  {
    id: "mouse-rgb",
    slug: "mouse-rgb",
    name: "RGB Mouse",
    category: "personalizacion",
    slot: "mouse",
    type: "mouse-rgb",
    price: 79,
    status: "Disponible",
    featured: false,
    version: "1.0",
    compatibility: "Puesto SURGIR",
    author: "SurgirStudio",
    studio: "SurgirStudio",
    icon: "🖱️",
    tagline: "Con retroiluminación de color.",
    shortDescription:
      "Ratón ergonómico con franja y logo retroiluminados en color.",
    description:
      "RGB Mouse: ratón ergonómico con franja lateral y logo retroiluminados en color. El complemento perfecto para un setup gamer.",
    features: ["Franja retroiluminada", "Logo de luz", "Estilo gamer"],
    tags: ["mouse", "raton", "rgb", "gamer", "puesto"],
    image: "",
  },
  {
    id: "ring-light-basic",
    slug: "ring-light-basic",
    name: "Ring Light Basic",
    category: "personalizacion",
    slot: "ringLight",
    type: "ring-light-basic",
    price: 59,
    status: "Disponible",
    featured: false,
    version: "1.0",
    compatibility: "Puesto SURGIR",
    author: "SurgirStudio",
    studio: "SurgirStudio",
    icon: "💡",
    tagline: "Aro de luz esencial con color.",
    shortDescription:
      "Aro de luz sobre base con color ajustable y halo suave.",
    description:
      "Ring Light Basic: aro de luz montado sobre una base con poste. Cambia de color en tiempo real desde el Builder: blanco, cian, azul, morado, rojo, verde o rosa.",
    features: [
      "Color ajustable en tiempo real",
      "Halo de luz suave",
      "Base estable",
    ],
    tags: ["luz", "ring", "light", "aro", "puesto"],
    colors: ["white", "cyan", "blue", "purple", "red", "green", "pink"],
    image: "",
  },
  {
    id: "ring-light-pro",
    slug: "ring-light-pro",
    name: "Ring Light Pro",
    category: "personalizacion",
    slot: "ringLight",
    type: "ring-light-pro",
    price: 99,
    status: "Disponible",
    featured: false,
    version: "1.0",
    compatibility: "Puesto SURGIR",
    author: "SurgirStudio",
    studio: "SurgirStudio",
    icon: "💡",
    tagline: "Aro doble más brillante.",
    shortDescription:
      "Aro de luz doble, más grande y brillante, con difusor central.",
    description:
      "Ring Light Pro: aro doble de mayor tamaño, difusor central y luz más intensa. La opción premium de iluminación para tu puesto, también con color ajustable en tiempo real.",
    features: [
      "Aro doble más grande",
      "Difusor central",
      "Luz más intensa",
    ],
    tags: ["luz", "ring", "light", "aro", "pro", "puesto"],
    colors: ["white", "cyan", "blue", "purple", "red", "green", "pink"],
    image: "",
  },
];

export const productBySlug = (slug) => products.find((p) => p.slug === slug);
export const productById = (id) => products.find((p) => p.id === id);

export const featuredProducts = products.filter((p) => p.featured);
# SURGIR — WEB Oficial

Experiencia web 3D de **SURGIR**: estudio de desarrollo de plugins, sistemas,
integraciones y aplicaciones web. El usuario entra en un **espacio profundo** con
un **PC** suspendido; al hacer click en el monitor, el sistema arranca y se
revela la aplicación SURGIR (tienda, servicios, proyectos, contacto) a pantalla
completa.

Stack: **Vite + React 18 + React Three Fiber + Drei + Three.js + Tailwind**.

## Comenzar

```bash
npm install
npm run dev       # servidor de desarrollo
npm run build     # build de producción (dist/)
npm run preview   # previsualizar el build
```

## La experiencia

1. **Espacio 3D** (`src/scene/Scene.jsx`): cámara orbital con damping alrededor
   del PC. El monitor está **apagado**: pantalla negra, sin luces artificiales.
2. **Boot sequence** (`src/scene/Monitor.jsx` + `src/wake.js`): al hacer click
   exacto sobre el monitor → power line → neon scan → system UI → reveal.
3. **Aplicación SURGIR** (`src/store/`): la web moderna aparece fundiéndose
   sobre la pantalla y la cámara entra en ella (`<Html transform occlude>`).
4. **Página completa** (`src/App.jsx`): la aplicación pasa a `position:fixed`
   (`.page-wrap`); `ESC` devuelve a la experiencia 3D.

## Estructura

```text
src/
  App.jsx                     Estado global: phase (space|page), audio, settings
  main.jsx                    Bootstrap React
  index.css                   Estilos globales + overlays del espacio 3D
  wake.js                     Timeline de la secuencia de encendido
  environments.js             Ambientes de audio (paisajes sonoros)
  scene/
    Scene.jsx                 Escena 3D + cámara orbital
    Workstation.jsx           Escritorio, torre, teclado, mouse
    Monitor.jsx               PC + secuencia de boot + StoreApp proyectada
    Environment.jsx           Estrellas, nebulosas, espacio profundo
    LinesOverlay.jsx          Overlay de líneas del boot
  store/
    StoreApp.jsx              Shell de la aplicación (nav, buscador, footer)
    store.css                 CSS de la interfaz SURGIR
    ui.jsx                    StatusPill, ProductCard, SectionHeader
    payments.js               Configuración de métodos de pago
    PaymentsContext.jsx       Contexto global de pagos
    PaymentMethods.jsx        Interfaz de métodos de pago
    pages/                    HomePage, StorePage, ProductDetailPage,
                              ServicesPage, ProjectsPage, AboutPage,
                              ContactPage, CartPage, CheckoutPage
  data/                       CAPA DE DATOS (editar aquí los contenidos)
    products.js               Catálogo (categorías, productos, featured)
    services.js               Servicios
    projects.js               Portafolio de proyectos
    site.js                   Información de la marca y contacto
  hooks/
    useCart.jsx               Carrito global (localStorage "surgir-cart")
  components/
    AudioEngine.js            Motor de audio (WebAudio, ambientes)
    ExperienceGuide.jsx       Guía de bienvenida de la experiencia
    DragGestureIndicator.jsx  Indicador de interacción
    AdminPanel.jsx            Panel de configuración (engranaje ⚙)
public/
  logo.png                    Favicon y logo proyectado en el boot
  _redirects                  SPA fallback para Netlify
  audio/                      Paisajes sonoros (CC0) + licencias
```

## Agregar contenido (sin tocar la UI)

Todo el contenido de la tienda, servicios, proyectos y contacto vive en
`src/data/`:

- `products.js` — estructura:
  ```js
  {
    slug: "surgir-entregas",
    title: "SURGIR Entregas",
    category: "Plugins",
    price: 0,                 // 0 = gratuito
    status: "disponible",     // disponible | pronto | oculto
    description: "...",
    tags: [...],
    featured: true,
    emoji: "🚚",
  }
  ```
  `productBySlug`, `productById` y `featuredProducts` se calculan automáticamente.
- `services.js`, `projects.js`, `site.js` — mismas reglas simples.

## Pagos

`src/store/payments.js` define los métodos (PSE, Nequi, tarjeta, transferencia)
y su estado (`activo` / `pronto`). La configuración se edita desde el panel de
administración (engranaje ⚙ en la experiencia 3D) y queda en `localStorage`.
No hay pasarela real conectada: el checkout registra la orden y muestra
instrucciones de pago.

## Despliegue (Netlify)

El proyecto incluye `netlify.toml` (build `npm run build`, publish `dist/`) y
`public/_redirects` (`/* → /index.html 200`) para soporte SPA.

1. Conecta el repo en Netlify (Node 20).
2. Comando de build: `npm run build` · carpeta de publicación: `dist`.
3. Desplegando. También funciona el drag & drop de `dist/` desde Netlify Drop.

## Requisitos

- Node 18+ (probado con Node 20).
- Navegador con WebGL y WebAudio.

## Licencias de audio

`public/audio/` contiene ambientes CC0/OpenGameArt y efectos Kenney
(ver archivos `LICENSE.txt` dentro de `public/audio/`).
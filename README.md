# SurgirStudio — WEB Oficial

Experiencia web 3D de **SurgirStudio**: el estudio digital de Samuel Buritica
(plugins, sistemas, integraciones y aplicaciones web). El usuario entra en un
**espacio profundo** con un **PC** suspendido; al hacer click en el monitor, el
sistema arranca y se revela la aplicación SurgirStudio (tienda, servicios,
proyectos, contacto, cuenta) a pantalla completa.

Stack: **Vite + React 18 + React Three Fiber + Drei + Three.js + Tailwind** +
**Netlify Functions** (OAuth2 Google/Discord).

## Comenzar

```bash
npm install
cp .env.example .env     # opcional; por defecto funciona en modo demo
npm run dev              # servidor de desarrollo
npm run build            # build de producción (dist/)
npm run preview          # previsualizar el build
```

## La experiencia

1. **Espacio 3D** (`src/scene/Scene.jsx`): cámara orbital con damping alrededor
   de la estación. El monitor está **apagado**: pantalla negra, sin luces
   artificiales. Arquitectura multi-mesa (`src/data/workspaces.js`): añadir una
   tienda nueva = añadir una entrada en `WORKSTATIONS`.
2. **Boot sequence** (`src/scene/Monitor.jsx` + `src/wake.js`): al hacer click
   exacto sobre el monitor → power line → neon scan → system UI → reveal.
   El indicador `[ EXPLORAR TIENDA ]` solo aparece la primera vez.
3. **Aplicación SurgirStudio** (`src/store/`): la web aparece fundiéndose sobre
   la pantalla y la cámara entra en ella (`<Html transform occlude>`).
4. **Página completa** (`src/App.jsx`): la aplicación pasa a `position:fixed`
   (`.page-wrap`); **ESC** vuelve al espacio y **rearma el monitor**: un nuevo
   click vuelve a encender el PC y re-entra a la tienda.

## Estructura

```text
src/
  App.jsx                     Estado global: phase (space|page), audio, settings
  main.jsx                    Bootstrap React
  index.css                   Estilos globales + overlays del espacio 3D
  wake.js                     Timeline de la secuencia de encendido
  environments.js             Ambientes de audio (paisajes sonoros)
  scene/
    Scene.jsx                 Escena 3D + cámara orbital + multi-mesas
    Workstation.jsx           Escritorio, torre, teclado, mouse (por mesa)
    Monitor.jsx               PC + boot + StoreApp proyectada + rearm
    Environment.jsx           Estrellas, nebulosas, espacio profundo
    LinesOverlay.jsx          Overlay de líneas del boot
  data/                       CAPA DE DATOS (editar aquí los contenidos)
    products.js               Catálogo (productos, wiki, comandos, changelog)
    services.js               Servicios
    projects.js               Portafolio de proyectos
    site.js                   Marca y contacto
    auth.js                   Config OAuth (publica) + modo demo/real
    workspaces.js             Mesas/tiendas del espacio 3D
  store/
    StoreApp.jsx              Shell (nav, buscador, footer, routing por hash)
    store.css                 CSS de la interfaz
    ui.jsx                    StatusPill, ProductCard, SectionHeader
    payments.js               Configuración de métodos de pago
    PaymentsContext.jsx       Contexto global de pagos
    PaymentMethods.jsx        Interfaz de métodos de pago
    AuthContext.jsx           Sesión (demo localStorage / OAuth real)
    OrdersContext.jsx         Pedidos (localStorage; backend más adelante)
    pages/                    Home, Store, ProductDetail, Wiki, Services,
                              Projects, About, Contact, Cart, Checkout,
                              Account, NotFound
  hooks/
    useCart.jsx               Carrito global (localStorage "surgir-cart")
  components/
    AudioEngine.js            Motor de audio (WebAudio, ambientes)
    ExperienceGuide.jsx       Guía de bienvenida de la experiencia
    DragGestureIndicator.jsx  Indicador de interacción
    AdminPanel.jsx            Panel de configuración (engranaje ⚙)
netlify/
  functions/auth.js           OAuth2 Google/Discord + sesión en cookie HttpOnly
public/
  logo.png                    Favicon y logo proyectado en el boot
  downloads/                  Archivos descargables (productos digitales)
  _redirects                  SPA fallback para Netlify
  audio/                      Paisajes sonoros (CC0) + licencias
```

## Agregar contenido (sin tocar la UI)

Todo el contenido vive en `src/data/`:

- `products.js` — estructura:
  ```js
  {
    slug: "surgir-entregas",
    name: "SurgirEntregas",
    category: "plugins",
    price: 0,                 // 0 = gratuito (flujo carrito → checkout → pedido)
    status: "Disponible",
    featured: true,
    version: "1.0.0",
    compatibility: "Paper / Spigot / Folia",
    author: "Samuel Buritica",
    studio: "SurgirStudio",
    description: "...",
    features: [...],
    requirements: [...],
    installation: [...],
    commands: [{ cmd, desc }],
    permissions: [{ node, desc, def }],
    changelog: [{ version, date, notes }],
    wiki: { what, config, economy, ads, architecture, tech },
    tags: [...],
    downloadUrl: "/downloads/mi-archivo.zip",
  }
  ```
- `services.js`, `projects.js`, `site.js`, `workspaces.js` — mismas reglas.

> Regla: los componentes presentan datos; los archivos de datos contienen
> contenido.

### Publicar un producto digital

1. Agrega el producto en `src/data/products.js` (`price: 0` gratis).
2. Sube tu archivo a `public/downloads/` y escribe la ruta en `downloadUrl`.
3. `npm run build` y `git push` → Netlify despliega solo.
4. Para cobrar, configura pagos en el engranaje ⚙ → Administración → Pagos.

## Flujo del producto gratuito (SurgirEntregas)

```text
Producto → Añadir al carrito → Carrito → Checkout (Total $0)
        → Inicia sesión (Google/Discord) → Confirmar
        → Pedido creado (completed) → Descarga desbloqueada → Wiki
```

Los pedidos se registran en `OrdersContext` (localStorage) con la estructura
definitiva (`orderId`, `userId`, `email`, `items`, `total`, `status`,
`createdAt`). Cuando exista backend, se crearán en el servidor.

## Cuenta: Google / Discord (OAuth2)

- **Modo demo (por defecto, `VITE_AUTH_DEMO=true`):** la sesión se simula en
  localStorage. Sirve para desarrollo local y pruebas del flujo.
- **Modo real (`VITE_AUTH_DEMO=false`):** el frontend redirige a la Netlify
  Function `netlify/functions/auth.js`, que hace el intercambio OAuth
  (authorization code) y crea una **cookie HttpOnly firmada** con
  `SESSION_SECRET`. El frontend nunca ve tokens ni secretos.
- Configuración: crea las apps OAuth en Google
  (`https://console.cloud.google.com/apis/credentials`) y Discord
  (`https://discord.com/developers/applications`); registra la redirect URI de
  tu dominio; define las variables en Netlify (ver `.env.example`).

## Variables de entorno

Ver `.env.example`:

```text
VITE_AUTH_DEMO=true|false
VITE_GOOGLE_CLIENT_ID / VITE_GOOGLE_REDIRECT_URI
VITE_DISCORD_CLIENT_ID / VITE_DISCORD_REDIRECT_URI
GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET / GOOGLE_REDIRECT_URI
DISCORD_CLIENT_ID / DISCORD_CLIENT_SECRET / DISCORD_REDIRECT_URI
SESSION_SECRET
AUTH_SUCCESS_URL
VITE_CONTACT_ENDPOINT
```

**Nunca subir secretos al repositorio.** Los secretos viven solo como variables
de entorno de Netlify.

## Pagos

`src/store/payments.js` define los métodos (PSE, Nequi, tarjeta, transferencia)
y su estado. La configuración se edita desde el panel de administración
(engranaje ⚙ → Pagos) y se guarda en `localStorage` (configuración local del
navegador, no es un CMS real). No hay pasarela conectada: los productos de pago
registran el pedido como **pending** y no se cobra nada. La arquitectura permite
conectar Stripe / Mercado Pago / PayPal más adelante.

## Routing y 404

La aplicación usa **routing por hash** (`/#/store`, `/#/product/surgir-entregas`,
`/#/wiki/surgir-entregas`, `/#/account`, `/#/cart`, `/#/checkout`, …). Las URLs
funcionan al recargar gracias al SPA fallback (`public/_redirects`). Rutas
desconocidas muestran la página **404** con enlaces a Inicio / Tienda / Proyectos.

## Despliegue (Netlify)

`netlify.toml`: build `npm run build`, publish `dist`, Node 20, Functions en
`netlify/functions` (automático). `public/_redirects` redirige `/* → /index.html`.

1. Conecta el repo en Netlify.
2. Define las variables de entorno (`.env.example`).
3. Despliega. También sirve Netlify Drop con `dist/`.

## Requisitos

- Node 18+ (probado con Node 20).
- Navegador con WebGL y WebAudio.

## Licencias de audio

`public/audio/` contiene ambientes CC0/OpenGameArt y efectos Kenney (ver
`LICENSE.txt` dentro de `public/audio/`). No eliminar atribuciones.
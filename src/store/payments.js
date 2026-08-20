// Arquitectura de pagos de SURGIR — PREPARADA PARA PRODUCCIÓN, SIN PROCESADOR PROPIO.
//
// ENFOQUE: Latinoamérica (proveedor regional) + PayPal para el exterior.
//
// REGLAS DE SEGURIDAD (CRÍTICO):
// - Este módulo NO contiene ninguna Secret Key, API privada ni credencial.
// - Las credenciales del proveedor DEBEN vivir únicamente en el backend seguro
//   (servidor), nunca en el frontend, src/, localStorage ni archivos públicos.
// - SURGIR NUNCA almacena datos de tarjeta (número, CVV, PIN, fecha) ni datos
//   sensibles de pago. El proveedor de pagos es dueño de esa información; SURGIR
//   solo recibe el resultado de la transacción.
//
// FLUJO ESPERADO (cuando exista backend):
//   Catálogo -> Carrito -> Checkout -> Proveedor de pago -> Resultado -> SURGIR
//   LATAM: Proveedor regional -> tarjetas + métodos locales del país
//   EXTERIOR: PayPal
//
// En la demo actual NO hay backend ni pasarela conectada: `connected` es siempre
// false. Por eso ningún método se marca ACTIVO; se muestran como PRÓXIMAMENTE /
// NO DISPONIBLE. El administrador puede preparar la configuración, pero la
// activación real ocurre solo al conectar un backend con el proveedor.

export const REGIONS = [{ id: "latam", label: "Latinoamérica" }];

export const COUNTRIES = [
  { id: "CO", label: "Colombia" },
  { id: "MX", label: "México" },
  { id: "BR", label: "Brasil" },
  { id: "AR", label: "Argentina" },
  { id: "CL", label: "Chile" },
  { id: "PE", label: "Perú" },
];

// Moneda por mercado. Solo estructura: SIN tasas de conversión ni fuente real.
// LatAm usa la moneda local del país; lo internacional (PayPal) usa USD.
export const CURRENCIES = {
  CO: "COP",
  MX: "MXN",
  BR: "BRL",
  AR: "ARS",
  CL: "CLP",
  PE: "PEN",
  INTERNATIONAL: "USD",
};

export function currencyForMarket(cfg) {
  if (cfg.region === "latam") return CURRENCIES[cfg.country] || CURRENCIES.CO;
  return CURRENCIES.INTERNATIONAL;
}

export const CARD_BRANDS = [
  { id: "visa", label: "Visa" },
  { id: "mastercard", label: "Mastercard" },
  { id: "amex", label: "American Express" },
  { id: "discover", label: "Discover" },
];

// Métodos de pago locales de Latinoamérica (reales, por país).
export const LOCAL_METHODS = [
  { id: "pse", label: "PSE", countries: ["CO"] },
  { id: "nequi", label: "Nequi", countries: ["CO"] },
  { id: "bancolombia", label: "Bancolombia", countries: ["CO"] },
  { id: "daviplata", label: "Daviplata", countries: ["CO"] },
  { id: "oxxo", label: "OXXO", countries: ["MX"] },
  { id: "spei", label: "SPEI", countries: ["MX"] },
  { id: "boleto", label: "Boleto", countries: ["BR"] },
  { id: "pix", label: "Pix", countries: ["BR"] },
  { id: "mercadopago", label: "Mercado Pago", countries: ["AR", "CO", "MX", "BR", "CL", "PE"] },
];

// Proveedores REALES con sus páginas oficiales (sin inventar URLs).
// `scope`: "latam" = proveedor regional; "international" = solo exterior (PayPal).
// `local`: métodos locales que el proveedor soporta por país (capacidades
// generales conocidas; validar contra la documentación oficial al integrar).
export const PROVIDERS = [
  {
    id: null,
    name: "Sin proveedor (demo)",
    official: false,
    scope: "latam",
    supports: { cards: false, paypal: false },
    cards: [],
    local: {},
    links: {},
  },
  {
    id: "wompi",
    name: "Wompi",
    official: true,
    publicKey: null, // identificador público del proveedor (seguro en frontend); el secretKey vive SOLO en el backend
    scope: "latam",
    supports: { cards: true, paypal: false },
    cards: ["visa", "mastercard", "amex", "discover"],
    local: {
      CO: ["pse", "nequi", "bancolombia", "daviplata"],
      MX: [], BR: [], AR: [], CL: [], PE: [],
    },
    links: {
      dashboard: "https://dashboard.wompi.com.co",
      docs: "https://wompi.com/es/co/desarrolladores/documentacion-tecnica",
      configure: "https://dashboard.wompi.com.co/settings",
      cards: "https://docs.wompi.co/en/docs/colombia/",
    },
  },
  {
    id: "mercadopago",
    name: "Mercado Pago",
    official: true,
    publicKey: null, // identificador público del proveedor (seguro en frontend); el secretKey vive SOLO en el backend
    scope: "latam",
    supports: { cards: true, paypal: false },
    cards: ["visa", "mastercard", "amex", "discover"],
    local: {
      CO: ["pse", "mercadopago"],
      MX: ["oxxo", "spei", "mercadopago"],
      BR: ["boleto", "pix", "mercadopago"],
      AR: ["mercadopago"], CL: ["mercadopago"], PE: ["mercadopago"],
    },
    links: {
      dashboard: "https://www.mercadopago.com/developers/panel",
      docs: "https://www.mercadopago.com/developers/es/docs",
      configure: "https://www.mercadopago.com/developers/panel",
      cards: "https://www.mercadopago.com/developers/es/docs/checkout-api",
    },
  },
  {
    id: "payu",
    name: "PayU",
    official: true,
    publicKey: null, // identificador público del proveedor (seguro en frontend); el secretKey vive SOLO en el backend
    scope: "latam",
    supports: { cards: true, paypal: false },
    cards: ["visa", "mastercard", "amex", "discover"],
    local: {
      CO: ["pse"], MX: ["oxxo", "spei"], BR: ["boleto"], AR: [], CL: [], PE: [],
    },
    links: {
      dashboard: "https://www.payu.com",
      docs: "https://developers.payulatam.com",
      configure: "https://www.payu.com",
      cards: "https://developers.payulatam.com",
    },
  },
  {
    id: "stripe",
    name: "Stripe",
    official: true,
    publicKey: null, // identificador público del proveedor (seguro en frontend); el secretKey vive SOLO en el backend
    scope: "latam",
    supports: { cards: true, paypal: false },
    cards: ["visa", "mastercard", "amex", "discover"],
    local: {
      CO: [], MX: ["oxxo"], BR: ["boleto"], AR: [], CL: [], PE: [],
    },
    links: {
      dashboard: "https://dashboard.stripe.com/",
      docs: "https://docs.stripe.com/payments",
      configure: "https://dashboard.stripe.com/settings/payment_methods",
      cards: "https://docs.stripe.com/payments/cards/overview",
    },
  },
  {
    id: "paypal",
    name: "PayPal",
    official: true,
    publicKey: null, // identificador público del proveedor (seguro en frontend); el secretKey vive SOLO en el backend
    scope: "international",
    supports: { cards: false, paypal: true },
    cards: [],
    local: {},
    links: {
      dashboard: "https://www.paypal.com/dashboard/",
      docs: "https://developer.paypal.com/docs",
      configure: "https://www.paypal.com/business/",
      cards: "https://developer.paypal.com/docs/checkout/",
    },
  },
];

const CONFIG_KEY = "surgir-payments";

export function defaultPaymentsConfig() {
  return {
    region: "latam",
    country: "CO",
    regionalProviderId: "wompi", // proveedor regional por defecto (LatAm)
    paypalEnabled: true, // método internacional para el exterior
    mode: "test", // 'test' | 'production'
    connected: false, // SIEMPRE false en demo (no hay backend)
    cards: { visa: true, mastercard: true, amex: true, discover: true },
    local: {
      pse: true, nequi: true, bancolombia: true, daviplata: true,
      oxxo: false, spei: false, boleto: false, pix: false, mercadopago: false,
    },
  };
}

export function loadPaymentsConfig() {
  try {
    const raw = localStorage.getItem(CONFIG_KEY);
    if (!raw) return defaultPaymentsConfig();
    const p = JSON.parse(raw);
    // Forma legacy (genérica) con el objeto `methods`: se descarta y se
    // vuelve a los defaults del modelo LatAm.
    if (p && p.methods && typeof p.methods === "object") return defaultPaymentsConfig();
    const d = defaultPaymentsConfig();
    // Compatibilidad con forma anterior (providerId -> regionalProviderId).
    const regionalProviderId =
      typeof p.regionalProviderId === "string"
        ? p.regionalProviderId
        : typeof p.providerId === "string"
        ? p.providerId
        : d.regionalProviderId;
    return {
      region: p.region === "latam" ? "latam" : d.region,
      country: COUNTRIES.some((c) => c.id === p.country) ? p.country : d.country,
      regionalProviderId,
      paypalEnabled: !!p.paypalEnabled,
      mode: p.mode === "production" ? "production" : "test",
      connected: false, // nunca confiamos en connected desde el frontend
      cards: { ...d.cards, ...(p.cards || {}) },
      local: { ...d.local, ...(p.local || {}) },
    };
  } catch {
    return defaultPaymentsConfig();
  }
}

export function savePaymentsConfig(cfg) {
  try {
    // Solo se persisten preferencias de UI (sin credenciales ni datos de pago).
    localStorage.setItem(
      CONFIG_KEY,
      JSON.stringify({
        region: cfg.region,
        country: cfg.country,
        regionalProviderId: cfg.regionalProviderId,
        paypalEnabled: cfg.paypalEnabled,
        mode: cfg.mode,
        cards: cfg.cards,
        local: cfg.local,
      })
    );
  } catch {}
}

export function getProvider(id) {
  return PROVIDERS.find((p) => p.id === id) || PROVIDERS[0];
}
export function regionalProvider(cfg) {
  return getProvider(cfg.regionalProviderId);
}
export function paypalProvider() {
  return getProvider("paypal");
}

// Estados: 'active' (ACTIVO), 'soon' (PRÓXIMAMENTE), 'disabled' (NO DISPONIBLE).
export function cardStatus(cfg, cardId) {
  const p = regionalProvider(cfg);
  const accepted = !!cfg.cards[cardId];
  const supported = p.cards?.includes(cardId) ?? false;
  if (!accepted || !supported) return "disabled";
  return cfg.connected ? "active" : "soon";
}

export function localStatus(cfg, methodId) {
  const p = regionalProvider(cfg);
  const accepted = !!cfg.local?.[methodId];
  const supported = (p.local?.[cfg.country] || []).includes(methodId);
  if (!accepted || !supported) return "disabled";
  return cfg.connected ? "active" : "soon";
}

export function paypalStatus(cfg) {
  const accepted = !!cfg.paypalEnabled;
  const supported = paypalProvider().supports?.paypal ?? false;
  if (!accepted || !supported) return "disabled";
  return cfg.connected ? "active" : "soon";
}

export const STATUS_LABEL = { active: "ACTIVO", soon: "PRÓXIMAMENTE", disabled: "NO DISPONIBLE" };

// Metadatos para la admin: símbolo + texto (Activo / Inactivo / Próximamente).
export const STATUS_META = {
  active: { symbol: "●", label: "Activo", cls: "active" },
  disabled: { symbol: "○", label: "Inactivo", cls: "disabled" },
  soon: { symbol: "⚠", label: "Próximamente", cls: "soon" },
};

// Métodos locales realmente disponibles para el mercado seleccionado según el
// proveedor regional elegido (solo los que el proveedor soporta en ese país).
export function localMethodsForMarket(cfg) {
  const p = regionalProvider(cfg);
  return LOCAL_METHODS.filter((m) => (p.local?.[cfg.country] || []).includes(m.id));
}

// Resumen del mercado para una futura integración de producción (sin activarla).
// Estructura conceptual: país, moneda, proveedor y métodos disponibles.
// NOTA: el frontend NUNCA decide si un pago está "conectado"; eso lo confirma
// el backend tras validar al proveedor. Aquí `connected` es siempre false.
export function marketSummary(cfg) {
  const provider = regionalProvider(cfg);
  return {
    country: cfg.country,
    currency: currencyForMarket(cfg),
    paymentProvider: provider.id || null,
    availableMethods: [
      ...CARD_BRANDS.filter((c) => cfg.cards[c.id]).map((c) => c.id),
      ...localMethodsForMarket(cfg)
        .filter((m) => cfg.local?.[m.id])
        .map((m) => m.id),
      ...(cfg.paypalEnabled ? ["paypal"] : []),
    ],
    connected: cfg.connected, // siempre false en demo
  };
}

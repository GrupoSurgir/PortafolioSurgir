// Descargas digitales por correo electrónico.
// Flujo simplificado: el usuario deja su correo en el producto y se desbloquea
// la descarga. Se guarda localmente (localStorage). Cuando exista backend, el
// enlace también se enviará por correo desde el servidor.

const KEY = "surgir-downloads";
const EMAIL_KEY = "surgir-last-email";

export function getGrants() {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || "[]");
    return Array.isArray(raw) ? raw : [];
  } catch {
    return [];
  }
}

function save(grants) {
  try {
    localStorage.setItem(KEY, JSON.stringify(grants));
  } catch {}
}

export function hasDownload(slug) {
  return getGrants().some((g) => g.slug === slug);
}

export function grantDownload(slug, email) {
  const grants = getGrants();
  if (!grants.some((g) => g.slug === slug)) {
    grants.push({ slug, email: email || "", date: new Date().toISOString() });
    save(grants);
  }
  if (email) setLastEmail(email);
}

export function getLastEmail() {
  try {
    return localStorage.getItem(EMAIL_KEY) || "";
  } catch {
    return "";
  }
}

function setLastEmail(email) {
  try {
    localStorage.setItem(EMAIL_KEY, email);
  } catch {}
}
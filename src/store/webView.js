// Estado compartido de la última vista web entre la aplicación (StoreApp) y el
// monitor del PC en la experiencia 3D.
//
// La RUTA ya vive en window.location.hash (la navegación real existente): tanto
// la StoreApp de pantalla completa como la del monitor la leen, así que ambas se
// sincronizan automáticamente. Este módulo guarda únicamente lo que el hash no
// puede expresar: el scroll de la página en curso.
//
// StoreApp actualiza scrollY al desplazarse. App.jsx emite "surgir:web-visible"
// al volver al espacio 3D, y la instancia del monitor aplica ese scroll.

export const webView = {
  scrollY: 0,
};

export function notifyWebVisible() {
  window.dispatchEvent(new Event("surgir:web-visible"));
}
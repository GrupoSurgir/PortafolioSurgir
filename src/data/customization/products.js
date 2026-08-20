// Catálogo del Workplace Builder.
//
// Los productos de personalización viven en src/data/products.js (fuente única
// de la tienda). Este módulo los filtra y los expone en la forma que el Builder
// necesita (por slot, por id, por slug), sin duplicar datos.

import { products as allProducts } from "../products.js";

export const builderProducts = allProducts.filter(
  (p) => p.category === "personalizacion"
);

export const builderProductById = (id) =>
  builderProducts.find((p) => p.id === id);

export const builderProductBySlug = (slug) =>
  builderProducts.find((p) => p.slug === slug);

export const builderProductsBySlot = (slot) =>
  builderProducts.filter((p) => p.slot === slot);

export const builderCategories = [
  { id: "monitor", label: "Pantallas", icon: "🖥️" },
  { id: "pc", label: "PC / CPU", icon: "🖥️" },
  { id: "keyboard", label: "Teclados", icon: "⌨️" },
  { id: "mouse", label: "Mouse", icon: "🖱️" },
  { id: "ringLight", label: "Iluminación", icon: "💡" },
];
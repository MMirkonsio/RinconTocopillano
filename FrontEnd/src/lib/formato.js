import { API_URL } from "../config";

const clp = new Intl.NumberFormat("es-CL", {
  style: "currency",
  currency: "CLP",
  maximumFractionDigits: 0,
});

// 2500 → "$2.500"; 0 → "Gratis"
export const formatearPrecio = (precio) => {
  const n = Number(precio);
  if (!Number.isFinite(n)) return "";
  return n === 0 ? "Gratis" : clp.format(n);
};

const relativo = new Intl.RelativeTimeFormat("es", { numeric: "auto" });
const UNIDADES = [
  ["year", 60 * 60 * 24 * 365],
  ["month", 60 * 60 * 24 * 30],
  ["week", 60 * 60 * 24 * 7],
  ["day", 60 * 60 * 24],
  ["hour", 60 * 60],
  ["minute", 60],
];

// Fecha → "hace 3 horas", "ayer", "hace 2 semanas"
export const tiempoRelativo = (fecha) => {
  const segundos = (new Date(fecha).getTime() - Date.now()) / 1000;
  if (!Number.isFinite(segundos)) return "";
  for (const [unidad, duracion] of UNIDADES) {
    if (Math.abs(segundos) >= duracion) {
      return relativo.format(Math.round(segundos / duracion), unidad);
    }
  }
  return "justo ahora";
};

// Fecha → "27 de marzo de 2024, 05:38"
export const fechaCompleta = (fecha) =>
  new Date(fecha).toLocaleString("es-CL", { dateStyle: "long", timeStyle: "short" });

// Nombre de archivo de /uploads → URL completa
export const imagenUrl = (nombre) => `${API_URL}/uploads/${nombre || "default.webp"}`;

// Enlace de WhatsApp a partir de un teléfono chileno (agrega +56 si falta)
export const enlaceWhatsApp = (telefono, mensaje) => {
  let digitos = String(telefono || "").replace(/\D/g, "");
  if (digitos.length < 8) return null;
  if (digitos.length === 9) digitos = `56${digitos}`;
  return `https://wa.me/${digitos}?text=${encodeURIComponent(mensaje)}`;
};

export const contar = (n, singular, plural) => `${n} ${n === 1 ? singular : plural}`;

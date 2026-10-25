// URL del servidor backend. Se configura con VITE_API_URL en FrontEnd/.env.
// En producción, sin VITE_API_URL, la API se pide al mismo dominio del sitio: Vercel reenvía
// /api y /uploads al backend (ver vercel.json). Así la cookie de sesión es del mismo sitio
// y los navegadores no la bloquean.
const porDefecto = import.meta.env.PROD ? "" : "http://localhost:3000";

export const API_URL = (import.meta.env.VITE_API_URL ?? porDefecto).replace(/\/$/, "");

// Raíz de la API REST
export const API = `${API_URL}/api`;

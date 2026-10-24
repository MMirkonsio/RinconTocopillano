// URL del servidor backend. Se configura con VITE_API_URL en FrontEnd/.env
export const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:3000"
).replace(/\/$/, "");

// Raíz de la API REST
export const API = `${API_URL}/api`;

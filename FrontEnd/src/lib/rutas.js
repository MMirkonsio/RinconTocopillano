// Todas las URLs del sitio en un solo lugar. Usar siempre estas funciones en vez de
// escribir las rutas a mano, así un cambio de URL se hace una sola vez.
import { CATEGORIAS } from "./categorias";

// "Empanadas de Pino ¡Ricas!" → "empanadas-de-pino-ricas"
export const slug = (texto) =>
  String(texto ?? "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // quitar tildes
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60)
    .replace(/-+$/, "");

export const rutas = {
  inicio: "/",
  populares: "/?orden=populares",
  buscar: (q) => (q ? `/?q=${encodeURIComponent(q)}` : "/"),
  publicar: "/publicar",
  // /publicacion/66/completos-italianos (el texto es solo para que el enlace se lea bien)
  publicacion: (id, titulo) => {
    const s = slug(titulo);
    return s ? `/publicacion/${id}/${s}` : `/publicacion/${id}`;
  },
  usuario: (nombre) => `/usuario/${encodeURIComponent(nombre)}`,
  categoria: (id) => `/categoria/${categoriaSlug(id)}`,
  guardados: "/guardados",
  notificaciones: "/notificaciones",
  ajustes: "/ajustes",
  ayuda: "/ayuda",
  iniciarSesion: "/iniciar-sesion",
  registro: "/registro",
};

const SLUGS_CATEGORIA = Object.fromEntries(CATEGORIAS.map((c) => [c.id, slug(c.nombre)]));

export const categoriaSlug = (id) => SLUGS_CATEGORIA[id] ?? "otros";

// "juguetes-y-juegos" → 4 (o null si no existe)
export const categoriaIdPorSlug = (s) => {
  const encontrada = CATEGORIAS.find((c) => SLUGS_CATEGORIA[c.id] === s);
  return encontrada ? encontrada.id : null;
};

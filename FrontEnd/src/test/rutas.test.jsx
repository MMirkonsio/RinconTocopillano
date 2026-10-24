// Tests de todas las rutas del sitio: que cada URL muestre la página correcta, que las URLs
// antiguas redirijan a las nuevas y que ningún enlace interno lleve a "página no existe".
// La API se simula con datos de ejemplo (no hace falta el backend).
//   npm test
import { describe, expect, test, vi, beforeEach } from "vitest";
import { act, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, useLocation, useNavigate } from "react-router-dom";
import { AuthProvider } from "../auth/AuthContext";
import { Rutas } from "../App";
import { categoriaIdPorSlug, categoriaSlug, rutas, slug } from "../lib/rutas";

// ---------------------------------------------------------------------------
// API simulada
// ---------------------------------------------------------------------------
const USUARIO = {
  id: 36,
  nombre_usuario: "prueba1",
  foto_perfil: "default.webp",
  telefono: "+56912345678",
  descripcion: "Completos y churrascos",
  direccion: "Calle 21 de Mayo",
  horario: "Todos los días",
};
const PUBLICACION = {
  publicacion_id: 66,
  usuario_id: 36,
  categoria_id: 1,
  titulo: "Completos italianos",
  contenido: "Completos caseros en Tocopilla",
  precio: "3500",
  estado: "disponible",
  imagen_contenido: "a.jpg",
  imagenes: ["a.jpg", "b.jpg"],
  tiempo_publicacion: "2026-10-20T10:00:00Z",
  nombre_usuario: "prueba1",
  foto_perfil: "default.webp",
  nombre_categoria: "Comida",
  total_votos: 1,
  total_comentarios: 0,
  mi_voto: null,
  guardado: 0,
  telefono: "+56912345678",
};

const OTRO_USUARIO = { ...USUARIO, id: 35, nombre_usuario: "Christonsio", telefono: "" };
const OTRA_PUBLICACION = {
  ...PUBLICACION,
  publicacion_id: 39,
  usuario_id: 35,
  titulo: "EMPANADAS FRITAS",
  nombre_usuario: "Christonsio",
};

const noEncontrado = () => Promise.reject({ response: { status: 404, data: { error: "No encontrado" } } });

const respuestaGet = (url) => {
  const ruta = decodeURIComponent(url.replace(/^.*\/api/, ""));
  const tabla = {
    "/publicaciones": [PUBLICACION],
    "/publicaciones/populares": [{ ...PUBLICACION, likes: 1 }],
    "/publicaciones/66": PUBLICACION,
    "/publicaciones/66/comentarios": { comentarios: [], totalComentarios: 0 },
    "/publicaciones/39": OTRA_PUBLICACION,
    "/publicaciones/39/comentarios": { comentarios: [], totalComentarios: 0 },
    "/usuarios/id/36": USUARIO,
    "/usuarios/prueba1": USUARIO,
    "/usuarios/prueba1/publicaciones": [PUBLICACION],
    "/usuarios/christonsio": OTRO_USUARIO,
    "/usuarios/christonsio/publicaciones": [OTRA_PUBLICACION],
    "/perfil": { ...USUARIO, correo: "prueba1@rincon.test" },
    "/guardados": [{ ...PUBLICACION, total_imagenes: 2 }],
    "/notificaciones": [],
    "/notificaciones/total": { total_notificaciones: 0 },
    "/auth/me": { usuario_id: 36, nombre_usuario: "prueba1", correo: "prueba1@rincon.test" },
  };
  // Los nombres de usuario no distinguen mayúsculas (como en MySQL)
  const clave = Object.keys(tabla).find((k) => k.toLowerCase() === ruta.toLowerCase());
  return clave ? Promise.resolve({ data: tabla[clave] }) : noEncontrado();
};

vi.mock("axios", () => {
  const api = {
    get: vi.fn((url) => respuestaGet(url)),
    post: vi.fn(() => Promise.resolve({ data: {} })),
    put: vi.fn(() => Promise.resolve({ data: {} })),
    patch: vi.fn(() => Promise.resolve({ data: {} })),
    delete: vi.fn(() => Promise.resolve({ data: {} })),
    defaults: {},
    interceptors: { response: { use: vi.fn() } },
  };
  return { default: api };
});

// ---------------------------------------------------------------------------
// Utilidades
// ---------------------------------------------------------------------------
let ubicacion;
let navegar;
function Espia() {
  ubicacion = useLocation();
  navegar = useNavigate();
  return null;
}

const iniciarSesion = () =>
  localStorage.setItem(
    "user",
    JSON.stringify({ id: 36, nombre_usuario: "prueba1", correo: "prueba1@rincon.test", foto_perfil: "default.webp" })
  );

const abrir = (url) =>
  render(
    <AuthProvider>
      <MemoryRouter initialEntries={[url]}>
        <Rutas />
        <Espia />
      </MemoryRouter>
    </AuthProvider>
  );

const urlActual = () => `${ubicacion.pathname}${ubicacion.search}`;
const esperarUrl = (esperada) => waitFor(() => expect(urlActual()).toBe(esperada));
const titulo = (texto) => screen.findByRole("heading", { level: 1, name: texto });
const pagina404 = () => screen.findByText("Esta página no existe");

beforeEach(() => {
  ubicacion = null;
});

// ---------------------------------------------------------------------------
// Helpers de URLs
// ---------------------------------------------------------------------------
describe("lib/rutas", () => {
  test("slug quita tildes, signos y espacios", () => {
    expect(slug("Empanadas de Pino ¡Ricas!")).toBe("empanadas-de-pino-ricas");
    expect(slug("Ñandú   Electrónicos 2026")).toBe("nandu-electronicos-2026");
    expect(slug("¡¡¡")).toBe("");
  });

  test("URLs de publicaciones, usuarios y categorías", () => {
    expect(rutas.publicacion(66, "Completos italianos")).toBe("/publicacion/66/completos-italianos");
    expect(rutas.publicacion(7, "!!!")).toBe("/publicacion/7");
    expect(rutas.usuario("ana.maría")).toBe("/usuario/ana.mar%C3%ADa");
    expect(rutas.categoria(4)).toBe("/categoria/juguetes-y-juegos");
    expect(rutas.buscar("bici roja")).toBe("/?q=bici%20roja");
  });

  test("slugs de categoría ida y vuelta", () => {
    for (let id = 1; id <= 7; id++) expect(categoriaIdPorSlug(categoriaSlug(id))).toBe(id);
    expect(categoriaIdPorSlug("no-existe")).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// Páginas
// ---------------------------------------------------------------------------
describe("Páginas", () => {
  test("/ muestra el feed", async () => {
    abrir("/");
    expect(await screen.findByRole("link", { name: "Completos italianos" })).toBeTruthy();
    expect(urlActual()).toBe("/");
  });

  test("/?q= muestra el resumen de la búsqueda", async () => {
    abrir("/?q=completos");
    expect(await screen.findByText(/1 resultado para/)).toBeTruthy();
  });

  test("/publicacion/:id/:slug muestra el detalle", async () => {
    abrir("/publicacion/66/completos-italianos");
    expect(await titulo("Completos italianos")).toBeTruthy();
    expect(urlActual()).toBe("/publicacion/66/completos-italianos");
  });

  test("/publicacion inexistente muestra un aviso", async () => {
    abrir("/publicacion/999/lo-que-sea");
    expect(await screen.findByText("Esta publicación no existe")).toBeTruthy();
  });

  test("/usuario/:nombre muestra el perfil", async () => {
    abrir("/usuario/prueba1");
    expect(await titulo("prueba1")).toBeTruthy();
  });

  test("/usuario inexistente muestra un aviso", async () => {
    abrir("/usuario/nadie");
    expect(await screen.findByText("Este perfil no existe")).toBeTruthy();
  });

  test.each([
    ["/categoria/comida", "Comida"],
    ["/categoria/ropa", "Ropa"],
    ["/categoria/electronicos", "Electrónicos"],
    ["/categoria/juguetes-y-juegos", "Juguetes y juegos"],
    ["/categoria/mascotas", "Mascotas"],
    ["/categoria/deportes", "Deportes"],
    ["/categoria/otros", "Otros"],
  ])("%s muestra la categoría", async (url, nombre) => {
    abrir(url);
    expect(await titulo(nombre)).toBeTruthy();
  });

  test("/categoria inexistente → 404", async () => {
    abrir("/categoria/autos-voladores");
    expect(await pagina404()).toBeTruthy();
  });

  test.each([
    ["/guardados", "Guardados"],
    ["/notificaciones", "Notificaciones"],
    ["/ajustes", "Editar perfil"],
    ["/publicar", "Crear publicación"],
  ])("%s con sesión", async (url, nombre) => {
    iniciarSesion();
    abrir(url);
    expect(await titulo(nombre)).toBeTruthy();
  });

  test.each([
    ["/guardados", "Inicia sesión para ver tus guardados"],
    ["/notificaciones", "Inicia sesión para ver tus notificaciones"],
    ["/ajustes", "Inicia sesión para editar tu perfil"],
    ["/publicar", "Inicia sesión para publicar"],
  ])("%s sin sesión pide iniciar sesión", async (url, texto) => {
    abrir(url);
    expect(await screen.findByText(texto)).toBeTruthy();
  });

  test.each([
    ["/ayuda", "Centro de ayuda"],
    ["/iniciar-sesion", "Bienvenido de vuelta"],
    ["/registro", "Crea tu cuenta"],
  ])("%s", async (url, nombre) => {
    abrir(url);
    expect(await titulo(nombre)).toBeTruthy();
  });

  test.each(["/no-existe", "/publicacion", "/usuario", "/categoria", "/api/publicaciones"])("%s → 404", async (url) => {
    abrir(url);
    expect(await pagina404()).toBeTruthy();
  });
});

// ---------------------------------------------------------------------------
// URLs canónicas y redirecciones desde las URLs antiguas
// ---------------------------------------------------------------------------
describe("Redirecciones", () => {
  test.each([
    ["/publicacion/66", "/publicacion/66/completos-italianos"],
    ["/publicacion/66/comments", "/publicacion/66/completos-italianos"],
    ["/publicacion/66/titulo-antiguo", "/publicacion/66/completos-italianos"],
    ["/usuario/PRUEBA1", "/usuario/prueba1"],
    ["/inicio", "/"],
    ["/inicio?q=bici&orden=populares", "/?q=bici&orden=populares"],
    ["/login", "/iniciar-sesion"],
    ["/editar-perfil", "/ajustes"],
    ["/guardados/36", "/guardados"],
    ["/bandeja-de-entrada/36", "/notificaciones"],
    ["/categorias/1", "/categoria/comida"],
    ["/categorias/4", "/categoria/juguetes-y-juegos"],
    ["/perfil/36", "/usuario/prueba1"],
  ])("%s → %s", async (desde, hacia) => {
    abrir(desde);
    await esperarUrl(hacia);
  });

  test.each(["/categorias/99", "/categorias/abc", "/perfil/999"])("%s (no existe) → 404", async (url) => {
    abrir(url);
    expect(await pagina404()).toBeTruthy();
  });
});

// ---------------------------------------------------------------------------
// Navegar dentro de la app (sin recargar) de una página a otra del mismo tipo.
// La pantalla se reutiliza y por un momento conserva los datos de la anterior.
// ---------------------------------------------------------------------------
describe("Navegación sin recargar", () => {
  test("de una publicación a otra, y luego a una inexistente", async () => {
    abrir("/publicacion/66/completos-italianos");
    await titulo("Completos italianos");
    await act(() => navegar("/publicacion/39"));
    await esperarUrl("/publicacion/39/empanadas-fritas");
    expect(await titulo("EMPANADAS FRITAS")).toBeTruthy();
    await act(() => navegar("/publicacion/9999"));
    expect(await screen.findByText("Esta publicación no existe")).toBeTruthy();
    expect(urlActual()).toBe("/publicacion/9999");
  });

  test("de un perfil a otro", async () => {
    abrir("/usuario/prueba1");
    await titulo("prueba1");
    await act(() => navegar("/usuario/Christonsio"));
    expect(await titulo("Christonsio")).toBeTruthy();
    await new Promise((r) => setTimeout(r, 50));
    expect(urlActual()).toBe("/usuario/Christonsio");
  });
});

// ---------------------------------------------------------------------------
// Ningún enlace interno lleva a una página que no existe
// ---------------------------------------------------------------------------
describe("Enlaces internos", () => {
  const enlacesDe = async (url, esperar) => {
    iniciarSesion();
    const { unmount } = abrir(url);
    await esperar();
    const enlaces = [...document.querySelectorAll("a[href^='/']")].map((a) => a.getAttribute("href"));
    unmount();
    return [...new Set(enlaces)];
  };

  test("todos los enlaces del inicio, el detalle y el perfil llevan a páginas que existen", async () => {
    const enlaces = new Set([
      ...(await enlacesDe("/", () => screen.findByRole("link", { name: "Completos italianos" }))),
      ...(await enlacesDe("/publicacion/66/completos-italianos", () => titulo("Completos italianos"))),
      ...(await enlacesDe("/usuario/prueba1", () => titulo("prueba1"))),
    ]);
    expect(enlaces.size).toBeGreaterThan(15);
    // Ninguna URL antigua debe quedar en los enlaces
    for (const href of enlaces) {
      expect(href).not.toMatch(/\/(inicio|login|perfil\/|categorias\/|bandeja-de-entrada|editar-perfil)|\/comments/);
    }
    for (const href of enlaces) {
      iniciarSesion();
      const { unmount } = abrir(href);
      // Dar tiempo a las peticiones simuladas y comprobar que no se llegó al 404
      await waitFor(() => expect(document.querySelector("main")).toBeTruthy());
      await new Promise((r) => setTimeout(r, 0));
      expect(screen.queryByText("Esta página no existe"), href).toBeNull();
      unmount();
    }
  }, 30000);
});

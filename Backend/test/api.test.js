// Tests de integración de la API. Usan la base de datos del .env (crea dos usuarios de
// prueba y los borra al final, junto con todo lo que publicaron).
//   npm test
process.env.LIMITE_AUTH = "1000"; // que el límite de intentos de login no corte los tests

const { test, before, after, describe } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const app = require("../src/app");
const { db } = require("../src/db");
const { uploadsDir } = require("../src/config");
const { borrarImagenesSinUso } = require("../src/utils/archivos");

// PNG válido de 1×1 px (pasa la comprobación de firma de imagen)
const PNG = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
  "base64"
);

let servidor;
let base;

// Cliente HTTP mínimo que guarda la cookie de sesión como un navegador
const cliente = () => {
  let cookie = "";
  const pedir = async (metodo, ruta, { json, form } = {}) => {
    const headers = { Origin: "http://localhost:5173" };
    if (cookie) headers.Cookie = cookie;
    let body;
    if (json !== undefined) {
      headers["Content-Type"] = "application/json";
      body = JSON.stringify(json);
    } else if (form) {
      body = form;
    }
    const res = await fetch(`${base}${ruta}`, { method: metodo, headers, body });
    const setCookie = res.headers.get("set-cookie");
    if (setCookie) cookie = setCookie.split(";")[0];
    const texto = await res.text();
    let datos;
    try {
      datos = JSON.parse(texto);
    } catch {
      datos = texto;
    }
    return { status: res.status, datos, headers: res.headers };
  };
  return {
    get: (r) => pedir("GET", r),
    post: (r, opciones) => pedir("POST", r, opciones),
    put: (r, opciones) => pedir("PUT", r, opciones),
    patch: (r, opciones) => pedir("PATCH", r, opciones),
    delete: (r, opciones) => pedir("DELETE", r, opciones),
  };
};

const formulario = (campos, imagenes = []) => {
  const f = new FormData();
  for (const [k, v] of Object.entries(campos)) f.append(k, String(v));
  for (const [campo, nombre, contenido = PNG, tipo = "image/png"] of imagenes) {
    f.append(campo, new Blob([contenido], { type: tipo }), nombre);
  }
  return f;
};

const sufijo = Date.now().toString(36);
const usuarioA = { nombre_usuario: `test_a_${sufijo}`, correo: `a_${sufijo}@test.cl`, telefono: "+56911111111", password: "Clave1234" };
const usuarioB = { nombre_usuario: `test_b_${sufijo}`, correo: `b_${sufijo}@test.cl`, telefono: "", password: "Clave1234" };
const anonimo = cliente();
const a = cliente();
const b = cliente();
let idA;
let publicacionId;
let fotosPublicacion = [];

before(async () => {
  await new Promise((resolve) => {
    servidor = app.listen(0, resolve);
  });
  base = `http://127.0.0.1:${servidor.address().port}`;
});

after(async () => {
  // Borrar los usuarios de prueba (sus publicaciones, votos, etc. caen en cascada) y sus fotos
  const [usuarios] = await db.query("SELECT id, foto_perfil FROM usuarios WHERE nombre_usuario IN (?, ?)", [
    usuarioA.nombre_usuario,
    usuarioB.nombre_usuario,
  ]);
  const ids = usuarios.map((u) => u.id);
  if (ids.length) {
    const [fotos] = await db.query(
      "SELECT pi.archivo FROM publicacion_imagenes pi JOIN publicaciones p USING (publicacion_id) WHERE p.usuario_id IN (?)",
      [ids]
    );
    await db.query("DELETE FROM usuarios WHERE id IN (?)", [ids]);
    await borrarImagenesSinUso([...fotos.map((f) => f.archivo), ...usuarios.map((u) => u.foto_perfil)]);
  }
  servidor.closeAllConnections();
  await new Promise((resolve) => servidor.close(resolve));
  await app.locals.sessionStore.close();
  await db.end();
});

describe("General", () => {
  test("GET /api/salud responde ok", async () => {
    const r = await anonimo.get("/api/salud");
    assert.equal(r.status, 200);
    assert.equal(r.datos.ok, true);
  });

  test("GET / indica dónde está la API", async () => {
    const r = await anonimo.get("/");
    assert.equal(r.status, 200);
    assert.equal(r.datos.api, "/api");
  });

  test("una ruta inexistente responde 404 en JSON", async () => {
    const r = await anonimo.get("/api/no-existe");
    assert.equal(r.status, 404);
    assert.ok(r.datos.error);
  });

  test("las rutas antiguas sin /api ya no existen", async () => {
    for (const ruta of ["/publicaciones", "/buscar-publicaciones", "/populares", "/login"]) {
      const r = await anonimo.get(ruta);
      assert.equal(r.status, 404, ruta);
    }
  });

  test("JSON mal formado responde 400", async () => {
    const res = await fetch(`${base}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "{mal",
    });
    assert.equal(res.status, 400);
  });
});

describe("Autenticación", () => {
  test("registro rechaza nombres con espacios", async () => {
    const r = await anonimo.post("/api/auth/registro", { form: formulario({ ...usuarioA, nombre_usuario: "con espacio" }) });
    assert.equal(r.status, 400);
  });

  test("registro rechaza contraseñas cortas", async () => {
    const r = await anonimo.post("/api/auth/registro", { form: formulario({ ...usuarioA, password: "123" }) });
    assert.equal(r.status, 400);
  });

  test("registro con foto de perfil", async () => {
    const r = await anonimo.post("/api/auth/registro", {
      form: formulario(usuarioA, [["foto_perfil", "yo.png"]]),
    });
    assert.equal(r.status, 200, JSON.stringify(r.datos));
  });

  test("registro sin foto (usa la por defecto)", async () => {
    const r = await anonimo.post("/api/auth/registro", { form: formulario(usuarioB) });
    assert.equal(r.status, 200, JSON.stringify(r.datos));
  });

  test("registro duplicado responde 400", async () => {
    const r = await anonimo.post("/api/auth/registro", { form: formulario(usuarioA) });
    assert.equal(r.status, 400);
  });

  test("login con contraseña incorrecta responde 401", async () => {
    const r = await anonimo.post("/api/auth/login", { json: { correo: usuarioA.correo, password: "mala-clave" } });
    assert.equal(r.status, 401);
  });

  test("login correcto crea una cookie httpOnly", async () => {
    const r = await a.post("/api/auth/login", { json: { correo: usuarioA.correo, password: usuarioA.password } });
    assert.equal(r.status, 200);
    assert.match(r.headers.get("set-cookie"), /HttpOnly/i);
    idA = r.datos.usuario_id;
    const rb = await b.post("/api/auth/login", { json: { correo: usuarioB.correo, password: usuarioB.password } });
    assert.equal(rb.status, 200);
  });

  test("GET /api/auth/me con y sin sesión", async () => {
    assert.equal((await a.get("/api/auth/me")).datos.nombre_usuario, usuarioA.nombre_usuario);
    assert.equal((await anonimo.get("/api/auth/me")).status, 401);
  });
});

describe("Usuarios y perfil", () => {
  test("perfil público por nombre, sin correo ni contraseña", async () => {
    const r = await anonimo.get(`/api/usuarios/${usuarioA.nombre_usuario}`);
    assert.equal(r.status, 200);
    assert.equal(r.datos.id, idA);
    assert.equal(r.datos.correo, undefined);
    assert.equal(r.datos.password, undefined);
    assert.notEqual(r.datos.foto_perfil, "default.webp");
  });

  test("el dueño ve su correo", async () => {
    const r = await a.get(`/api/usuarios/${usuarioA.nombre_usuario}`);
    assert.equal(r.datos.correo, usuarioA.correo);
  });

  test("usuario inexistente responde 404", async () => {
    assert.equal((await anonimo.get("/api/usuarios/nadie_se_llama_asi")).status, 404);
  });

  test("perfil por id (enlaces antiguos) y id inválido", async () => {
    assert.equal((await anonimo.get(`/api/usuarios/id/${idA}`)).datos.nombre_usuario, usuarioA.nombre_usuario);
    assert.equal((await anonimo.get("/api/usuarios/id/abc")).status, 404);
  });

  test("GET /api/perfil requiere sesión", async () => {
    assert.equal((await anonimo.get("/api/perfil")).status, 401);
    assert.equal((await a.get("/api/perfil")).datos.correo, usuarioA.correo);
  });

  test("PATCH /api/perfil actualiza y no deja cambiar la contraseña", async () => {
    const r = await a.patch("/api/perfil", { json: { horario: "Lun a Vie 9-18", password: "otra" } });
    assert.equal(r.status, 200);
    const perfil = (await a.get("/api/perfil")).datos;
    assert.equal(perfil.horario, "Lun a Vie 9-18");
    const login = await cliente().post("/api/auth/login", { json: { correo: usuarioA.correo, password: usuarioA.password } });
    assert.equal(login.status, 200, "la contraseña original debe seguir funcionando");
  });

  test("PATCH /api/perfil valida el nombre de usuario", async () => {
    const r = await a.patch("/api/perfil", { json: { nombre_usuario: "con espacio" } });
    assert.equal(r.status, 400);
  });
});

describe("Publicaciones", () => {
  test("crear requiere sesión", async () => {
    const r = await anonimo.post("/api/publicaciones", { form: formulario({ titulo: "x" }) });
    assert.equal(r.status, 401);
  });

  test("crear sin imágenes responde 400", async () => {
    const r = await a.post("/api/publicaciones", {
      form: formulario({ titulo: "Sin foto", contenido: "x", precio: 100, categoria_id: 1 }),
    });
    assert.equal(r.status, 400);
  });

  test("crear con un archivo que no es imagen responde 400", async () => {
    const r = await a.post("/api/publicaciones", {
      form: formulario({ titulo: "Falsa", contenido: "x", precio: 100, categoria_id: 1 }, [
        ["imagenes", "falsa.jpg", Buffer.from("<html>"), "image/jpeg"],
      ]),
    });
    assert.equal(r.status, 400);
  });

  test("crear con más de 8 imágenes responde 400", async () => {
    const nueve = Array.from({ length: 9 }, (_, i) => ["imagenes", `f${i}.png`]);
    const r = await a.post("/api/publicaciones", {
      form: formulario({ titulo: "Muchas", contenido: "x", precio: 1, categoria_id: 1 }, nueve),
    });
    assert.equal(r.status, 400);
  });

  test("crear con una categoría inexistente responde 400", async () => {
    const r = await a.post("/api/publicaciones", {
      form: formulario({ titulo: "Cat", contenido: "x", precio: 1, categoria_id: 999 }, [["imagenes", "f.png"]]),
    });
    assert.equal(r.status, 400);
  });

  test("crear con dos imágenes responde 201", async () => {
    const r = await a.post("/api/publicaciones", {
      form: formulario({ titulo: `Bicicleta de prueba ${sufijo}`, contenido: "Aro 26", precio: "45.000", categoria_id: 6 }, [
        ["imagenes", "1.png"],
        ["imagenes", "2.png"],
      ]),
    });
    assert.equal(r.status, 201, JSON.stringify(r.datos));
    publicacionId = r.datos.publicacion_id;
  });

  test("detalle con autor, fotos en orden y teléfono de contacto", async () => {
    const r = await anonimo.get(`/api/publicaciones/${publicacionId}`);
    assert.equal(r.status, 200);
    assert.equal(r.datos.nombre_usuario, usuarioA.nombre_usuario);
    assert.equal(r.datos.imagenes.length, 2);
    assert.equal(r.datos.imagen_contenido, r.datos.imagenes[0]);
    assert.equal(r.datos.precio, "45000");
    assert.equal(r.datos.estado, "disponible");
    assert.equal(r.datos.telefono, usuarioA.telefono);
    fotosPublicacion = r.datos.imagenes;
    for (const f of fotosPublicacion) assert.ok(fs.existsSync(path.join(uploadsDir, f)));
  });

  test("detalle inexistente responde 404", async () => {
    assert.equal((await anonimo.get("/api/publicaciones/999999")).status, 404);
    assert.equal((await anonimo.get("/api/publicaciones/abc")).status, 404);
  });

  test("listado con búsqueda, categoría y orden", async () => {
    const r = await anonimo.get(`/api/publicaciones?search=${sufijo}&categoria=6&orden=populares`);
    assert.equal(r.status, 200);
    assert.deepEqual(
      r.datos.map((p) => p.publicacion_id),
      [publicacionId]
    );
    const otraCategoria = await anonimo.get(`/api/publicaciones?search=${sufijo}&categoria=1`);
    assert.equal(otraCategoria.datos.length, 0);
  });

  test("la búsqueda trata los comodines de SQL como texto", async () => {
    const r = await anonimo.get("/api/publicaciones?search=%25%25%25");
    assert.equal(r.status, 200);
    assert.ok(r.datos.every((p) => p.titulo.includes("%") || p.contenido.includes("%")));
  });

  test("publicaciones de un usuario por nombre", async () => {
    const r = await anonimo.get(`/api/usuarios/${usuarioA.nombre_usuario}/publicaciones`);
    assert.equal(r.status, 200);
    assert.equal(r.datos[0].publicacion_id, publicacionId);
  });

  test("populares responde una lista", async () => {
    const r = await anonimo.get("/api/publicaciones/populares");
    assert.equal(r.status, 200);
    assert.ok(Array.isArray(r.datos));
  });
});

describe("Estado de venta", () => {
  test("solo el dueño cambia el estado", async () => {
    assert.equal((await anonimo.patch(`/api/publicaciones/${publicacionId}/estado`, { json: { estado: "vendido" } })).status, 401);
    assert.equal((await b.patch(`/api/publicaciones/${publicacionId}/estado`, { json: { estado: "vendido" } })).status, 403);
  });

  test("estado inválido responde 400", async () => {
    assert.equal((await a.patch(`/api/publicaciones/${publicacionId}/estado`, { json: { estado: "regalado" } })).status, 400);
  });

  test("marcar como vendido y filtrar por estado", async () => {
    assert.equal((await a.patch(`/api/publicaciones/${publicacionId}/estado`, { json: { estado: "vendido" } })).status, 200);
    const vendidos = await anonimo.get(`/api/publicaciones?search=${sufijo}&estado=vendido`);
    assert.equal(vendidos.datos.length, 1);
    const disponibles = await anonimo.get(`/api/publicaciones?search=${sufijo}&estado=disponible`);
    assert.equal(disponibles.datos.length, 0);
    await a.patch(`/api/publicaciones/${publicacionId}/estado`, { json: { estado: "disponible" } });
  });
});

describe("Votos y notificaciones", () => {
  test("votar requiere sesión y un tipo válido", async () => {
    assert.equal((await anonimo.post(`/api/publicaciones/${publicacionId}/voto`, { json: { tipo: "upvote" } })).status, 401);
    assert.equal((await b.post(`/api/publicaciones/${publicacionId}/voto`, { json: { tipo: "superlike" } })).status, 400);
    assert.equal((await b.post("/api/publicaciones/999999/voto", { json: { tipo: "upvote" } })).status, 404);
  });

  test("a favor, en contra y quitar el voto", async () => {
    const votar = async (tipo) => (await b.post(`/api/publicaciones/${publicacionId}/voto`, { json: { tipo } })).datos.totalVotes;
    assert.equal(await votar("upvote"), 1);
    assert.equal(await votar("downvote"), -1);
    assert.equal(await votar("unvote"), 0);
    assert.equal(await votar("upvote"), 1);
    const detalle = await b.get(`/api/publicaciones/${publicacionId}`);
    assert.equal(detalle.datos.mi_voto, "upvote");
    assert.equal(detalle.datos.total_votos, 1);
  });

  test("el dueño recibe la notificación del voto", async () => {
    assert.equal((await anonimo.get("/api/notificaciones")).status, 401);
    const total = await a.get("/api/notificaciones/total");
    assert.equal(total.datos.total_notificaciones, 1);
    const lista = await a.get("/api/notificaciones");
    assert.equal(lista.datos[0].nombre_usuario, usuarioB.nombre_usuario);
    assert.equal(lista.datos[0].publicacion_id, publicacionId);
  });
});

describe("Comentarios", () => {
  let comentarioId;

  test("comentar requiere sesión y contenido", async () => {
    const ruta = `/api/publicaciones/${publicacionId}/comentarios`;
    assert.equal((await anonimo.post(ruta, { json: { contenido: "Hola" } })).status, 401);
    assert.equal((await b.post(ruta, { json: { contenido: "   " } })).status, 400);
    assert.equal((await b.post("/api/publicaciones/999999/comentarios", { json: { contenido: "Hola" } })).status, 404);
  });

  test("comentar y responder", async () => {
    const c = await b.post(`/api/publicaciones/${publicacionId}/comentarios`, { json: { contenido: "¿Sigue disponible? 🚲" } });
    assert.equal(c.status, 201);
    comentarioId = c.datos.comentario_id;
    const r = await a.post(`/api/comentarios/${comentarioId}/respuestas`, { json: { contenido: "¡Sí!" } });
    assert.equal(r.status, 201);
    assert.equal(r.datos.respuesta.usuario_reply_id, (await b.get("/api/auth/me")).datos.usuario_id);
    assert.equal((await a.post("/api/comentarios/999999/respuestas", { json: { contenido: "x" } })).status, 404);
  });

  test("listar comentarios y respuestas", async () => {
    const lista = await anonimo.get(`/api/publicaciones/${publicacionId}/comentarios`);
    assert.equal(lista.status, 200);
    assert.equal(lista.datos.comentarios.length, 1);
    assert.equal(lista.datos.totalComentarios, 2);
    assert.equal(lista.datos.comentarios[0].contenido, "¿Sigue disponible? 🚲");
    const respuestas = await anonimo.get(`/api/comentarios/${comentarioId}/respuestas`);
    assert.equal(respuestas.datos.respuestas.length, 1);
  });

  test("solo el autor borra su comentario (y sus respuestas con él)", async () => {
    assert.equal((await a.delete(`/api/comentarios/${comentarioId}`)).status, 403);
    assert.equal((await b.delete(`/api/comentarios/${comentarioId}`)).status, 200);
    assert.equal((await b.delete(`/api/comentarios/${comentarioId}`)).status, 404);
    const lista = await anonimo.get(`/api/publicaciones/${publicacionId}/comentarios`);
    assert.equal(lista.datos.totalComentarios, 0);
  });
});

describe("Guardados", () => {
  test("requieren sesión", async () => {
    assert.equal((await anonimo.get("/api/guardados")).status, 401);
    assert.equal((await anonimo.put(`/api/guardados/${publicacionId}`)).status, 401);
  });

  test("guardar (dos veces no duplica), listar y quitar", async () => {
    assert.equal((await b.put(`/api/guardados/${publicacionId}`)).status, 200);
    assert.equal((await b.put(`/api/guardados/${publicacionId}`)).status, 200);
    const lista = await b.get("/api/guardados");
    assert.deepEqual(
      lista.datos.map((p) => p.publicacion_id),
      [publicacionId]
    );
    assert.equal(lista.datos[0].total_imagenes, 2);
    assert.equal((await b.get(`/api/publicaciones/${publicacionId}`)).datos.guardado, 1);
    assert.equal((await b.delete(`/api/guardados/${publicacionId}`)).status, 200);
    assert.equal((await b.get("/api/guardados")).datos.length, 0);
  });

  test("guardar una publicación inexistente responde 404", async () => {
    assert.equal((await b.put("/api/guardados/999999")).status, 404);
  });
});

describe("Eliminar publicación y cerrar sesión", () => {
  test("solo el dueño elimina; también se borran sus fotos del disco", async () => {
    assert.equal((await b.delete(`/api/publicaciones/${publicacionId}`)).status, 403);
    assert.equal((await a.delete(`/api/publicaciones/${publicacionId}`)).status, 200);
    assert.equal((await anonimo.get(`/api/publicaciones/${publicacionId}`)).status, 404);
    for (const f of fotosPublicacion) assert.equal(fs.existsSync(path.join(uploadsDir, f)), false, f);
  });

  test("cerrar sesión invalida la cookie", async () => {
    assert.equal((await a.post("/api/auth/logout")).status, 200);
    assert.equal((await a.get("/api/auth/me")).status, 401);
  });
});

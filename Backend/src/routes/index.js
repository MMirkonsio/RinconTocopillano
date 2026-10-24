// Rutas de la API REST. Todas cuelgan de /api (ver app.js).
//
//   Autenticación   POST /auth/login · POST /auth/logout · GET /auth/me · POST /auth/registro
//   Usuarios        GET /usuarios/:nombre · GET /usuarios/:nombre/publicaciones · GET /usuarios/id/:id
//   Perfil propio   GET /perfil · PATCH /perfil
//   Publicaciones   GET /publicaciones (?search, categoria, orden, estado) · POST /publicaciones
//                   GET /publicaciones/populares · GET|DELETE /publicaciones/:id
//                   PATCH /publicaciones/:id/estado · POST /publicaciones/:id/voto
//   Comentarios     GET|POST /publicaciones/:id/comentarios
//                   GET|POST /comentarios/:id/respuestas · DELETE /comentarios/:id
//   Guardados       GET /guardados · PUT|DELETE /guardados/:id
//   Notificaciones  GET /notificaciones · GET /notificaciones/total
//   Salud           GET /salud
const { Router } = require("express");
const { rateLimit } = require("express-rate-limit");
const { db } = require("../db");
const { requireAuth } = require("../middlewares/auth");
const { conImagen, conImagenes } = require("../middlewares/upload");
const auth = require("../controllers/authController");
const perfiles = require("../controllers/perfilesController");
const publicaciones = require("../controllers/publicacionesController");
const comentarios = require("../controllers/comentariosController");
const votos = require("../controllers/votosController");
const guardados = require("../controllers/guardadosController");
const notificaciones = require("../controllers/notificacionesController");

const router = Router();

// Máximo 20 intentos de login/registro cada 15 minutos por IP
const limiteAuth = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: Number(process.env.LIMITE_AUTH) || 20,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: { error: "Demasiados intentos. Prueba de nuevo en unos minutos." },
});

// Salud: sirve para comprobar que la API y la base de datos responden
router.get("/salud", async (req, res) => {
  await db.query("SELECT 1");
  res.json({ ok: true });
});

// Autenticación
router.post("/auth/login", limiteAuth, auth.login);
router.post("/auth/logout", auth.logout);
router.get("/auth/me", requireAuth, auth.me);
router.post("/auth/registro", limiteAuth, conImagen("foto_perfil", auth.registro));

// Usuarios y perfil propio
router.get("/usuarios/id/:id", perfiles.obtenerPorId);
router.get("/usuarios/:nombre", perfiles.obtenerPorNombre);
router.get("/usuarios/:nombre/publicaciones", publicaciones.listarPorUsuario);
router.get("/perfil", requireAuth, perfiles.miPerfil);
router.patch("/perfil", requireAuth, perfiles.actualizar);

// Publicaciones
router.get("/publicaciones", publicaciones.buscar);
router.post("/publicaciones", requireAuth, conImagenes("imagenes", publicaciones.publicar));
router.get("/publicaciones/populares", publicaciones.populares);
router.get("/publicaciones/:id", publicaciones.obtener);
router.delete("/publicaciones/:id", requireAuth, publicaciones.eliminar);
router.patch("/publicaciones/:id/estado", requireAuth, publicaciones.cambiarEstado);
router.post("/publicaciones/:id/voto", requireAuth, votos.votar);

// Comentarios
router.get("/publicaciones/:id/comentarios", comentarios.listarPorPublicacion);
router.post("/publicaciones/:id/comentarios", requireAuth, comentarios.comentar);
router.get("/comentarios/:id/respuestas", comentarios.listarRespuestas);
router.post("/comentarios/:id/respuestas", requireAuth, comentarios.responder);
router.delete("/comentarios/:id", requireAuth, comentarios.eliminar);

// Guardados
router.get("/guardados", requireAuth, guardados.listar);
router.put("/guardados/:id", requireAuth, guardados.guardar);
router.delete("/guardados/:id", requireAuth, guardados.quitar);

// Notificaciones
router.get("/notificaciones", requireAuth, notificaciones.listar);
router.get("/notificaciones/total", requireAuth, notificaciones.contar);

module.exports = router;

const { db, existe } = require("../db");
const { usuarioActualId } = require("../middlewares/auth");
const { HttpError, toId } = require("../utils/validacion");

// GET /api/guardados: publicaciones guardadas por el usuario de la sesión
const listar = async (req, res) => {
  const [rows] = await db.query(
    `SELECT p.*, g.guardado_id, g.tipo, u.nombre_usuario, u.foto_perfil, c.nombre_categoria,
            (SELECT COUNT(*) FROM publicacion_imagenes pi WHERE pi.publicacion_id = p.publicacion_id) AS total_imagenes
     FROM guardados g
     INNER JOIN publicaciones p ON g.publicacion_id = p.publicacion_id
     INNER JOIN usuarios u ON p.usuario_id = u.id
     INNER JOIN categorias c ON p.categoria_id = c.categoria_id
     WHERE g.usuario_id = ?
     ORDER BY g.guardado_id DESC`,
    [usuarioActualId(req)]
  );
  res.json(rows);
};

// PUT /api/guardados/:id: guarda la publicación (si ya estaba guardada no cambia nada)
const guardar = async (req, res) => {
  const publicacion_id = toId(req.params.id);
  if (!(await existe("publicaciones", "publicacion_id", publicacion_id))) {
    throw new HttpError(404, "Publicación no encontrada");
  }
  await db.query(
    "INSERT IGNORE INTO guardados (usuario_id, publicacion_id, tipo) VALUES (?, ?, 'guardado')",
    [usuarioActualId(req), publicacion_id]
  );
  res.json({ message: "Publicación guardada", guardado: true });
};

// DELETE /api/guardados/:id: la quita de guardados
const quitar = async (req, res) => {
  await db.query("DELETE FROM guardados WHERE usuario_id = ? AND publicacion_id = ?", [
    usuarioActualId(req),
    toId(req.params.id),
  ]);
  res.json({ message: "Publicación quitada de guardados", guardado: false });
};

module.exports = { listar, guardar, quitar };

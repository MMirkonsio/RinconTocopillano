const { db } = require("../db");
const { usuarioActualId } = require("../middlewares/auth");

// Notificaciones: votos que otros usuarios dieron a las publicaciones del usuario
const listar = async (req, res) => {
  const [rows] = await db.query(
    `SELECT v.id AS voto_id, v.tipo, v.usuario_id, p.publicacion_id, p.titulo,
            u.nombre_usuario, u.foto_perfil
     FROM votos v
     INNER JOIN publicaciones p ON v.publicacion_id = p.publicacion_id
     INNER JOIN usuarios u ON v.usuario_id = u.id
     WHERE p.usuario_id = ? AND v.tipo IN ('upvote', 'downvote') AND v.usuario_id != p.usuario_id
     ORDER BY v.id DESC`,
    [usuarioActualId(req)]
  );
  res.json(rows);
};

const contar = async (req, res) => {
  const [rows] = await db.query(
    `SELECT COUNT(*) AS total_notificaciones
     FROM votos v
     INNER JOIN publicaciones p ON v.publicacion_id = p.publicacion_id
     WHERE p.usuario_id = ? AND v.tipo = 'upvote' AND v.usuario_id != p.usuario_id`,
    [usuarioActualId(req)]
  );
  res.json(rows[0]);
};

module.exports = { listar, contar };

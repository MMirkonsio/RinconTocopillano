const { db, existe } = require("../db");
const { usuarioActualId } = require("../middlewares/auth");
const { HttpError, toId } = require("../utils/validacion");

const TIPOS = ["upvote", "downvote", "unvote"];

const totalVotos = async (publicacion_id) => {
  const [rows] = await db.query(
    `SELECT COALESCE(SUM(CASE WHEN tipo = 'upvote' THEN 1 WHEN tipo = 'downvote' THEN -1 ELSE 0 END), 0) AS total
     FROM votos WHERE publicacion_id = ?`,
    [publicacion_id]
  );
  return Number(rows[0].total);
};

// POST /api/publicaciones/:id/voto  { tipo: "upvote" | "downvote" | "unvote" (quitar el voto) }
const votar = async (req, res) => {
  const publicacion_id = toId(req.params.id);
  const { tipo } = req.body;
  if (!TIPOS.includes(tipo)) {
    throw new HttpError(400, "Tipo de voto no válido: usa upvote, downvote o unvote");
  }
  if (!(await existe("publicaciones", "publicacion_id", publicacion_id))) {
    throw new HttpError(404, "Publicación no encontrada");
  }

  // Un voto por usuario y publicación (clave única): insertar o cambiar el tipo
  await db.query(
    `INSERT INTO votos (publicacion_id, usuario_id, tipo) VALUES (?, ?, ?)
     ON DUPLICATE KEY UPDATE tipo = VALUES(tipo)`,
    [publicacion_id, usuarioActualId(req), tipo]
  );

  res.status(200).json({ totalVotes: await totalVotos(publicacion_id), tipo });
};

module.exports = { votar };

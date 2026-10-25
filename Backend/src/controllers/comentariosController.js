const { db, existe } = require("../db");
const { usuarioActualId } = require("../middlewares/auth");
const { HttpError, toId, texto } = require("../utils/validacion");

const comentar = async (req, res) => {
  const publicacion_id = toId(req.params.id);
  const contenido = texto(req.body.contenido, "El comentario", { max: 150 });

  if (!(await existe("publicaciones", "publicacion_id", publicacion_id))) {
    throw new HttpError(404, "Publicación no encontrada");
  }

  const [result] = await db.query(
    "INSERT INTO comentarios (publicacion_id, usuario_id, contenido, tiempo_comentario) VALUES (?, ?, ?, NOW())",
    [publicacion_id, usuarioActualId(req), contenido]
  );
  res.status(201).json({ message: "Comentario insertado correctamente", comentario_id: result.insertId });
};

// Responde a un comentario. Se responde siempre al autor del comentario original.
const responder = async (req, res) => {
  const comentario_id = toId(req.params.id);
  const contenido = texto(req.body.contenido, "La respuesta", { max: 150 });

  const [padre] = await db.query(
    "SELECT publicacion_id, usuario_id FROM comentarios WHERE comentario_id = ? AND comentario_padre_id IS NULL",
    [comentario_id]
  );
  if (padre.length === 0) throw new HttpError(404, "El comentario al que respondes no existe");

  const [result] = await db.query(
    "INSERT INTO comentarios (publicacion_id, comentario_padre_id, usuario_id, usuario_reply_id, contenido, tiempo_comentario) VALUES (?, ?, ?, ?, ?, NOW())",
    [padre[0].publicacion_id, comentario_id, usuarioActualId(req), padre[0].usuario_id, contenido]
  );

  const [respuestas] = await db.query(
    `SELECT c.comentario_id, c.publicacion_id, c.usuario_id, c.contenido, c.tiempo_comentario,
            c.usuario_reply_id, u.nombre_usuario, u.foto_perfil
     FROM comentarios c JOIN usuarios u ON c.usuario_id = u.id
     WHERE c.comentario_id = ?`,
    [result.insertId]
  );
  res.status(201).json({
    message: "Respuesta insertada correctamente",
    comentario_id: result.insertId,
    respuesta: respuestas[0],
  });
};

const listarRespuestas = async (req, res) => {
  const [respuestas] = await db.query(
    `SELECT c.comentario_id, c.publicacion_id, c.usuario_id, c.contenido, c.tiempo_comentario,
            c.usuario_reply_id,
            u1.nombre_usuario AS nombre_usuario, u1.foto_perfil AS foto_perfil,
            u2.nombre_usuario AS nombre_usuario_reply, u2.foto_perfil AS foto_perfil_reply
     FROM comentarios c
     JOIN usuarios u1 ON c.usuario_id = u1.id
     LEFT JOIN usuarios u2 ON c.usuario_reply_id = u2.id
     WHERE c.comentario_padre_id = ?
     ORDER BY c.comentario_id ASC`,
    [toId(req.params.id)]
  );
  res.status(200).json({ respuestas });
};

// Comentarios principales de una publicación y el total (incluidas las respuestas)
const listarPorPublicacion = async (req, res) => {
  const publicacion_id = toId(req.params.id);
  const [[comentarios], [conteo]] = await Promise.all([
    db.query(
      `SELECT c.comentario_id, c.publicacion_id, c.usuario_id, c.contenido, c.tiempo_comentario,
              u.nombre_usuario, u.foto_perfil
       FROM comentarios c
       INNER JOIN usuarios u ON c.usuario_id = u.id
       WHERE c.publicacion_id = ? AND c.comentario_padre_id IS NULL
       ORDER BY c.tiempo_comentario DESC`,
      [publicacion_id]
    ),
    db.query("SELECT COUNT(*) AS totalComentarios FROM comentarios WHERE publicacion_id = ?", [
      publicacion_id,
    ]),
  ]);
  res.status(200).json({ comentarios, totalComentarios: conteo[0].totalComentarios });
};

// Solo el autor puede borrar su comentario (las respuestas se borran en cascada)
const eliminar = async (req, res) => {
  const comentario_id = toId(req.params.id);
  const [rows] = await db.query("SELECT usuario_id FROM comentarios WHERE comentario_id = ?", [
    comentario_id,
  ]);
  if (rows.length === 0) return res.status(404).json({ error: "Comentario no encontrado" });
  if (rows[0].usuario_id !== usuarioActualId(req)) {
    return res.status(403).json({ error: "No tienes permiso para eliminar este comentario" });
  }

  await db.query("DELETE FROM comentarios WHERE comentario_id = ?", [comentario_id]);
  res.status(200).json({ message: "Comentario y sus respuestas eliminados exitosamente" });
};

module.exports = { comentar, responder, listarRespuestas, listarPorPublicacion, eliminar };

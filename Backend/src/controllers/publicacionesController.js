const { db, existe } = require("../db");
const { usuarioActualId } = require("../middlewares/auth");
const { HttpError, toId, texto } = require("../utils/validacion");
const { borrarImagenesSinUso } = require("../utils/archivos");

// Publicación con su autor, categoría, votos y comentarios. Si hay sesión, también
// el voto del usuario (`mi_voto`) y si la tiene guardada (`guardado`).
// Devuelve el SQL y los parámetros iniciales (el id del usuario, 0 si no hay sesión).
const selectPublicaciones = (req) => {
  const uid = usuarioActualId(req) || 0;
  return {
    sql: `
      SELECT p.*, u.nombre_usuario, u.foto_perfil, c.nombre_categoria,
        (SELECT CAST(COALESCE(SUM(CASE v.tipo WHEN 'upvote' THEN 1 WHEN 'downvote' THEN -1 ELSE 0 END), 0) AS SIGNED)
           FROM votos v WHERE v.publicacion_id = p.publicacion_id) AS total_votos,
        (SELECT COUNT(*) FROM comentarios cm WHERE cm.publicacion_id = p.publicacion_id) AS total_comentarios,
        (SELECT v2.tipo FROM votos v2 WHERE v2.publicacion_id = p.publicacion_id AND v2.usuario_id = ?) AS mi_voto,
        EXISTS(SELECT 1 FROM guardados g WHERE g.publicacion_id = p.publicacion_id AND g.usuario_id = ?) AS guardado,
        (SELECT GROUP_CONCAT(pi.archivo ORDER BY pi.orden SEPARATOR '|')
           FROM publicacion_imagenes pi WHERE pi.publicacion_id = p.publicacion_id) AS imagenes
      FROM publicaciones p
      INNER JOIN usuarios u ON p.usuario_id = u.id
      INNER JOIN categorias c ON p.categoria_id = c.categoria_id`,
    params: [uid, uid],
  };
};

// "a.jpg|b.jpg" → ["a.jpg", "b.jpg"] (con la portada como respaldo si no hay filas)
const conImagenes = (rows) =>
  rows.map((r) => ({
    ...r,
    imagenes: r.imagenes ? r.imagenes.split("|") : r.imagen_contenido ? [r.imagen_contenido] : [],
  }));

const ESTADOS = ["disponible", "reservado", "vendido"];

const ORDENES = {
  recientes: "p.tiempo_publicacion DESC",
  populares: "total_votos DESC, p.tiempo_publicacion DESC",
  comentadas: "total_comentarios DESC, p.tiempo_publicacion DESC",
};

const publicar = async (req, res) => {
  const titulo = texto(req.body.titulo, "Título", { max: 75 });
  const contenido = texto(req.body.contenido, "Descripción", { max: 255 });
  const precio = Number(String(req.body.precio ?? "").replace(/[^\d]/g, ""));
  const categoria_id = toId(req.body.categoria_id);

  if (!Number.isSafeInteger(precio) || precio < 0 || precio > 9999999999) {
    throw new HttpError(400, "El precio no es válido");
  }
  const archivos = req.files ?? [];
  if (archivos.length === 0) throw new HttpError(400, "Debes adjuntar al menos una imagen");
  if (!(await existe("categorias", "categoria_id", categoria_id))) {
    throw new HttpError(400, "La categoría no existe");
  }

  // La publicación y sus fotos se guardan juntas o no se guarda nada
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();
    const [result] = await conn.query(
      `INSERT INTO publicaciones (usuario_id, categoria_id, titulo, contenido, precio, tiempo_publicacion, imagen_contenido)
       VALUES (?, ?, ?, ?, ?, NOW(), ?)`,
      [usuarioActualId(req), categoria_id, titulo, contenido, precio, archivos[0].filename]
    );
    await conn.query("INSERT INTO publicacion_imagenes (publicacion_id, archivo, orden) VALUES ?", [
      archivos.map((a, i) => [result.insertId, a.filename, i]),
    ]);
    await conn.commit();
    res.status(201).json({ message: "Publicación exitosa", publicacion_id: result.insertId });
  } catch (error) {
    await conn.rollback();
    throw error;
  } finally {
    conn.release();
  }
};

const obtener = async (req, res) => {
  const { sql, params } = selectPublicaciones(req);
  // El teléfono del autor ya es público en su perfil; aquí sirve para el botón de contacto
  const [rows] = await db.query(
    `SELECT t.*, u.telefono FROM (${sql} WHERE p.publicacion_id = ?) t
     INNER JOIN usuarios u ON u.id = t.usuario_id`,
    [...params, toId(req.params.id)]
  );
  if (rows.length === 0) return res.status(404).json({ error: "Publicación no encontrada" });
  res.json(conImagenes(rows)[0]);
};

// Búsqueda con filtros opcionales: ?search=texto&categoria=ID&orden=recientes|populares|comentadas
// &estado=disponible|reservado|vendido
const buscar = async (req, res) => {
  const { sql, params } = selectPublicaciones(req);
  const searchTerm = typeof req.query.search === "string" ? req.query.search.slice(0, 100) : "";
  // Escapar los comodines de LIKE para buscar el texto tal cual
  const like = `%${searchTerm.replace(/[\\%_]/g, "\\$&")}%`;
  const condiciones = ["(p.titulo LIKE ? OR p.contenido LIKE ?)"];
  const valores = [like, like];

  const categoria_id = toId(req.query.categoria);
  if (categoria_id) {
    condiciones.push("p.categoria_id = ?");
    valores.push(categoria_id);
  }
  if (ESTADOS.includes(req.query.estado)) {
    condiciones.push("p.estado = ?");
    valores.push(req.query.estado);
  }
  const orden = ORDENES[req.query.orden] || ORDENES.recientes;

  const [rows] = await db.query(`${sql} WHERE ${condiciones.join(" AND ")} ORDER BY ${orden}`, [
    ...params,
    ...valores,
  ]);
  res.json(conImagenes(rows));
};

// Publicaciones de un usuario, por su nombre (/api/usuarios/:nombre/publicaciones)
const listarPorUsuario = async (req, res) => {
  const { sql, params } = selectPublicaciones(req);
  const [rows] = await db.query(`${sql} WHERE u.nombre_usuario = ? ORDER BY p.tiempo_publicacion DESC`, [
    ...params,
    String(req.params.nombre),
  ]);
  res.json(conImagenes(rows));
};

// Solo el dueño puede borrar su publicación
const eliminar = async (req, res) => {
  const publicacion_id = toId(req.params.id);
  const [rows] = await db.query(
    "SELECT usuario_id, imagen_contenido FROM publicaciones WHERE publicacion_id = ?",
    [publicacion_id]
  );
  if (rows.length === 0) return res.status(404).json({ message: "Publicación no encontrada" });
  if (rows[0].usuario_id !== usuarioActualId(req)) {
    return res.status(403).json({ message: "No tienes permiso para eliminar esta publicación" });
  }

  // Anotar sus fotos antes de borrar: las filas de publicacion_imagenes desaparecen en cascada
  const [fotos] = await db.query("SELECT archivo FROM publicacion_imagenes WHERE publicacion_id = ?", [
    publicacion_id,
  ]);
  const archivos = [rows[0].imagen_contenido, ...fotos.map((f) => f.archivo)];

  // Comentarios, votos, guardados y fotos se borran por las claves foráneas
  await db.query("DELETE FROM publicaciones WHERE publicacion_id = ?", [publicacion_id]);

  // Borrar del disco solo las fotos que ninguna otra publicación o perfil usa.
  // Si falla, la publicación ya está eliminada: se registra y se responde igual.
  try {
    await borrarImagenesSinUso(archivos);
  } catch (error) {
    console.error("No se pudieron borrar las fotos de la publicación:", error);
  }
  res.status(200).json({ message: "Publicación eliminada correctamente" });
};

// Marca la publicación como disponible, reservada o vendida (solo su dueño)
const cambiarEstado = async (req, res) => {
  const publicacion_id = toId(req.params.id);
  const { estado } = req.body;
  if (!ESTADOS.includes(estado)) {
    throw new HttpError(400, "Estado no válido: usa disponible, reservado o vendido");
  }

  const [rows] = await db.query("SELECT usuario_id FROM publicaciones WHERE publicacion_id = ?", [
    publicacion_id,
  ]);
  if (rows.length === 0) throw new HttpError(404, "Publicación no encontrada");
  if (rows[0].usuario_id !== usuarioActualId(req)) {
    throw new HttpError(403, "No tienes permiso para cambiar esta publicación");
  }

  await db.query("UPDATE publicaciones SET estado = ? WHERE publicacion_id = ?", [estado, publicacion_id]);
  res.json({ message: "Estado actualizado", estado });
};

// Las 10 publicaciones con más votos positivos netos
const populares = async (req, res) => {
  const { sql, params } = selectPublicaciones(req);
  const [rows] = await db.query(
    `SELECT t.*, t.total_votos AS likes FROM (${sql}) t
     WHERE t.total_votos > 0
     ORDER BY t.total_votos DESC, t.tiempo_publicacion DESC
     LIMIT 10`,
    params
  );
  res.json(conImagenes(rows));
};

module.exports = {
  publicar,
  obtener,
  buscar,
  listarPorUsuario,
  eliminar,
  cambiarEstado,
  populares,
};

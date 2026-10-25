const { db, COLUMNAS_PUBLICAS_USUARIO } = require("../db");
const { usuarioActualId } = require("../middlewares/auth");
const { HttpError, toId, texto, validarCorreo, validarTelefono, validarNombreUsuario } = require("../utils/validacion");

// Perfil público. El correo solo se incluye si es el perfil de quien consulta.
const buscarPerfil = async (req, columna, valor) => {
  const [rows] = await db.query(`SELECT ${COLUMNAS_PUBLICAS_USUARIO}, correo FROM usuarios WHERE ${columna} = ?`, [valor]);
  if (rows.length === 0) throw new HttpError(404, "Usuario no encontrado");
  const { correo, ...perfil } = rows[0];
  return perfil.id === usuarioActualId(req) ? { ...perfil, correo } : perfil;
};

// GET /api/usuarios/:nombre
const obtenerPorNombre = async (req, res) => {
  res.json(await buscarPerfil(req, "nombre_usuario", String(req.params.nombre)));
};

// GET /api/usuarios/id/:id (para redirigir enlaces antiguos /perfil/:id)
const obtenerPorId = async (req, res) => {
  const id = toId(req.params.id);
  if (!id) throw new HttpError(404, "Usuario no encontrado");
  res.json(await buscarPerfil(req, "id", id));
};

// GET /api/perfil (el de la sesión, con correo)
const miPerfil = async (req, res) => {
  res.json(await buscarPerfil(req, "id", usuarioActualId(req)));
};

// Campos editables del perfil: [nombre para los errores, largo mínimo, largo máximo]
const CAMPOS_EDITABLES = {
  nombre_usuario: ["Nombre de usuario", 3, 25],
  correo: ["Correo", 3, 100],
  telefono: ["Teléfono", 0, 20],
  descripcion: ["Descripción", 0, 255],
  direccion: ["Dirección", 0, 255],
  horario: ["Horario", 0, 100],
};

// PATCH /api/perfil: edita el perfil de la sesión (nunca la contraseña ni el id)
const actualizar = async (req, res) => {
  const nuevoPerfil = {};
  for (const [campo, [nombre, min, max]] of Object.entries(CAMPOS_EDITABLES)) {
    if (req.body[campo] !== undefined) {
      nuevoPerfil[campo] = texto(req.body[campo], nombre, { min, max });
    }
  }
  if (Object.keys(nuevoPerfil).length === 0) {
    throw new HttpError(400, "No hay datos para actualizar.");
  }
  if (nuevoPerfil.nombre_usuario !== undefined) validarNombreUsuario(nuevoPerfil.nombre_usuario);
  if (nuevoPerfil.correo !== undefined) {
    nuevoPerfil.correo = nuevoPerfil.correo.toLowerCase();
    validarCorreo(nuevoPerfil.correo);
  }
  validarTelefono(nuevoPerfil.telefono);

  try {
    await db.query("UPDATE usuarios SET ? WHERE id = ?", [nuevoPerfil, usuarioActualId(req)]);
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      throw new HttpError(400, "El nombre de usuario o el correo ya están en uso.");
    }
    throw error;
  }

  // Mantener la sesión al día si cambió el nombre o el correo
  Object.assign(req.session.usuario, {
    nombre_usuario: nuevoPerfil.nombre_usuario ?? req.session.usuario.nombre_usuario,
    correo: nuevoPerfil.correo ?? req.session.usuario.correo,
  });
  res.json({ message: "Perfil actualizado correctamente.", usuario: req.session.usuario });
};

module.exports = { obtenerPorNombre, obtenerPorId, miPerfil, actualizar };

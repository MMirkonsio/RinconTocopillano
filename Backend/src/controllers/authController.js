const bcrypt = require("bcryptjs");
const { db } = require("../db");
const { HttpError, texto, validarCorreo, validarTelefono, validarNombreUsuario } = require("../utils/validacion");

const login = async (req, res) => {
  const correo = typeof req.body.correo === "string" ? req.body.correo.trim().toLowerCase() : "";
  const password = typeof req.body.password === "string" ? req.body.password : "";

  const [rows] = await db.query(
    "SELECT id, correo, nombre_usuario, password FROM usuarios WHERE correo = ?",
    [correo]
  );
  const user = rows[0];

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: "Credenciales inválidas" });
  }

  const usuarioAutenticado = {
    usuario_id: user.id,
    correo: user.correo,
    nombre_usuario: user.nombre_usuario,
  };

  // Nueva sesión al iniciar sesión (evita la fijación de sesión)
  await new Promise((resolve, reject) =>
    req.session.regenerate((err) => (err ? reject(err) : resolve()))
  );
  req.session.usuario = usuarioAutenticado;
  res.json(usuarioAutenticado);
};

const logout = (req, res) => {
  req.session.destroy(() => {
    res.clearCookie("rincon.sid");
    res.json({ message: "Sesión cerrada" });
  });
};

// Devuelve el usuario de la sesión actual (el frontend lo usa al cargar)
const me = (req, res) => {
  res.json(req.session.usuario);
};

const registro = async (req, res) => {
  const nombre_usuario = texto(req.body.nombre_usuario, "Nombre de usuario", { min: 3, max: 25 });
  const correo = texto(req.body.correo, "Correo", { max: 100 }).toLowerCase();
  const telefono = texto(req.body.telefono, "Teléfono", { min: 0, max: 20 });
  const password = typeof req.body.password === "string" ? req.body.password : "";

  validarNombreUsuario(nombre_usuario);
  validarCorreo(correo);
  validarTelefono(telefono);
  if (password.length < 8 || password.length > 72) {
    throw new HttpError(400, "La contraseña debe tener entre 8 y 72 caracteres");
  }

  // Verificar que el nombre de usuario, el correo y el teléfono no estén en uso
  const [existentes] = await db.query(
    "SELECT nombre_usuario, correo, telefono FROM usuarios WHERE nombre_usuario = ? OR correo = ? OR (telefono <> '' AND telefono = ?)",
    [nombre_usuario, correo, telefono]
  );
  for (const u of existentes) {
    if (u.nombre_usuario.toLowerCase() === nombre_usuario.toLowerCase()) {
      throw new HttpError(400, "El nombre de usuario ya está en uso");
    }
    if (u.correo.toLowerCase() === correo) throw new HttpError(400, "El correo ya está en uso");
    if (telefono && u.telefono === telefono) throw new HttpError(400, "El teléfono ya está en uso");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const foto_perfil = req.file ? req.file.filename : "default.webp";

  await db.query(
    "INSERT INTO usuarios (nombre_usuario, correo, telefono, password, foto_perfil) VALUES (?, ?, ?, ?, ?)",
    [nombre_usuario, correo, telefono, hashedPassword, foto_perfil]
  );
  res.json({ message: "Usuario registrado exitosamente" });
};

module.exports = { login, logout, me, registro };

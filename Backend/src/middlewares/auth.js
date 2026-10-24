const usuarioActualId = (req) => req.session.usuario?.usuario_id;

// Rechaza la petición si no hay sesión iniciada
const requireAuth = (req, res, next) => {
  if (!usuarioActualId(req)) {
    return res.status(401).json({ error: "Debes iniciar sesión" });
  }
  next();
};

module.exports = { usuarioActualId, requireAuth };

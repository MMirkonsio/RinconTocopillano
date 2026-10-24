const multer = require("multer");
const { HttpError } = require("../utils/validacion");

const noEncontrado = (req, res) => {
  res.status(404).json({ error: "Ruta no encontrada" });
};

// Express 5 envía aquí también los errores de los handlers async
// eslint-disable-next-line no-unused-vars
const manejarErrores = (err, req, res, next) => {
  if (err instanceof HttpError) {
    return res.status(err.status).json({ error: err.message });
  }
  if (err instanceof multer.MulterError) {
    const mensajes = {
      LIMIT_FILE_SIZE: "Cada imagen puede pesar como máximo 5 MB",
      LIMIT_FILE_COUNT: "Puedes subir como máximo 8 imágenes",
      LIMIT_UNEXPECTED_FILE: "Demasiadas imágenes o campo de imagen no válido",
    };
    const mensaje = mensajes[err.code] ?? "Error al subir la imagen";
    return res.status(400).json({ error: mensaje });
  }
  if (err.type === "entity.too.large") {
    return res.status(413).json({ error: "La solicitud es demasiado grande" });
  }
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ error: "JSON no válido" });
  }
  // No mostrar detalles internos (SQL, rutas) al cliente
  console.error("Error no controlado:", err);
  res.status(500).json({ error: "Error interno del servidor" });
};

module.exports = { noEncontrado, manejarErrores };
